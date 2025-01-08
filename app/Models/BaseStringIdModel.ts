import { column, ModelAttributes } from '@ioc:Adonis/Lucid/Orm';
import BaseEnhancedModel, { BaseEnhancedModelType } from 'App/Models/BaseEnhancedModel';
import Utils from 'App/Utils/Utils';
import { validator } from '@ioc:Adonis/Core/Validator';

export default class BaseStringIdModel extends BaseEnhancedModel {
    @column({ isPrimary: true })
    public declare id: string;

    public override generateUniqueId(): string;
    public override generateUniqueId(): number;
    public override generateUniqueId(): string | number {
        return Utils.uniqueString();
    }

    public static override async validateForCreate<
        M extends BaseEnhancedModelType,
        MA extends ModelAttributes<InstanceType<M>>
    >(
        this: M,
        values: Partial<MA> & { id?: string | number },
    ): Promise<Partial<MA>> {
        values = Utils.filterObjStringsForProfanity(values);
        values.id = values.id !== undefined ? values.id : Utils.uniqueString();

        const validatorClass = await this.getValidator('Create');
        if (validatorClass) {
            return validator.validate(new validatorClass(values)) as Promise<Partial<MA>>;
        }
        return values;
    }
}