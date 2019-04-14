import { TaskPriority } from '../queue/QueueTask';
import Taskable from './Taskable';
import TaskEngineState from './TaskEngineState';

export default abstract class Task implements Taskable {
  private readonly _name: string;
  private _priority: TaskPriority;

  private _runIfPreviousTaskFail: boolean = false;

  protected constructor(name: string, priority: TaskPriority) {
    this._name = name;
    this._priority = priority;
  }

  name(): string {
    return this._name;
  }

  runIfPreviousTaskFail(canRun: boolean): Task {
    this._runIfPreviousTaskFail = canRun;
    return this;
  }

  canRunIfPreviousTaskFailed(): boolean {
    return this._runIfPreviousTaskFail;
  }

  get priority(): TaskPriority {
    return this._priority;
  }

  set priority(priority: TaskPriority) {
    this._priority = priority;
  }

  abstract run(state: TaskEngineState): boolean;
}
