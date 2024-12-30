import vine from '@vinejs/vine';
import { DateTime } from 'luxon';

const BookCreateValidator = vine.compile(vine.object({
    id: vine.string().alphaNumeric({ allowDashes: true }).optional(),
    title: vine.string().minLength(3).maxLength(100),
    author: vine.string().minLength(3).maxLength(60),
    genre: vine.string().minLength(3).maxLength(20),
    yearPublished: vine.number().range([DateTime.fromISO("-003200-01-01").year, DateTime.now().plus({ year: 1 }).year]),
    isPermanentCollection: vine.boolean({ strict: false }).optional(),
    checkedOut: vine.boolean({ strict: false }).optional()
}));

export default BookCreateValidator;