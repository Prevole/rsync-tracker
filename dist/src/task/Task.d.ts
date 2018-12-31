import { TaskPriority } from '../queue/QueueTask';
import Taskable from './Taskable';
export default abstract class Task implements Taskable {
    private readonly _priority;
    private _runIfPreviousTaskFail;
    protected constructor(priority: TaskPriority);
    runIfPreviousTaskFail(canRun: boolean): Task;
    canRunIfPreviousTaskFailed(): boolean;
    priority(): TaskPriority;
    abstract run(): boolean;
}
