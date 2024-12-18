import BaseModel from "#models/base_model";
import { BookColumnKeyMapping } from "#src/constants/book";

class Book extends BaseModel<BookType, CreateBookInput> {
    protected override name = 'books';
}

export default new Book(BookColumnKeyMapping);