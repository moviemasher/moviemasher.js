export type Value = number | string
export type Scalar = Value | boolean
export type ScalarOrUndefined = Scalar | undefined
export type PopulatedString = string & { isEmpty: never }
export type Integer = number 

export interface Scalars extends Array<Scalar> {}

export interface Strings extends Array<string>{}

export interface Numbers extends Array<number>{}

export interface ValueRecord extends Record<string, Value> {}
export interface NumberRecord extends Record<string, number> {}
export interface UnknownRecord extends Record<string, unknown> {}
export interface ScalarRecord extends Record<string, Scalar> {}
export interface StringRecord extends Record<string, string> {}
export interface StringsRecord extends Record<string, Strings> {}
export interface BooleanRecord extends Record<string, boolean> {}

export type StringTuple = [string, string]
export interface NestedStringRecord extends Record<string, string | StringRecord | NestedStringRecord> {}

export interface UnknownRecords extends Array<UnknownRecord>{}

export interface StringSetter { (value: string): void }
export interface NumberSetter { (value: number): void }
export interface BooleanSetter { (value: boolean): void }
export interface BooleanGetter { (): boolean }

export interface Unknowns extends Array<unknown>{}
export type JsonArray = Strings | Numbers | UnknownRecords
export type JsonValue = Scalar | Unknowns | UnknownRecord
export interface JsonRecord extends Record<string, JsonRecord | JsonValue | JsonValue[]> {}
export interface JsonRecords extends Array<JsonRecord>{}

/* eslint-disable @typescript-eslint/no-namespace */
declare global { interface Window { webkitAudioContext: typeof AudioContext } }
