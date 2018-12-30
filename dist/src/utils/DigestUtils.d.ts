export default class DigestUtils {
    private readonly algo;
    private readonly outputStyle;
    private crypto;
    constructor(algo: string, outputStyle: string);
    digest(str: string): string;
}
