import Book from '#models/book';
import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  public override async up(): Promise<void> {
    this.schema.createTable(Book.table, (table) => {
      table.string('id').primary();

      table.string(Book.columnName('author'), 60).notNullable().index();
      table.string(Book.columnName('genre'), 20).notNullable().index();
      table.text(Book.columnName('title')).notNullable().index();
      table.integer(Book.columnName('yearPublished')).notNullable().index();

      table.boolean(Book.columnName('checkedOut')).notNullable().defaultTo(false).index();
      table.boolean(Book.columnName('isPermanentCollection')).notNullable().defaultTo(false).index();

      table.dateTime(Book.columnName('createdAt')).index();
      table.dateTime(Book.columnName('updatedAt')).index();
    });
  }

  public override async down(): Promise<void> {
    this.schema.dropTable(Book.table);
  }
}