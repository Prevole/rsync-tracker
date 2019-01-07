import TrackerConfiguration from '../config/TrackerConfiguration';
import Taskable from './Taskable';
import TaskBuilder from './TaskBuilder';
export default class SyncTaskBuilder implements TaskBuilder {
    private backupStateBuilder;
    build(config: TrackerConfiguration): Taskable[];
}
