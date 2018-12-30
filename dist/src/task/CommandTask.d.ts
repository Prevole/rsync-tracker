import Task from './Task';
export default abstract class CommandTask extends Task {
    private childProcess;
    private logger;
    run(): boolean;
    protected abstract command(): string;
}
