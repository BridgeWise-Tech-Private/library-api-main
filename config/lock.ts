import env from '#start/env';
import { defineConfig, stores } from '@adonisjs/lock';

const lockConfig = defineConfig({
  default: env.get('LOCK_STORE'),
  stores: {


    /**
     * Database store to manage locks
     */
    database: stores.database({
      tableName: 'locks'
    }),


    /**
     * Memory store could be used during
     * testing
     */
    memory: stores.memory()
  },
});

export default lockConfig;

declare module '@adonisjs/lock/types' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface LockStoresList extends InferLockStores<typeof lockConfig> { }
}