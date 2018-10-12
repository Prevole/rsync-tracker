export default class Registry {
    private static deps;
    static register(key: string, value: any): void;
    static get(key: string): any;
    static clear(): void;
}
