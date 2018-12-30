export default class EnvUtils {
  val(name: string, defaultValue: string | boolean): string | boolean {
    return process.env[name] !== undefined ? process.env[name]! : defaultValue;
  }
}
