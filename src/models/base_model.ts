import knex from "#db/knex";
import type { Knex } from "knex";

// export default function BaseModel<ModelType extends {} = any>() {
//     abstract class BaseModel {}
//     return BaseModel;
// }

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
export default abstract class BaseModel<ModelType extends {} = any, InsertType extends {} = any> {
    protected tableName?: string;

    // private static get table(): Knex<ModelType, unknown[]> {
    protected get table(): Knex.QueryBuilder {
        if (!this.tableName) {
            throw new Error('The table name must be defined for the model.');
        }
        return knex.from(this.tableName);
    }

    public get query(): Knex.QueryBuilder {
        return this.table;
    }

    public async insert(data: InsertType): Promise<ModelType> {
        const [result] = await this.table.insert(data).returning('*');
        return result;
    }

    public async findOneById<ModelType>(id: number): Promise<ModelType> {
        return this.table.where({ id }).select("*").first();
    }

    public get findAll(): Promise<ModelType[]> {
        return (async (): Promise<ModelType[]> => this.table.select('*'))();
    }
}