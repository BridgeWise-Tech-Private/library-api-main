import { DateTime } from 'luxon';
import {
    BaseModel,
    beforeCreate,
    column,
    scope,
} from '@adonisjs/lucid/orm';
import { ModelAttributes } from '@adonisjs/lucid/types/model';
import Utils from '#utils/Utils';
import _ from 'lodash';

import { CountType } from '#types/Core';

import { VineObject, VineValidator } from '@vinejs/vine';
import { SchemaTypes, ValidationOptions } from '@vinejs/vine/types';
import UnProcessableException from '#exceptions/un_processable_exception';

export type BaseEnhancedModelType = typeof BaseEnhancedModel;

type ModelValidationType = 'Create' | 'Update';

export default class BaseEnhancedModel extends BaseModel {
    @column({ isPrimary: true })
    public id: number | string;

    @column.dateTime({ autoCreate: true })
    public createdAt: DateTime;

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    public updatedAt: DateTime;

    public get disableIdGeneration(): boolean {
        return false;
    }

    public generateUniqueId(): string;
    public generateUniqueId(): number;
    public generateUniqueId(): string | number {
        return Utils.uniqueId();
    }

    public static latest = scope((query) => query.orderBy(this.columnName('createdAt'), 'desc'));

    public static latestN = scope((query, N: number) =>
        query.orderBy(this.columnName('createdAt'), 'desc').limit(N)
    );

    public static oldest = scope((query) => query.orderBy(this.columnName('createdAt'), 'asc'));

    public static oldestN = scope((query, N: number) =>
        query.orderBy(this.columnName('createdAt'), 'asc').limit(N)
    );

    @beforeCreate()
    public static async generateId(model: BaseEnhancedModel): Promise<void> {
        if (model.disableIdGeneration) {
            return;
        }
        model.id = model.id !== undefined ? model.id : model.generateUniqueId();
    }

    public static async mapColumns(
        data: Record<string, unknown>,
        model: BaseEnhancedModel
    ): Promise<Record<string, unknown>> {
        const ModelClass = (
            await import(`#models/${_.snakeCase(model.constructor.name).toLowerCase()}`)
        ).default;
        return _.mapKeys(data, (_value, key) => {
            return ModelClass.$getColumn(key).columnName;
        });
    }

    public static columnName<
        M extends BaseEnhancedModelType,
        MA extends ModelAttributes<InstanceType<M>>,
    >(this: M, name: keyof MA): string {
        return this.$getColumn(name as string)?.columnName || (name as string);
    }

    public static queryColumn<
        M extends BaseEnhancedModelType,
        MA extends ModelAttributes<InstanceType<M>>,
    >(this: M, name: keyof MA, prefix?: string): string {
        prefix = prefix || this.table;
        return `${prefix}.${this.columnName(name)}`;
    }

    public static async destroy(id: string | number): Promise<boolean> {
        const object = await this.find(id);
        if (object) {
            await object.delete();
            return true;
        }
        return false;
    }

    public static async count<
        M extends BaseEnhancedModelType,
        MA extends ModelAttributes<InstanceType<M>>,
    >(this: M, values?: Partial<MA>): Promise<number> {
        const query = this.query().pojo<CountType>().count('*');
        if (values) {
            query.where(values);
        }
        const [{ count }] = await query;
        return count;
    }

    public static async findOneBy<
        M extends BaseEnhancedModelType,
        MA extends ModelAttributes<InstanceType<M>>,
    >(this: M, values: Partial<MA>): Promise<InstanceType<M> | null> {
        return this.query().where(values).first();
    }

