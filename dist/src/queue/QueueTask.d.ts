export default interface Queueable {
    priority(): TaskPriority;
}
export declare enum TaskPriority {
    HIGH = 1,
    NORMAL = 2
}
