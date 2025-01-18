import app from '@adonisjs/core/services/app';
import { HttpContext, ExceptionHandler } from '@adonisjs/core/http';

export default class HttpExceptionHandler extends ExceptionHandler {
  /**
   * In debug mode, the exception handler will display verbose errors
   * with pretty printed stack traces.
   */
  protected override debug = !app.inProduction;

  /**
   * The method is used for handling errors and returning
   * response to the client
   */
  public override async handle(error: unknown, ctx: HttpContext): Promise<unknown> {
    return super.handle(error, ctx);
  }

  /**
   * The method is used to report error to the logging service or
   * the third party error monitoring service.
   *
   * @note You should not attempt to send a response from this method.
   */
  public override async report(error: unknown, ctx: HttpContext): Promise<void> {
    return super.report(error, ctx);
  }
}