    public static override async findManyBy<
        M extends BaseEnhancedModelType,
        MA extends ModelAttributes<InstanceType<M>>,
    >(this: M, clause: Partial<MA>): Promise<InstanceType<M>[]>;
    public static override async findManyBy<M extends BaseEnhancedModelType>(
        this: M,
        key: string,
        value: unknown
    ): Promise<InstanceType<M>[]>;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public static override async findManyBy<
        M extends BaseEnhancedModelType,
        MA extends ModelAttributes<InstanceType<M>>,
    >(
        this: M,
        clause?: Partial<MA> | string,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        value?: any
    ): Promise<InstanceType<M>[]> {
        const baseQuery = this.query();

        if (clause && typeof clause !== 'string') {
            return baseQuery.where(clause);
        }

        if (clause && value) {
            return baseQuery.where({ [clause]: value });
        }
        throw new UnProcessableException('Please check the query again');
    }

    public static async deleteBy<
        M extends BaseEnhancedModelType,
        MA extends ModelAttributes<InstanceType<M>>,
    >(this: M, values: Partial<MA>): Promise<number> {
        const models = await this.query().where(values);
        for (const model of models) {
            await model.delete();
        }
        return models.length;
    }

    private static getValidatorPath(type: ModelValidationType): string {
        return `#validators/${_.snakeCase(this.name).toLowerCase()}_${type.toLowerCase()}_validator`;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private static async getValidator(type: ModelValidationType): Promise<any> {
        try {
            const { default: validator } = await import(this.getValidatorPath(type));
            return validator;
        } catch (error) {
            if ((error.message as string).startsWith('ERR_PACKAGE_IMPORT_NOT_DEFINED')) {
                return undefined;
            }
        }
    }

    public static async validateForCreate<
        M extends BaseEnhancedModelType,
        MA extends ModelAttributes<InstanceType<M>>,
    >(this: M, values: Partial<MA>): Promise<Partial<MA>> {
        values = Utils.filterObjStringsForProfanity(values);

        const compiledValidator = await this.getValidator('Create');
        if (compiledValidator) {
            // eslint-disable-next-line max-len
            return (
                compiledValidator as VineValidator<
                    VineObject<Record<string, SchemaTypes>, unknown, unknown, unknown>,
                    Record<string, unknown> | undefined
                >
            ).validate(values, {} as ValidationOptions<Record<string, unknown>>) as Promise<Partial<MA>>;
        }
        return values;
    }

    public static async validateForUpdate<
        M extends BaseEnhancedModelType,
        MA extends ModelAttributes<InstanceType<M>>,
    >(this: M, values: Partial<MA>): Promise<Partial<MA>> {
        values = Utils.filterObjStringsForProfanity(values);

        const compiledValidator = await this.getValidator('Update');
        if (compiledValidator) {
            // eslint-disable-next-line max-len
            return (
                compiledValidator as VineValidator<
                    VineObject<Record<string, SchemaTypes>, unknown, unknown, unknown>,
                    Record<string, unknown> | undefined
                >
            ).validate(values, {} as ValidationOptions<Record<string, unknown>>) as Promise<Partial<MA>>;
        }
        return values;
    }

    public static async validateCreate<
        M extends BaseEnhancedModelType,
        MA extends ModelAttributes<InstanceType<M>>,
    >(this: M, values: Partial<MA>): Promise<InstanceType<M>> {
        values = await this.validateForCreate(values);
        return this.create(values);
    }

    public static async validateUpdate<
        M extends BaseEnhancedModelType,
        MA extends ModelAttributes<InstanceType<M>>,
    >(this: M, id: string | number, values: Partial<MA>): Promise<InstanceType<M> | null> {
        const object = await this.find(id);
        if (object) {
            values = (await this.validateForUpdate({ ...values, id })) as Partial<MA>;
            return object.merge(values).save();
        }
        return null;
    }

    public static async updateOneBy<
        M extends BaseEnhancedModelType,
        MA extends ModelAttributes<InstanceType<M>>,
    >(this: M, where: Partial<MA>, values: Partial<MA>): Promise<InstanceType<M> | null> {
        const object = await this.findOneBy(where);
        if (object) {
            values = (await this.validateForUpdate({
                ...values,
                id: object.$getAttribute('id'),
            })) as Partial<MA>;
            return object.merge(values).save();
        }
        return null;
    }
}
