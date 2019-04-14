import 'mocha';

import Queue from '../../src/queue/Queue';
import { TaskPriority } from '../../src/queue/QueueTask';
import Task from '../../src/task/Task';

import { expect } from '../expect';

class TestTask extends Task {
  constructor(priority: TaskPriority) {
    super('dummy', priority);
  }

  run(): boolean {
    return true;
  }
}

describe('Queue', () => {
  describe('queue', () => {
    it ('should queue when no previous task', () => {
      const queue = new Queue();
      const task = new TestTask(TaskPriority.NORMAL);

      queue.queue(task);

      expect((queue as any).items).to.deep.equal([ task ]);
    });

    it('should queue when previous task', () => {
      const queue = new Queue();
      const task1 = new TestTask(TaskPriority.NORMAL);
      const task2 = new TestTask(TaskPriority.NORMAL);

      queue.queue(task1);
      queue.queue(task2);

      expect((queue as any).items).to.deep.equal([ task1, task2 ]);
    });

    it('should queue accordingly to priorities', () => {
      const queue = new Queue();
      const task1 = new TestTask(TaskPriority.NORMAL);
      const task2 = new TestTask(TaskPriority.NORMAL);
      const task3 = new TestTask(TaskPriority.HIGH);
      const task4 = new TestTask(TaskPriority.HIGH);

      queue.queue(task2);
      expect((queue as any).items).to.deep.equal([ task2 ]);

      queue.queue(task3);
      expect((queue as any).items).to.deep.equal([ task3, task2 ]);

      queue.queue(task4);
      expect((queue as any).items).to.deep.equal([ task3, task4, task2 ]);

      queue.queue(task1);
      expect((queue as any).items).to.deep.equal([ task3, task4, task2, task1 ]);
    });
  });

  describe('queueAll', () => {
    it('should queue all accordingly to priorities', () => {
      const queue = new Queue();
      const task1 = new TestTask(TaskPriority.NORMAL);
      const task2 = new TestTask(TaskPriority.NORMAL);
      const task3 = new TestTask(TaskPriority.HIGH);
      const task4 = new TestTask(TaskPriority.HIGH);

      queue.queueAll([ task1, task2, task4, task3 ]);
      expect((queue as any).items).to.deep.equal([ task4, task3, task1, task2 ]);
    });
  });

  describe('isEmpty', () => {
    it('should check if the queue is empty', () => {
      const queue = new Queue();
      const task1 = new TestTask(TaskPriority.NORMAL);

      expect(queue.isEmpty()).to.be.true;

      queue.queue(task1);

      expect(queue.isEmpty()).to.be.false;
    });
  });

  describe('dequeue', () => {
    it('should retrieve first queue task', () => {
      const queue = new Queue();

      const task1 = new TestTask(TaskPriority.NORMAL);
      const task2 = new TestTask(TaskPriority.HIGH);

      queue.queue(task1).queue(task2);

      expect(queue.dequeue()).to.deep.equal(task2);
      expect(queue.dequeue()).to.deep.equal(task1);
      expect(queue.isEmpty()).to.be.true;
    });
  });
});
