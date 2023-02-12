import { UnknownRecord } from "../declarations";


export type Constrained<T = UnknownRecord> = new (...args: any[]) => T;
