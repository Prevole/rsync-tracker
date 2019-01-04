import Configuration from '../config/Configuration';
import TrackerConfiguration from '../config/TrackerConfiguration';
import Inject from '../ioc/Inject';
import Logger from '../logging/Logger';
import Queue from '../queue/Queue';
import Taskable from './Taskable';
import TaskBuilder from './TaskBuilder';

export default class TaskEngine {
  private readonly config: Configuration;
  private readonly builder: TaskBuilder;

  @Inject()
  private logger!: Logger;

  constructor(config: Configuration, builder: TaskBuilder) {
    this.config = config;
    this.builder = builder;
  }

  process() {
    const queues = this.config.trackers.reduce((queues: Queue[], tracker: TrackerConfiguration) => {
      return queues.concat(new Queue().queueAll(this.builder.build(tracker)));
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
