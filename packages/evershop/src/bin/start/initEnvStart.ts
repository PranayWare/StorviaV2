import 'dotenv/config';
/**
 * IMPORTANT (safety / backward-compat):
 * - Previously this file forced `NODE_ENV=production` unconditionally.
 * - That overrides `.env` and can make node-config load the wrong config set,
 *   leading to missing DB config and startup failures.
 *
 * We keep the original behavior as the DEFAULT, but respect an explicitly set
 * NODE_ENV (for example from `.env`, hosting, or the shell).
 */
if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production';
}
// Evershop mutates config during bootstrap; allow it only for startup.
process.env.ALLOW_CONFIG_MUTATIONS = 'true';
