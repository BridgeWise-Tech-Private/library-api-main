export const BookColumnKeyMapping: { [key in keyof BookType]: string } = {
    id: 'id',
    title: 'title',
    author: 'author',
    genre: 'genre',
    yearPublished: 'yearPublished',
    checkedOut: 'checkedOut',
    isPermanentCollection: 'isPermanentCollection',
    createdAt: 'createdAt',
};