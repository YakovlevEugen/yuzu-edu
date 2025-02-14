/**
 * Entrypoint
 */

import app from './routes';
import { scheduled } from './schedule';

const { fetch } = app;
export default { fetch, scheduled };
export { ScheduleWorkflow } from './workflow';
