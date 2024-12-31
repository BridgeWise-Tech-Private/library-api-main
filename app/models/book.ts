import { column } from '@adonisjs/lucid/orm';
import BaseStringIdModel from '#models/BaseStringIdModel';
import { BookGenreEnum } from '#enums/book';
import { DateTime } from 'luxon';

export default class Book extends BaseStringIdModel {
  public static override table = 'tbl_books';

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
      return value ? value.toFormat('dd-MM-yyyy HH:mm:ss ZZ') : value;
    },
  })
  public override createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true, serializeAs: null })
  public override updatedAt: DateTime;
}