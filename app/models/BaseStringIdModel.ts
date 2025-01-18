import { column } from '@adonisjs/lucid/orm';
import BaseEnhancedModel from '#models/BaseEnhancedModel';
import Utils from '#utils/Utils';

export default class BaseStringIdModel extends BaseEnhancedModel {
  @column({ isPrimary: true })
  public override id: string;

  public override generateUniqueId(): string;
  public override generateUniqueId(): number;
  public override generateUniqueId(): string | number {
    return Utils.uniqueString();
  }
}
