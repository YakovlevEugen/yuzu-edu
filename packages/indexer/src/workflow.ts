import {
  WorkflowEntrypoint,
  type WorkflowEvent,
  type WorkflowStep
} from 'cloudflare:workers';
import { createContext } from './helpers';
import { runScheduledJobs } from './schedule';
import type { IEnv } from './types';

export class ScheduleWorkflow extends WorkflowEntrypoint<IEnv, Params> {
  async run(event: WorkflowEvent<Params>, step: WorkflowStep) {
    await step.do('index', async () => {
      const context = createContext(event, this.env, this.ctx);
      await runScheduledJobs(context);
    });

    await step.sleep('idle', '5 seconds');

    await step.do('loop', async () => {
      await this.env.SCHEDULE.create().catch((err) => console.error(err));
    });
  }
}
