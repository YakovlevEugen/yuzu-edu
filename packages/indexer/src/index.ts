/**
 * Entrypoint
 */

import app from './routes';

export default app;

export {
  ScheduleWorkflow,
  ParallelWorkflow,
  MerkleClaimWorkflow
} from './workflow';
