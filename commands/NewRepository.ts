import { join } from 'path';
import { BaseCommand, args } from '@adonisjs/core/build/standalone';

import Application from '@ioc:Adonis/Core/Application';

export default class NewRepository extends BaseCommand {
    public static override commandName = 'new:repository';

    public static override description = 'Make a new Repository';

    /**
     * The name of the model file.
     */
    @args.string({ description: 'Name of the model class' })
    public model: string;

    /**
     * Execute command
     */
    public override async run(): Promise<void> {
        const stub = join(Application.appRoot, 'templates', 'repository.txt');

        this.generator
            .addFile(this.model, { pattern: 'pascalcase', form: 'singular', suffix: 'Repository' })
            .stub(stub)
            .destinationDir('app/Repositories')
            .appRoot(this.application.cliCwd || this.application.appRoot)
            .useMustache()
            .apply({
                model: this.model,
            });

        await this.generator.run();
    }
}
