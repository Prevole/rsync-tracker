import 'mocha';

import Configuration from '../../src/config/Configuration';
import TrackerConfiguration from '../../src/config/TrackerConfiguration';
import Registry from '../../src/ioc/Registry';
import { TaskPriority } from '../../src/queue/QueueTask';
import Task from '../../src/task/Task';
import Taskable from '../../src/task/Taskable';
import TaskBuilder from '../../src/task/TaskBuilder';
import TaskEngine from '../../src/task/TaskEngine';
import TaskEngineState from '../../src/task/TaskEngineState';

import { expect } from '../expect';

class TestTask extends Task {
  public hasRun = false;

  private readonly isInError: boolean;

  constructor(isInError?: boolean) {
    super('dummy', TaskPriority.NORMAL);

    if (isInError !== undefined) {
      this.isInError = isInError;
    } else {
      this.isInError = false;
    }
  }

  run(): boolean {
    this.hasRun = true;
    return !this.isInError;
  }
}

class TestTaskGenerator extends Task {
  public scheduledTask?: TestTask;

  constructor() {
    super('dummy', TaskPriority.NORMAL);
  }

  run(state: TaskEngineState): boolean {
    this.scheduledTask = new TestTask(false);
    state.scheduleTask(this.scheduledTask);
    return true;
  }
}

class DummyTaskBuilder implements TaskBuilder {
  private readonly taskBuilder: (nbCalls: number) => Taskable[];
  private nbCalls = 0;

  constructor(taskBuilder: (nbCalls: number) => Taskable[]) {
    this.taskBuilder = taskBuilder;
  }

  build(config: TrackerConfiguration): Taskable[] {
    return this.taskBuilder(this.nbCalls++);
  }
}

const dummyTracker = new TrackerConfiguration('dummy', {
  name: 'dummy',
  src: 'src',
  dest: 'dest'
});

describe('TaskEngine', () => {
  beforeEach(() => {
    Registry.register('logger', { info: () => {} });
    Registry.register('taskEngineState', new TaskEngineState());
  });

  afterEach(() => {
    Registry.clear('logger');
  });

  describe('process', () => {
    it('should process two queues of one task each', () => {
      const config = new Configuration();
      config.addTracker(dummyTracker);
      config.addTracker(dummyTracker);

      const task1 = new TestTask();
      const task2 = new TestTask();

      const taskBuilder = new DummyTaskBuilder((nbCalls: number) => {
        return [ task1, task2 ];
      });

      const taskEngine = new TaskEngine(config, taskBuilder);

      taskEngine.process();

      expect(task1.hasRun).to.be.true;
      expect(task2.hasRun).to.be.true;
    });

    it('should process two queues of two tasks each', () => {
      const config = new Configuration();
      config.addTracker(dummyTracker);
      config.addTracker(dummyTracker);

      const task1 = new TestTask();
      const task2 = new TestTask();
      const task3 = new TestTask();
      const task4 = new TestTask();

      const tasks = [
        [ task1, task2 ],
        [ task3, task4 ]
      ];

      const taskBuilder = new DummyTaskBuilder((nbCalls: number) => {
        return tasks[nbCalls];
      });

      const taskEngine = new TaskEngine(config, taskBuilder);

      taskEngine.process();

      expect(task1.hasRun).to.be.true;
      expect(task2.hasRun).to.be.true;
      expect(task3.hasRun).to.be.true;
      expect(task4.hasRun).to.be.true;
    });

    it('should process second queue when first queue is in error', () => {
      const config = new Configuration();
      config.addTracker(dummyTracker);
      config.addTracker(dummyTracker);

      const task1 = new TestTask();
      const task2 = new TestTask(true);
      const task3 = new TestTask();
      const task4 = new TestTask();

      const tasks = [
        [ task1, task2 ],
        [ task3, task4 ]
      ];

      const taskBuilder = new DummyTaskBuilder((nbCalls: number) => {
        return tasks[nbCalls];
      });

      const taskEngine = new TaskEngine(config, taskBuilder);

      taskEngine.process();

      expect(task1.hasRun).to.be.true;
      expect(task2.hasRun).to.be.true;
      expect(task3.hasRun).to.be.true;
      expect(task4.hasRun).to.be.true;
    });

    it('should not process second task when first task is in error', () => {
      const config = new Configuration();
      config.addTracker(dummyTracker);

      const task1 = new TestTask(true);
      const task2 = new TestTask();

      const taskBuilder = new DummyTaskBuilder((nbCalls: number) => {
        return [ task1, task2 ];
      });

      const taskEngine = new TaskEngine(config, taskBuilder);

      taskEngine.process();

      expect(task1.hasRun).to.be.true;
      expect(task2.hasRun).to.be.false;
    });

    it('should process second task when first task is in error and next task can run', () => {
      const config = new Configuration();
      config.addTracker(dummyTracker);

      const task1 = new TestTask(true);
      const task2 = new TestTask();
      task2.runIfPreviousTaskFail(true);

      const taskBuilder = new DummyTaskBuilder((nbCalls: number) => {
        return [ task1, task2 ];
      });

      const taskEngine = new TaskEngine(config, taskBuilder);

      taskEngine.process();

      expect(task1.hasRun).to.be.true;
      expect(task2.hasRun).to.be.true;
    });

    it('should process the tasks and schedule a new task from previous task', () => {
      const config = new Configuration();
      config.addTracker(dummyTracker);

      const task1 = new TestTaskGenerator();
      const task2 = new TestTask();

      const taskBuilder = new DummyTaskBuilder((nbCalls: number) => {
        return [ task1, task2 ];
      });

      const taskEngine = new TaskEngine(config, taskBuilder);

      taskEngine.process();

      expect(task1.scheduledTask!.hasRun).to.be.true;
      expect(task2.hasRun).to.be.true;
    });
  });
});
