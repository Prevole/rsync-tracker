export default class Registry {
  private static deps: { [key: string]: any; } = {};

  static register(key: string, value: any): void {
    if (Registry.deps[key]) {
      throw new Error(`${key} is already registered`);
    } else {
      Registry.deps[key] = value;
    }
  }

  static registerIfNotExist(key: string, value: any) {
    if (!Registry.deps[key]) {
      Registry.deps[key] = value;
    }
  }

  static get(key: string): any {
    return Registry.deps[key];
  }

  static clear(key?: string): void {
    if (key) {
      delete Registry.deps[key];
    } else {
      Registry.deps = {};
    }
  }
}
