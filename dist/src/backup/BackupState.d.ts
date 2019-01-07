export default class BackupState {
    private readonly _name;
    private readonly _next;
    private readonly _previous?;
    constructor(name: string, next: string, previous?: string);
    readonly name: string;
    readonly next: string;
    readonly previous: string | undefined;
    hasPrevious(): boolean;
}
