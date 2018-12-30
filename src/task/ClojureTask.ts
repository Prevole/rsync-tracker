import { TaskPriority } from '../queue/QueueTask';
import Task from './Task';

export default class ClojureTask extends Task {
  private readonly _clojure: () => boolean;

  constructor(clojure: () => boolean) {
    super(TaskPriority.NORMAL);
    this._clojure = clojure;
  }

  run(): boolean {
    return this._clojure();
  }
}
