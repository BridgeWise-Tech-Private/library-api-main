// start/scheduler.ts
import SchedulerService from '#services/scheduler_service';
import DeleteEntriesJob from '#crons/delete_entries_job';


// Create an instance of the scheduler service on server startup
const scheduler = new SchedulerService();

// Add all jobs which should be run while the server is up
scheduler.addJob({
    key: 'delete-old-entries',
    cronExpression: '0 0 * * *',
    job: new DeleteEntriesJob(),
});

// Actually start a scheduler for all jobs
scheduler.scheduleAllJobs();