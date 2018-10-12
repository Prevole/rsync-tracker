export default class CommandBuilder {
  private readonly parts: string[] = [];

  push(value: string | undefined): CommandBuilder {
    if (value !== undefined) {
      this.parts.push(value);
    }

    return this;
  }

  pushPattern(pattern: string, value: string | undefined): CommandBuilder {
    if (value !== undefined) {
      this.push(pattern.replace(/%s/g, value));
    }

    return this;
  }

  pushCollection(values: string[] | undefined) {
    if (values !== undefined) {
      values.forEach((value) => this.parts.push(value));
    }

    return this;
  }

  pushCollectionPattern(pattern: string, values: string[] | undefined) {
    if (values !== undefined) {
      values.forEach((value) => this.pushPattern(pattern, value));
    }

    return this;
  }

  build(): string {
    return this.parts.join(' ');
  }
}
