import Queueable from '../queue/QueueTask';

export default interface Taskable extends Queueable {
  canRunIfPreviousTaskFailed(): boolean;

  run(): boolean;
}
