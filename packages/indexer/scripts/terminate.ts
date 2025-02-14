import 'dotenv/config';
import Cloudflare from 'cloudflare';

const { CF_EMAIL, CF_KEY, CF_ACCOUNT_ID } = process.env as Record<
  string,
  string
>;

const cf = new Cloudflare({
  apiEmail: CF_EMAIL,
  apiToken: CF_KEY
});

(async () => {
  const [queued, running] = await Promise.all([
    cf.workflows.instances.list('schedule', {
      account_id: CF_ACCOUNT_ID,
      status: 'queued'
    }),
    cf.workflows.instances.list('schedule', {
      account_id: CF_ACCOUNT_ID,
      status: 'running'
    })
  ]);

  const workflows = queued.result.concat(running.result);

  for (const item of workflows) {
    console.log(
      await cf.workflows.instances.status.edit('schedule', item.id, {
        account_id: CF_ACCOUNT_ID,
        status: 'terminate'
      })
    );
  }
})();
