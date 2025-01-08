import { join } from 'path';
import { BaseCommand, args } from '@adonisjs/core/build/standalone';

import Application from '@ioc:Adonis/Core/Application';

export default class NewController extends BaseCommand {
  public static override commandName = 'new:controller';

  public static override description = 'Make a new Controller';

  /**
   * The name of the model file.
   */
  @args.string({ description: 'Name of the model class' })
  public model: string;

  /**
   * Execute command
   */
  public override async run(): Promise<void> {
    const stub = join(Application.appRoot, 'templates', 'controller.txt');

    this.generator
      .addFile(this.model, { pattern: 'pascalcase', form: 'singular', suffix: 'Controller' })
      .stub(stub)
      .destinationDir('app/Controllers/Http')
      .appRoot(this.application.cliCwd || this.application.appRoot)
      .useMustache()
      .apply({
        model: this.model,
      });

    await this.generator.run();
  }
}
