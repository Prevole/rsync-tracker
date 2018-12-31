import Task from './Task';
export default class ClojureTask extends Task {
    private readonly _clojure;
    constructor(clojure: () => boolean);
    run(): boolean;
}
