import vine from '@vinejs/vine';
import { DateTime } from 'luxon';

const BookCreateRequestValidator = vine.compile(vine.object({
    title: vine.string().minLength(3).maxLength(100),
    author: vine.string().minLength(3).maxLength(60),
    genre: vine.string().minLength(3).maxLength(20),
    yearPublished: vine.number().range([
        -3200,
        DateTime.now().plus({ year: 1 }).year
    ]),
    checkedOut: vine.boolean({ strict: false }).optional()
}),);

export default BookCreateRequestValidator;
