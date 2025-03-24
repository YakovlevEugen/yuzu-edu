import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep
} from 'cloudflare:workers';
import { eduMainnet, getPublicClient, toChainId } from '@yuzu/sdk';
import {
  createContext,
  getLastIndexedMerkleClaimBlock,
  setLastIndexedMerkleClaimBlock,
  toChunks
} from './helpers';
import { indexMerkleClaimLogs } from './indexMerkleClaims';
import { runParallelJobs, runScheduledJobs } from './schedule';
import type { IEnv, IPWPayload } from './types';

export class ScheduleWorkflow extends WorkflowEntrypoint<IEnv, IPWPayload> {
  async run(event: WorkflowEvent<IPWPayload>, step: WorkflowStep) {
    await step.do('index', async () => {
      const context = createContext(event, this.env, this.ctx);
      await runScheduledJobs(context);
    });
    // await step.sleep('idle', '1 second');
    await step.do('loop', async () => {
      await this.env.SCHEDULE.create().catch((err) => console.error(err));
    });
  }
}

export class ParallelWorkflow extends WorkflowEntrypoint<IEnv, IPWPayload> {
  async run(event: WorkflowEvent<IPWPayload>, step: WorkflowStep) {
    await step.do('index', async () => {
      const context = createContext(event, this.env, this.ctx);
      await runParallelJobs(context);
    });

    await step.do('loop', async () => {
      await this.env.PARALLEL.create({ params: event.payload }).catch((err) =>
        console.error(err)
      );
    });
  }
}

export class MerkleClaimWorkflow extends WorkflowEntrypoint<IEnv, IPWPayload> {
  async run(event: WorkflowEvent<IPWPayload>, step: WorkflowStep) {
    await step.do('index', async () => {
      const c = createContext(event, this.env, this.ctx);
      const chain = eduMainnet;

      const [from, to] = await Promise.all([
        getLastIndexedMerkleClaimBlock(c, chain.name),
        getPublicClient(toChainId(chain)).getBlockNumber()
      ]);

      const blockRanges = toChunks({ from, to, chunkSize: 1000 });

      for (const { fromBlock, toBlock } of blockRanges) {
        await indexMerkleClaimLogs(c, { chain, fromBlock, toBlock });
        await setLastIndexedMerkleClaimBlock(c, chain.name, toBlock);
        break;
      }
    });

    await step.do('loop', async () => {
      await this.env.MERKLE_CLAIM.create().catch((err) => console.error(err));
    });
  }
}
