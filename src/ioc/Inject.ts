import 'reflect-metadata';
import Registry from './Registry';

export default function Inject(ref?: string) {
  return (target: any, key: string) => {
    Object.defineProperty(target.constructor.prototype, key, {
      enumerable: true,
      get: function () {
        return Registry.get(ref ? ref : key);
      }
    });
  };
}

export function InjectInstance(className: string, ref?: string) {
  return (target: any, key: string) => {
    Object.defineProperty(target.constructor.prototype, key, {
      enumerable: true,
      get: function () {
        return new (Registry.get(ref ? ref : key)[className])();
      }
    });
  };
}
