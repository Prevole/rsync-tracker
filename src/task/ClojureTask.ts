import Taskable from './Taskable';

export default class ClojureTask implements Taskable {
  private readonly _clojure: Function;
  private _canRunIfPreviousTaskFails: boolean = false;

  constructor(clojure: Function) {
    this._clojure = clojure;
  }

  runIfPreviousTaskFail(canRun: boolean): ClojureTask {
    this._canRunIfPreviousTaskFails = canRun;
    return this;
  }

  canRunIfPreviousTaskFailed(): boolean {
    return this._canRunIfPreviousTaskFails;
  }

  run(): void {
    this._clojure();
  }
}
