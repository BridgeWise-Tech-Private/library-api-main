import { join } from 'path';
import { inject, BaseCommand, Kernel, args, flags } from '@adonisjs/core/build/standalone';
import { DatabaseContract } from '@ioc:Adonis/Lucid/Database';
import { ApplicationContract } from '@ioc:Adonis/Core/Application';

@inject([null, null, 'Adonis/Lucid/Database'])
export default class MakeMigration extends BaseCommand {
    public static override commandName = 'new:migration';

    public static override description = 'Make a new migration file';

    /**
     * The name of the migration file. We use this to create the migration
     * file and generate the table name
     */
    @args.string({ description: 'Name of the Lucid model' })
    public name: string;

    /**
     * Choose a custom pre-defined connection. Otherwise, we use the
     * default connection
     */
    @flags.string({ description: 'Define a custom database connection for the migration' })
    public connection: string;

    /**
     * Pre select migration directory. If this is defined, we will ignore the paths
     * defined inside the config.
     */
    @flags.string({ description: 'Pre-select a migration directory' })
    public folder: string;

    /**
     * Whether the migration is for create or alter
     */
    @flags.boolean({ description: 'Make the migration for altering the table' })
    public alter: boolean;

    /**
     * This command loads the application, since we need the runtime
     * to find the migration directories for a given connection
     */
    public static override settings = {
        loadApp: true,
    };

    constructor(app: ApplicationContract, kernel: Kernel, private db: DatabaseContract) {
        super(app, kernel);
    }

    /**
     * Returns the directory for creating the migration file
     */
    private async getDirectory(migrationPaths?: string[]): Promise<string> {
        if (this.folder) {
            return this.folder;
        }

        const directories = migrationPaths?.length ? migrationPaths : ['database/migrations'];
        if (directories.length === 1) {
            return directories[0];
        }

        return this.prompt.choice('Select the migrations folder', directories, { name: 'folder' });
    }

    /**
     * Execute command
     */
    public override async run(): Promise<void> {
        const connection = this.db.getRawConnection(this.connection || this.db.primaryConnectionName);

        /**
         * Ensure the define connection name does exists in the
         * config file
         */
        if (!connection) {
            this.logger.error(`${this.connection} is not a valid connection name. Double check config/database file`);
            return;
        }

        /**
         * The folder for creating the schema file
         */
        const folder = await this.getDirectory((connection.config.migrations || {})?.paths);

        /**
         * Template stub
         */
        const stub = join(
            this.application.appRoot,
            'templates',
            this.alter ? 'migration-alter.txt' : 'migration-make.txt'
        );

        /**
         * Prepend timestamp to keep schema files in the order they
         * have been created
         */
        const prefix = `${new Date().getTime()}_${this.alter ? 'alter' : 'create'}_`;

        this.generator
            .addFile(this.name, { pattern: 'snakecase', form: 'plural', prefix })
            .stub(stub)
            .destinationDir(folder)
            .appRoot(this.application.cliCwd || this.application.appRoot)
            .useMustache()
            .apply({
                model: this.name,
            });

        await this.generator.run();
    }
}
