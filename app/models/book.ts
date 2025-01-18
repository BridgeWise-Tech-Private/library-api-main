import { column } from '@adonisjs/lucid/orm';
import BaseStringIdModel from '#models/BaseStringIdModel';
import { BookGenreEnum } from '#enums/book';
import { DateTime } from 'luxon';
import Utils from '#utils/Utils';

export default class Book extends BaseStringIdModel {
  public static override table = 'tbl_books';

  public override generateUniqueId(): string;
  public override generateUniqueId(): number;
  public override generateUniqueId(): string | number {
    return Utils.generateUuid();
  }

  @column()
  public title: string;

  @column()
  public author: string;

  @column()
  public genre: BookGenreEnum | string;

  @column()
  public yearPublished: number;

  @column()
  public isPermanentCollection: boolean;

  @column()
  public checkedOut: boolean;

  @column.dateTime({
    autoCreate: true,
    serialize: (value: DateTime | null) => {
      return value ? value.toUTC() : value;
    },
  })
  public override createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public override updatedAt: DateTime;
}