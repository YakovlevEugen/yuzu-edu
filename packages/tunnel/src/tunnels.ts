import assert from 'assert';
import { spawn } from 'child_process';
import fs from 'fs';
import { resolve } from 'path';
import { tunnel } from 'cloudflared';

export async function withTunnel() {
  const { cloudflared } = JSON.parse(
    fs.readFileSync(resolve(process.cwd(), 'package.json'), 'utf8')
  );

  assert(cloudflared, 'cloudflared config in package.json is missing');

  const cmd = process.argv.slice(2);

  const replace =
    (dict: Record<string, string | undefined>) => (source: string) =>
      Object.entries(dict).reduce(
        (src, [key, value]) => src.replace(key, value || ''),
        source
      );

  const replaceEnv = replace({
    $HOME: process.env.HOME,
    $USER: process.env.USER
  });

  const name = replaceEnv(cloudflared.name);
  const hostname = replaceEnv(cloudflared.hostname);
  const credFile = replaceEnv(`$HOME/.cloudflared/${name}.json`);
  const originCert = resolve(__dirname, '../cert.pem');

  const config = {
    '--name': name,
    '--origincert': originCert,
    '--hostname': hostname,
    '--url': cloudflared.target,
    '--cred-file': credFile,
    '-f': 'true'
  };

  // process.env.VERBOSE = "true";

  const remote = tunnel(config);

  console.log(
    '⏳ Launching a tunnel',
    `https://${hostname} -> ${cloudflared.target}`
  );

  Promise.all(remote.connections).then(() =>
    console.log(
      '✅ Launched a tunnel',
      `https://${hostname} -> ${cloudflared.target}`
    )
  );

  process.on('SIGTERM', () => {
    remote.stop();
    childProcess?.kill('SIGTERM');
  });

  const childProcess = spawn(cmd.join(' '), {
    cwd: process.cwd(),
    shell: true,
    env: process.env,
    stdio: 'inherit'
  }).on('close', () => remote.stop());
}
