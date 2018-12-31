import CommandTask from './CommandTask';
export default class SimpleTask extends CommandTask {
    private readonly _command;
    constructor(command: string);
    protected command(): string;
}
