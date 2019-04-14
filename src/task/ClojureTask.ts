import { TaskPriority } from '../queue/QueueTask';
import Task from './Task';
import TaskEngineState from './TaskEngineState';

export default class ClojureTask extends Task {
  private readonly _clojure: (state: TaskEngineState) => boolean;

  constructor(name: string, clojure: (state: TaskEngineState) => boolean) {
    super(name, TaskPriority.NORMAL);
    this._clojure = clojure;
  }

  run(state: TaskEngineState): boolean {
    return this._clojure(state);
  }
}
