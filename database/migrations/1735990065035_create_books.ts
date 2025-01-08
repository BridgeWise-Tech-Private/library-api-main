import BaseSchema from '@ioc:Adonis/Lucid/Schema';
import Book from 'App/Models/Book';

export default class CreateBook extends BaseSchema {
  public override async up(): Promise<void> {
    this.schema.createTable(Book.table, (table) => {
      table.text(Book.columnName('id')).primary();

      table.string(Book.columnName('title'), 100).notNullable(),
        table.string(Book.columnName('author'), 60).notNullable(),
        table.string(Book.columnName('genre'), 20).notNullable(),
        table.smallint(Book.columnName('yearPublished')).notNullable(),
        table.boolean(Book.columnName('isPermanentCollection')).notNullable().defaultTo(false),
        table.boolean(Book.columnName('checkedOut')).notNullable().defaultTo(false),

        table.dateTime(Book.columnName('createdAt')).index();
      table.dateTime(Book.columnName('updatedAt')).index();
    });
  }

  public override async down(): Promise<void> {
    this.schema.dropTable(Book.table);
  }
}
