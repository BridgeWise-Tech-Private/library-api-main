import Book from '#models/book';
import { BaseJob } from '#types/cronjob';

export default class DeleteEntriesJob extends BaseJob {
    public async run(): Promise<void> {
        await Book
            .query()
            .whereRaw(`${Book.queryColumn('createdAt')} < NOW() - INTERVAL '2 weeks'`)
            .andWhere(Book.columnName('isPermanentCollection'), '=', false)
            .delete();
    }
}
