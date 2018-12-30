import Configuration from '../config/Configuration';
export default class TaskEngine {
    private readonly config;
    private logger;
    constructor(config: Configuration);
    process(): void;
}
