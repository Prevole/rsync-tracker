import TrackerConfiguration from '../config/TrackerConfiguration';
import Taskable from './Taskable';
import TaskBuilder from './TaskBuilder';
export default class BackupTaskBuilder implements TaskBuilder {
    private readonly config;
    private backupPathBuilder;
    constructor(config: TrackerConfiguration);
    build(): Taskable[];
}
