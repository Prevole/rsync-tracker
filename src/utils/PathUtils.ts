function pad(value: number) {
  let pathElement = `${value}`;
  return pathElement.length === 1 ? `0${pathElement}` : pathElement;
}

export default class PathUtils {
  pathFromDate(date: Date): string {
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hour = pad(date.getHours());

    return `${date.getFullYear()}/${month}/${day}/${hour}`;
  }

  avoidConflict(previous: string | undefined, next: string) {
    if (previous === undefined) {
      return next;
    }

    const previousWithoutSuffix = previous.replace(/-.*/, '');
    const nextWithoutSuffix = next.replace(/-.*/, '');

    if (nextWithoutSuffix === previousWithoutSuffix) {
      const previousSuffix = previous.replace(/(?:\d+\/?)+(?:-(\d+))?/g, '$1');

      let nextSuffix = 1;
      if (previousSuffix.match(/\d+/)) {
        nextSuffix = parseInt(previousSuffix, 10) + 1;
      }

      return `${next}-${nextSuffix}`;
    } else {
      return next;
    }
  }
}
