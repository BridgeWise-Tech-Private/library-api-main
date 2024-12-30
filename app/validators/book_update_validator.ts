import vine from '@vinejs/vine';
import { DateTime } from 'luxon';

const BookCreateValidator = vine.compile(vine.object({
    title: vine.string().minLength(3).maxLength(100).optional(),
    author: vine.string().minLength(3).maxLength(60).optional(),
    genre: vine.string().minLength(3).maxLength(20).optional(),
    yearPublished: vine.number().range([
        -3200,
        DateTime.now().plus({ year: 1 }).year
    ]).optional(),
    checkedOut: vine.boolean({ strict: false }).optional()
}));

export default BookCreateValidator;