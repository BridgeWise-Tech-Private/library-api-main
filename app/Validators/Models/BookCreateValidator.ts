import { schema, rules } from '@ioc:Adonis/Core/Validator';

export default class BookeCreateValidator {
    constructor(public data: Record<string, unknown>) { }

    public schema = schema.create({
        id: schema.string([rules.idFormatRule()]),
        title: schema.string([rules.minLength(3), rules.maxLength(100)]),
        author: schema.string([rules.nameWithSpecialChar(), rules.minLength(3), rules.maxLength(60)]),
        genre: schema.string([rules.minLength(3), rules.maxLength(20)]),

        yearPublished: schema.number([rules.yearCheckRule()]),
        isPermanentCollection: schema.boolean.optional(),
        checkedOut: schema.boolean.optional()
    });

    public messages = {
        id: 'Invalid Id passed',
        title: 'Invalid title',
        author: 'Invalid author',
        genre: 'Invalid genre',
        yearPublished: 'Invalid year passed',
        isPermanentCollection: 'isPermanentCollection must be a boolean',
        checkedOut: 'checkedOut must be a boolean',
    };
}
