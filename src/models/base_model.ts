import knex from "#db/knex";
import type { Knex } from "knex";

// export default function BaseModel<ModelType extends {} = any>() {
//     abstract class BaseModel {}
//     return BaseModel;
// }

// eslint-disable-next-line @typescript-eslint/no-empty-object-type, @typescript-eslint/no-explicit-any
export default abstract class BaseModel<ModelType extends {} = any, InsertType extends {} = any> {
    #modelType: { [key in keyof ModelType]: string };

    constructor(modelType: { [key in keyof ModelType]: string }) {
        this.#modelType = modelType;
    }

    protected name?: string;

    public get tableName(): string {
        if (!this.name) {
            throw new Error('The table name must be defined for the model.');
        }
        return this.name;
    }

    protected get table(): Knex.QueryBuilder {
        if (!this.name) {
            throw new Error('The table name must be defined for the model.');
        }
        return knex.from<ModelType>(this.name);
    }

    public get query(): Knex.QueryBuilder {
        return this.table;
    }

    public async insert(data: InsertType): Promise<ModelType> {
        const [result] = await this.table.insert(data).returning('*');
        return result;
    }

    public async findOneById<ModelType>(id: string): Promise<ModelType> {
        return this.table.where(this.columnName('id' as never), id).select<ModelType>("*").first();
    }

    public get findAll(): Promise<ModelType[]> {
        return (async (): Promise<ModelType[]> => this.table.select('*'))();
    }

    public columnName(key: keyof ModelType): string {
        if (key in Object.keys(this.#modelType)) {
            return this.#modelType[key] as string;
        }

        return key as string;
    }
}