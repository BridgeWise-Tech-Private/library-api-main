import { validator } from '@ioc:Adonis/Core/Validator';
import HttpContext from '@ioc:Adonis/Core/HttpContext';

// eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
export default function (validatorClass: any) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/explicit-module-boundary-types
    return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor): any {
        const originalMethod = descriptor.value;
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        descriptor.value = async function (...args: any[]): Promise<any> {
            const ctx = HttpContext.get();
            if (ctx?.request) {
                await validator.validate(new validatorClass(ctx.request.all()));
            }
            return originalMethod.apply(this, args);
        };
    };
}
