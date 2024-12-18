import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config({ path: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '.env') });

/** List any required env vars here */
const required: string[] = [];
// const required = ['DEMO_API_KEY_VAL']

const validateEnvVars = (): void => {
  const missing: string[] = [];
  required.forEach((v) => {
    if (!process.env[v]) {
      missing.push(v);
    }
  });
  if (missing.length) {
    console.error(`[ERROR]: Missing critical env vars: ${missing.join(', ')}`);
    process.exit(1);
  }
};

validateEnvVars();

export default {
  prodDbConnectionUrl: process.env.PROD_DB_CONNECTION_URL,
  dbUserProd: process.env.DB_USER_PROD,
  dbPassProd: process.env.DB_PASS_PROD,
  /** Name of API Key header */
  demoApiKeyKey: 'api-key',
  /** Value of API Key  */
  demoApiKeyVal: process.env.DEMO_API_KEY_VAL,
  /** Node environment */
  nodeEnv: process.env.NODE_ENV || 'development'
};
