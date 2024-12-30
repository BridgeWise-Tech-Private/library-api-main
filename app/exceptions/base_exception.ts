import { Exception } from '@poppinss/utils';
import { HttpContext as HttpContextContract, HttpContext } from '@adonisjs/core/http';
import fs from 'fs';

export default abstract class BaseException extends Exception {
  constructor(
    message: string,
    status: number,
    public override code: string
  ) {
    super(message, status);

    const ctx = HttpContext.get();
    const path = ctx?.request?.file('file')?.tmpPath;
    if (path) {
      fs.promises.unlink(path).catch(() => {
        /**
         * Empty function block to prevent unhandled error rejection
         * Comments to prevent unexpected empty arrow function eslint warning
         */
      });
    }
  }

  public async handle(error: this, { response }: HttpContextContract): Promise<void> {
    response.status(error.status).send({ message: this.message, code: this.code });
  }
}
