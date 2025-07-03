#!/usr/bin/env node
import 'dotenv/config';
import path from 'path';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import ora from 'ora';
import chalk from 'chalk';
import figlet from 'figlet';
import boxen from 'boxen';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const API_PORT = process.env.PORT || '8080';
const DASH_PORT = process.env.DASH_PORT || '3000';
const ENV = process.env.NODE_ENV || 'development';

console.clear();

const banner = figlet.textSync('COREV', { font: 'Block' });
console.log(chalk.hex('#00d084')(banner));

const envInfo = [
  `${chalk.white('Environment')}:     ${chalk.cyan(ENV)}`,
  `${chalk.white('API Port')}:        ${chalk.cyan(`http://localhost:${API_PORT}`)}`,
  `${chalk.white('Dashboard Port')}:  ${chalk.cyan(`http://localhost:${DASH_PORT}`)}`,
].join('\n');

const boxed = boxen(envInfo, {
  padding: 1,
  borderColor: 'gray',
  borderStyle: 'round',
  title: 'Corev Host Environment',
  titleAlignment: 'center',
});

console.log(boxed);

const spinner = ora({ text: 'Initializing Corev services...', color: 'cyan' }).start();

function launchService(name: string, cwd: string, script: string, portEnv: string) {
  const message = `Launching ${name} (${ENV}) on port ${portEnv}`;
  spinner.start(message);
  const child = spawn('npm', ['run', script], {
    cwd,
    stdio: 'ignore',
    env: { ...process.env, PORT: portEnv, NODE_ENV: ENV },
  });

  child.on('exit', (code) => {
    process.exitCode = code ?? 1;
  });

  return child;
}

launchService(
  'Corev Server',
  path.join(__dirname, '../packages/server'),
  ENV === 'production' ? 'start' : 'dev',
  API_PORT,
);

launchService(
  'Corev Dashboard',
  path.join(__dirname, '../packages/dashboard'),
  ENV === 'production' ? 'start' : 'dev',
  DASH_PORT,
);

spinner.text = 'All services are up';
spinner.stopAndPersist({ symbol: chalk.green('✔') });
