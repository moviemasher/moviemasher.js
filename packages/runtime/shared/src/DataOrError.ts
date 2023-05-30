import type { DefiniteError } from './Error.js'

export type Data<T = unknown> = { data: T; }
export type DataOrError<T = unknown> = DefiniteError | Data<T>
