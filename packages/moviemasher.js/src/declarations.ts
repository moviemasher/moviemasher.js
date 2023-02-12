/* eslint-disable @typescript-eslint/no-namespace */
declare global { interface Window { webkitAudioContext: typeof AudioContext } }

export type Value = number | string
export type Scalar = Value | boolean | undefined
export type PopulatedString = string & { isEmpty: never }
export type Integer = number 

export interface ValueRecord extends Record<string, Value> {}
export interface NumberRecord extends Record<string, number> {}
export interface UnknownRecord extends Record<string, unknown> {}
export interface ScalarRecord extends Record<string, Scalar> { }
export interface StringRecord extends Record<string, string> { }
export interface StringsRecord extends Record<string, string[]> { }
export interface NestedStringRecord extends Record<string, string | StringRecord | NestedStringRecord> {}

export interface StringSetter { (value: string): void }
export interface NumberSetter { (value: number): void }
export interface BooleanSetter { (value: boolean): void }
export interface BooleanGetter { (): boolean }

export type AnyArray = any[]
export type JsonValue = Scalar | AnyArray | UnknownRecord
export interface JsonRecord extends Record<string, JsonRecord | JsonValue | JsonValue[]> {}
