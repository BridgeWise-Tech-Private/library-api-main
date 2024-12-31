import { CronJob } from 'cron';
import logger from '@adonisjs/core/services/logger';
import { JobConfig } from '#types/cronjob';
import locks from '@adonisjs/lock/services/main';

export default class SchedulerService {
  private jobs: JobConfig[] = [];

  public addJob(jobConfig: JobConfig): void {
    this.jobs.push(jobConfig);
  }

  public scheduleSingleJob(jobConfig: JobConfig): void {
    const lock = locks.createLock(jobConfig.key);
    const cronJob = new CronJob(jobConfig.cronExpression, async () => {
      let acquired = false;
      try {
        acquired = await lock.acquireImmediately();
        if (!acquired) {
          logger.info(`[Scheduler] - Job ${jobConfig.key} is already running on another node`);
          return;
        }

        await jobConfig.job.run();
      } catch (e) {
        logger.error(`[Scheduler] - An error occurred during the execution of job ${jobConfig.key}`);
      } finally {
        if (acquired) {
          await lock.release();
        }
      }
    });

    cronJob.start();
  }

  public scheduleAllJobs(): void {
    this.jobs.forEach((jobConfig) => {
      this.scheduleSingleJob(jobConfig);
    });
    logger.info(
      `[Scheduler] - ${this.jobs.length} registered ${this.jobs.length === 1 ? 'job has' : 'jobs have'} been scheduled`
    );
  }
}