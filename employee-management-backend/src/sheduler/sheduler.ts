import cron from 'node-cron';
import { Task } from '../models/taskModel';

cron.schedule('0 0 * * *', async () => {

  console.log('Running daily task scheduler...');

  try {
    const now = new Date();

    // Find all scheduled tasks for today
    const tasksToActivate = await Task.find({
      isScheduled: true,
      scheduledFor: {
        $lte: now,
      },
    });

    for (const task of tasksToActivate) {
      task.isScheduled = false;
      task.status = "assigned";
      await task.save();
    }

    console.log(`${tasksToActivate.length} scheduled tasks activated.`);

  } catch (err) {
    console.error('Error running task scheduler:', err);
  }
});
