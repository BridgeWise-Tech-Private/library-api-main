import { BaseSchema } from '@adonisjs/lucid/schema';

export default class extends BaseSchema {
  protected tableName = 'locks';

  public override async up(): Promise<void> {
    this.schema.createTable(this.tableName, (table) => {
      table.string('key', 255).notNullable().primary();
      table.string('owner').notNullable();
      table.bigint('expiration').unsigned().nullable();
    });
  }

  public override async down(): Promise<void> {
    this.schema.dropTable(this.tableName);
  }
}