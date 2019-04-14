import Queueable from '../queue/QueueTask';
import TaskEngineState from './TaskEngineState';

export default interface Taskable extends Queueable {
  name(): string;

  canRunIfPreviousTaskFailed(): boolean;

  run(state: TaskEngineState): boolean;
}
