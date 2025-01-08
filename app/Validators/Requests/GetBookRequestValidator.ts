import { schema, rules } from '@ioc:Adonis/Core/Validator';

export default class GetBookRequestValidator {
    constructor(public data: Record<string, unknown>) { }

    public schema = schema.create({
        id: schema.string.optional([rules.idFormatRule()]),
        title: schema.string.optional([rules.minLength(3), rules.maxLength(100)]),
        author: schema.string.optional([rules.nameWithSpecialChar(), rules.minLength(3), rules.maxLength(60)]),
        genre: schema.string.optional([rules.minLength(3), rules.maxLength(20)]),

        yearPublished: schema.number.optional([rules.yearCheckRule()]),
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
