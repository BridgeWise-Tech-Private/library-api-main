import { schema, rules } from '@ioc:Adonis/Core/Validator';

export default class BookCreateRequestValidator {
    constructor(public data: Record<string, unknown>) { }

    public schema = schema.create({
        title: schema.string([rules.minLength(3), rules.maxLength(100)]),
        author: schema.string([rules.nameWithSpecialChar(), rules.minLength(3), rules.maxLength(60)]),
        genre: schema.string([rules.minLength(3), rules.maxLength(20)]),

        yearPublished: schema.number([rules.yearCheckRule()]),
        checkedOut: schema.boolean.optional()
    });

    public messages = {
        title: 'Invalid title',
        author: 'Invalid author',
        genre: 'Invalid genre',
        yearPublished: 'Invalid year passed',
        checkedOut: 'checkedOut must be a boolean',
    };
}
