import BaseModel from "#models/base_model";

class Book extends BaseModel<BookType, CreateBookInput> {
    protected override tableName = 'books';
}

export default new Book();