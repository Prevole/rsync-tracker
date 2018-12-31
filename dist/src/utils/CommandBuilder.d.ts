export default class CommandBuilder {
    private readonly parts;
    push(value: string | undefined): CommandBuilder;
    pushPattern(pattern: string, value: string | undefined): CommandBuilder;
    pushCollection(values: string[] | undefined): this;
    pushCollectionPattern(pattern: string, values: string[] | undefined): this;
    build(): string;
}
