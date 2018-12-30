import 'mocha';

import { expect } from '../expect';

import { TaskPriority } from '../../src/queue/QueueTask';
import Task from '../../src/task/Task';

class TestTask extends Task {
  constructor() {
    super(TaskPriority.NORMAL);
  }

  run(): boolean {
    return true;
  }
}

describe('Task', () => {
  describe('priority', () => {
    it('has normal priority', () => {
      expect(new TestTask().priority()).to.equals(TaskPriority.NORMAL);
    });
  });

  describe('runIfPreviousTaskFail', () => {
    it('should not run if previous task fail by default', () => {
      expect(new TestTask().canRunIfPreviousTaskFailed()).to.be.false;
    });

    it('should run if flag is set to true', () => {
      const task = new TestTask().runIfPreviousTaskFail(true);
      expect(task.canRunIfPreviousTaskFailed()).to.be.true;
    });
  });
});
