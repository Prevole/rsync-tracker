import Taskable from './Taskable';

export default interface TaskBuilder {
  build(): Taskable[];
}
