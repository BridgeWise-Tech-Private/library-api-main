import { BaseSeeder } from '@adonisjs/lucid/seeders';
import db from '@adonisjs/lucid/services/db';

import Book from '#models/book';
import StatesData from '#database/seed_data/book.json' assert { type: 'json' };

export default class extends BaseSeeder {
  public override async run(): Promise<void> {
    const hrStart = process.hrtime();
    const promises = [];

    await db.beginGlobalTransaction();
    try {
      await Book.truncate();

      for (const stateData of StatesData) {
        promises.push(Book.validateCreate(stateData as Book));
      }

      await Promise.all(promises);
    } catch (error) {
      console.log({ error });
      const hrEnd = process.hrtime(hrStart);
      console.info(`Execution time: ${hrEnd[0]}, ${hrEnd[1] / 1000000}`, 'STATS');
      await db.rollbackGlobalTransaction();
      process.exit();
    }

    const hrEnd = process.hrtime(hrStart);
    console.info(`Execution time: ${hrEnd[0]}, ${hrEnd[1] / 1000000}`, 'STATS');
    await db.commitGlobalTransaction();
    process.exit();
  }
}