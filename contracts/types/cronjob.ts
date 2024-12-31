export abstract class BaseJob {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    public abstract run(): any;
}

export interface JobConfig {
    key: string
    cronExpression: string
    job: BaseJob
}