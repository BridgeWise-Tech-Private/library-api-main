import { HttpContext } from '@adonisjs/core/http';

import { VineObject, VineValidator } from '@vinejs/vine';
import { SchemaTypes } from '@vinejs/vine/types';

export default function (
  compiledValidator: VineValidator<
    VineObject<Record<string, SchemaTypes>, unknown, unknown, unknown>,
    Record<string, unknown> | undefined
  >
) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
  return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor): any {
    const originalMethod = descriptor.value;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    descriptor.value = async function (ctx: HttpContext, ...args: any[]): Promise<any> {
      if (ctx?.request) {
        const allData = { ...ctx.request.all(), ...ctx.request.params() };
        const [validationErrors] = await compiledValidator.tryValidate(allData, { meta: {} });
        // return ctx.request.validateUsing(compiledValidator, { meta: {} });
        if (validationErrors) {
          return ctx.response.status(400).json(validationErrors);
        }
      }
      return originalMethod.apply(this, [ctx, ...args]);
    };
  };
}
