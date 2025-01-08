import { join } from 'path';
import { BaseCommand, args } from '@adonisjs/core/build/standalone';

import Application from '@ioc:Adonis/Core/Application';

export default class NewService extends BaseCommand {
  public static override commandName = 'new:service';

  public static override description = 'Make a new Service';

  /**
   * The name of the model file.
   */
  @args.string({ description: 'Name of the model class' })
  public model: string;

  /**
   * Execute command
   */
  public override async run(): Promise<void> {
    const stub = join(Application.appRoot, 'templates', 'service.txt');

    this.generator
      .addFile(this.model, { pattern: 'pascalcase', form: 'singular', suffix: 'Service' })
      .stub(stub)
      .destinationDir('app/Services')
      .appRoot(this.application.cliCwd || this.application.appRoot)
      .useMustache()
      .apply({
        model: this.model,
      });

    await this.generator.run();
  }
}
