// start/scheduler.ts
import SchedulerService from '#services/scheduler_service';
import HelloJob from '#crons/hello_job';

// Create an instance of the scheduler service on server startup
const scheduler = new SchedulerService();

// Add all jobs which should be run while the server is up
scheduler.addJob({
    key: 'hello-job',
    cronExpression: '* * * * *',
    job: new HelloJob(),
});

// Actually start a scheduler for all jobs
scheduler.scheduleAllJobs();