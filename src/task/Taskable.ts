export default interface Taskable {
  canRunIfPreviousTaskFailed(): boolean;

  run(): void;
}
