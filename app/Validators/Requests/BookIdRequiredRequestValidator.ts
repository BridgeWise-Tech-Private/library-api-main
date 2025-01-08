import { schema, rules } from '@ioc:Adonis/Core/Validator';

export default class BookIdRequiredRequestValidator {
    constructor(public data: Record<string, unknown>) { }

    public schema = schema.create({
        id: schema.string([rules.idFormatRule()]),
    });

    public messages = {
        id: 'Invalid Id passed',
    };
}
