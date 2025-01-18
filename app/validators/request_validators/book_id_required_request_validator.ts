import vine from '@vinejs/vine';

const BookIdRequiredRequestValidator = vine.compile(
    vine.object({
        id: vine.string().alphaNumeric({ allowDashes: true }),
    })
        .allowUnknownProperties(),
);

export default BookIdRequiredRequestValidator;
