import { BaseJob } from '#types/cronjob';

export default class HelloJob extends BaseJob {
    public run(): void {
        console.log('Hello!');
    }
}
