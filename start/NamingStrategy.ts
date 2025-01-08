import { BaseModel, SnakeCaseNamingStrategy } from '@ioc:Adonis/Lucid/Orm';

class SnakeCaseStrategy extends SnakeCaseNamingStrategy {
  public override tableName(model: typeof BaseModel): string {
    return 'tbl_' + super.tableName(model);
  }
}

BaseModel.namingStrategy = new SnakeCaseStrategy();
