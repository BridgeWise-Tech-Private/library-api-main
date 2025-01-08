/*
|--------------------------------------------------------------------------
| Preloaded File
|--------------------------------------------------------------------------
|
| Any code written inside this file will be executed during the application
| boot.
|
*/

import { validator } from '@ioc:Adonis/Core/Validator';
import Utils from 'App/Utils/Utils';
import { DateTime } from 'luxon';

validator.rule('yearCheckRule', (value, [options], { pointer, arrayExpressionPointer, errorReporter }) => {
  const min = options?.min || -3200;
  const max = options?.max || DateTime.now().year;

  if (!value || value < min || value > max) {
    errorReporter.report(
      pointer,
      'yearCheckRule',
      `published year should be between ${min} and ${max} years.`, arrayExpressionPointer
    );
  }
});

validator.rule('nameWithSpecialChar', (value, _, { pointer, arrayExpressionPointer, errorReporter }) => {
  const regex = /^[A-Za-z-& \- _]+$/;
  const name = regex.test(value);

  if (!name) {
    errorReporter.report(pointer, 'nameWithSpecialChar', 'Enter a valid Name', arrayExpressionPointer);
  }
});

validator.rule('idFormatRule', (value, _, { pointer, arrayExpressionPointer, errorReporter }) => {
  const regex = Utils.ALPHANUMERIC_WITH_OPTIONAL_HYPHEN_IN_BETWEEN;
  const name = regex.test(value);

  if (!name) {
    errorReporter.report(pointer, 'idFormatRule', 'Enter a valid id', arrayExpressionPointer);
  }
});