import { column } from '@ioc:Adonis/Lucid/Orm';
import BaseEnhancedModel from 'App/Models/BaseEnhancedModel';
import Utils from 'App/Utils/Utils';

export default class BaseStringIdModel extends BaseEnhancedModel {
    @column({ isPrimary: true })
    public declare id: string;

    public override generateUniqueId(): string;
    public override generateUniqueId(): number;
    public override generateUniqueId(): string | number {
        return Utils.uniqueString();
    }
}