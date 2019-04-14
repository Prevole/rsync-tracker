import Configuration from '../config/Configuration';
import TrackerConfiguration from '../config/TrackerConfiguration';
import Inject from '../ioc/Inject';
import Logger from '../logging/Logger';
import Queue from '../queue/Queue';
import Taskable from './Taskable';
import TaskBuilder from './TaskBuilder';
import TaskEngineState from './TaskEngineState';

export default class TaskEngine {
  private readonly config: Configuration;
  private readonly builder: TaskBuilder;

  @Inject()
  private logger!: Logger;

  @Inject()
  private taskEngineState!: TaskEngineState;

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
          this.logger.info(`Task [${task.name()}] will be run`);
          previousResult = task.run(this.taskEngineState);

          if (this.taskEngineState.hasTasks()) {
            this.logger.info(`Task [${task.name()}] generated new tasks`);
            queue.queueAll(this.taskEngineState.flushTasks());
          }

          this.logger.info(`Task [${task.name()}] ran and was ${previousResult ? 'successful' : 'failure'}`);
        } else {
          this.logger.info(`Task [${task.name()}] is skipped (previous task failed)`);
        }
      }
    });
  }
}
