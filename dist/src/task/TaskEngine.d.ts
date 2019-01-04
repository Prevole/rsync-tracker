import Configuration from '../config/Configuration';
import TaskBuilder from './TaskBuilder';
export default class TaskEngine {
    private readonly config;
    private readonly builder;
    private logger;
    constructor(config: Configuration, builder: TaskBuilder);
    process(): void;
}
