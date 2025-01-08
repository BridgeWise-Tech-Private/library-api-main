import { join } from 'path';
import { BaseCommand, args } from '@adonisjs/core/build/standalone';
import { string } from '@ioc:Adonis/Core/Helpers';

import Application from '@ioc:Adonis/Core/Application';

export default class NewModel extends BaseCommand {
    public static override commandName = 'new:model';

    public static override description = 'Make a new Lucid model';

    /**
     * The name of the model file.
     */
    @args.string({ description: 'Name of the model class' })
    public name: string;

    /**
     * Execute command
     */
    public override async run(): Promise<void> {
        const stub = join(Application.appRoot, 'templates', 'model.txt');

        const path = this.application.resolveNamespaceDirectory('models');

        this.generator
            .addFile(this.name, { pattern: 'pascalcase', form: 'singular' })
            .stub(stub)
            .destinationDir(path || 'app/Models')
            .appRoot(this.application.cliCwd || this.application.appRoot)
            .useMustache()
            .apply({
                toTableName() {
                    return function (filename: string, render: (text: string) => string): string {
                        return `tbl_${string.pluralize(string.snakeCase(render(filename)))}`;
                    };
                },
            });

        await this.generator.run();
    }
}
