export default class BackupState {
  private readonly _name: string;
  private readonly _next: string;
  private readonly _previous?: string;

  constructor(name: string, next: string, previous?: string) {
    this._name = name;
    this._next = next;
    this._previous = previous;
  }

  get name(): string {
    return this._name;
  }

  get next(): string {
    return this._next;
  }

  get previous(): string | undefined {
    return this._previous;
  }

  hasPrevious(): boolean {
    return this._previous !== undefined;
  }
}
