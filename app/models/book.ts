import { column } from '@adonisjs/lucid/orm';
import BaseStringIdModel from '#models/BaseStringIdModel';
import { BookGenreEnum } from '#enums/book';

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
}