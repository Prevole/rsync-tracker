import { TaskPriority } from '../queue/QueueTask';
import Taskable from './Taskable';

export default abstract class Task implements Taskable {
  private readonly _priority: TaskPriority;

  private _runIfPreviousTaskFail: boolean = false;

  protected constructor(priority: TaskPriority) {
    this._priority = priority;
  }

  runIfPreviousTaskFail(canRun: boolean): Task {
    this._runIfPreviousTaskFail = canRun;
    return this;
  }

  canRunIfPreviousTaskFailed(): boolean {
    return this._runIfPreviousTaskFail;
  }

  priority(): TaskPriority {
    return this._priority;
  }

  abstract run(): boolean;
}
