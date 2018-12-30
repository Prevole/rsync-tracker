import Taskable from '../task/Taskable';
export default class Queue {
    private items;
    queue(task: Taskable): Queue;
    queueAll(tasks: Taskable[]): Queue;
    dequeue(): Taskable;
    isEmpty(): boolean;
    private taskIsBefore;
}
