import Taskable from './Taskable';

export default class TaskEngineState {
  private state: { [key: string]: any } = {};
  private tasks: Taskable[] = [];

  store(key: string, value: any): void {
    this.state[key] = value;
  }

  get(key: string): any {
    return this.state[key];
  }

  scheduleTask(task: Taskable): void {
    this.tasks.push(task);
  }

  hasTasks(): boolean {
    return this.tasks.length > 0;
  }

  flushTasks(): Taskable[] {
    const tasks = this.tasks;
    this.tasks = [];
    return tasks;
  }
}
