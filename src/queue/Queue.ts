import Taskable from '../task/Taskable';

export default class Queue {
  private items: Taskable[] = [];

  queue(task: Taskable): Queue {
    for (let i = this.items.length - 1; i >= 0; i--) {
      if (this.taskIsBefore(task, i)) {
        this.items.splice(i - 1, 0, task);
        return this;
      }
    }

    this.items.push(task);

    return this;
  }

  queueAll(tasks: Taskable[]): Queue {
    tasks.forEach((task: Taskable) => this.queue(task));
    return this;
  }

  dequeue(): Taskable {
    return this.items.shift()!;
  }

  isEmpty(): boolean {
    return this.items.length === 0;
  }

  private taskIsBefore(task: Taskable, against: number): boolean {
    return task.priority < this.items[against].priority;
  }
}
