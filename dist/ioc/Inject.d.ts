import 'reflect-metadata';
export default function Inject(ref?: string): (target: any, key: string) => void;
export declare function InjectInstance(className: string, ref?: string): (target: any, key: string) => void;
