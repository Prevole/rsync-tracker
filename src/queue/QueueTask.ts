export default interface Queueable {
  priority: TaskPriority;
}

export enum TaskPriority {
  HIGH = 1,
  NORMAL = 2
}
