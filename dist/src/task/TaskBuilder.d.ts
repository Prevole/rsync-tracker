import TrackerConfiguration from '../config/TrackerConfiguration';
import Taskable from './Taskable';
export default interface TaskBuilder {
    build(config: TrackerConfiguration): Taskable[];
}
