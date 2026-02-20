import fs from 'fs';
import { PoolClient } from '@evershop/postgres-query-builder';
import { Pool } from 'pg';
import type { PoolConfig } from 'pg';
import { getConfig } from '../util/getConfig.js';

function safeGetConfig<T = unknown>(key: string, defaultValue?: T): T | undefined {
  try {
    return getConfig(key, defaultValue as any) as any;
  } catch (e) {
    // Startup must not crash due to missing/invalid config files.
    // The DB connection will surface errors on first use instead.
    return defaultValue;
  }
}

function safeReadFileAsString(filePath?: string): string | undefined {
  if (!filePath) return undefined;
  try {
    return fs.readFileSync(filePath).toString();
  } catch {
    return undefined;
  }
}

// Use env for the database connection, maintain the backward compatibility
const connectionSetting: PoolConfig = {
  host: process.env.DB_HOST || safeGetConfig('system.database.host'),
  port:
    (process.env.DB_PORT as unknown as number) ||
    (safeGetConfig('system.database.port') as unknown as number),
  user: process.env.DB_USER || safeGetConfig('system.database.user'),
  password: process.env.DB_PASSWORD || safeGetConfig('system.database.password'),
  database: process.env.DB_NAME || safeGetConfig('system.database.database'),
  max: 20
};

// Support SSL
const sslMode = process.env.DB_SSLMODE || safeGetConfig('system.database.ssl_mode');
switch (sslMode) {
  case 'disable': {
    connectionSetting.ssl = false;
    break;
  }
  case 'require':
  case 'prefer':
  case 'verify-ca':
  case 'verify-full': {
    const ssl: PoolConfig['ssl'] = {
      rejectUnauthorized: true
    };
    const ca = process.env.DB_SSLROOTCERT;
    if (ca) {
      ssl.ca = safeReadFileAsString(ca);
    }
    const cert = process.env.DB_SSLCERT;
    if (cert) {
      ssl.cert = safeReadFileAsString(cert);
    }
    const key = process.env.DB_SSLKEY;
    if (key) {
      ssl.key = safeReadFileAsString(key);
    }
    connectionSetting.ssl = ssl;
    break;
  }
  case 'no-verify': {
    connectionSetting.ssl = {
      rejectUnauthorized: false
    };
    break;
  }
  default: {
    connectionSetting.ssl = false;
    break;
  }
}

const pool = new Pool(connectionSetting);
// Set the timezone
pool.on('connect', (client) => {
  const timeZone = safeGetConfig('shop.timezone', 'UTC') || 'UTC';
  // Avoid crashing the process if this query fails for any reason.
  client.query(`SET TIMEZONE TO "${timeZone}";`).catch(() => undefined);
});

async function getConnection(): Promise<PoolClient> {
  return await pool.connect();
}

export { pool, getConnection };
