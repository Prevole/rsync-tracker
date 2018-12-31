import TrackerConfiguration from '../config/TrackerConfiguration';
import Taskable from './Taskable';
export default class SyncTaskBuilder {
    private backupPathBuilder;
    build(config: TrackerConfiguration): Taskable[];
}
