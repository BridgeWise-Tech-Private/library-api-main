interface BookType {
  id: string
  title: string
  author: string
  genre: string
  yearPublished: number
  checkedOut: boolean
  isPermanentCollection: boolean
  createdAt: string
}

type CreateBookInput = Pick<BookType, 'title' | 'author' | 'genre' | 'yearPublished'>;

type UpdateBookInput = Partial<Omit<BookType, 'id' | 'isPermanentCollection' | 'createdAt'>>;

type IdParams = {
  id: string
};

type GetBooksParamsRaw = Partial<Pick<BookType, 'genre'>> & {
  search?: string
  checkedOut?: string
};

type GetBooksParams = Omit<GetBooksParamsRaw, 'checkedOut'> & {
  checkedOut?: boolean
};
