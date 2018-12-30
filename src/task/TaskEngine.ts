import Configuration from '../config/Configuration';
import TrackerConfiguration from '../config/TrackerConfiguration';
import Inject from '../ioc/Inject';
import Logger from '../logging/Logger';
import Queue from '../queue/Queue';
import SyncTaskBuilder from './SyncTaskBuilder';
import Taskable from './Taskable';

export default class TaskEngine {
  private readonly config: Configuration;

  @Inject()
  private logger!: Logger;

  constructor(config: Configuration) {
    this.config = config;
  }

  process() {
    const builder = new SyncTaskBuilder();

    const queues = this.config.trackers.reduce((queues: Queue[], tracker: TrackerConfiguration) => {
      return queues.concat(new Queue().queueAll(builder.build(tracker)));
    }, []);

    queues.forEach((queue: Queue) => {
      let previousResult = true;

      while (!queue.isEmpty()) {
        const task: Taskable = queue.dequeue();

        if (previousResult || (!previousResult && task.canRunIfPreviousTaskFailed())) {
          this.logger.info('Task will be run');
          previousResult = task.run();
          this.logger.info(`Task ran and was ${previousResult ? 'successful' : 'failure'}`);
        } else {
          this.logger.info('Task is skipped (previous task failed)');
        }
      }
    });
  }
}
