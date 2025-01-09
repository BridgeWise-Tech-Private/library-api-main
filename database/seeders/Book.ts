import Database from '@ioc:Adonis/Lucid/Database';
import BaseSeeder from '@ioc:Adonis/Lucid/Seeder';

import Book from 'App/Models/Book';
import StatesData from 'Database/seed_data/book.json';

export default class extends BaseSeeder {
  public override async run(): Promise<void> {
    const hrStart = process.hrtime();
    const promises = [];

    await Database.beginGlobalTransaction();
    try {
      await Book.truncate();

      for (const stateData of (StatesData as Book[])) {
        promises.push(Book.validateCreate(stateData as Book));
      }

      await Promise.all(promises);
    } catch (error) {
      console.log({ error });
      const hrEnd = process.hrtime(hrStart);
      console.info(`Execution time: ${hrEnd[0]}, ${hrEnd[1] / 1000000}`, 'STATS');
      await Database.rollbackGlobalTransaction();
      process.exit();
    }

    const hrEnd = process.hrtime(hrStart);
    console.info(`Execution time: ${hrEnd[0]}, ${hrEnd[1] / 1000000}`, 'STATS');
    await Database.commitGlobalTransaction();
    process.exit();
  }
}
