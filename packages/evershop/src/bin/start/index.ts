import './initEnvStart.js';
import { start } from '../lib/startUp.js';

start({
  command: 'start',
  // Keep existing default, but align with effective NODE_ENV (see initEnvStart.ts).
  env: process.env.NODE_ENV || 'production',
  process: 'main'
});
process.on('uncaughtException', function (exception) {
  import('../../lib/log/logger.js').then((module) => {
    module.error(exception);
  });
});
process.on('unhandledRejection', (reason, p) => {
  import('../../lib/log/logger.js').then((module) => {
    module.error(`Unhandled Rejection: ${reason} at: ${p}`);
  });
});
