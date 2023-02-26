export interface ErrorObject {
  message: string
  name: string
  cause?: unknown
}

export interface PotentialError  {
  error?: ErrorObject
}

export interface DefiniteError extends Required<PotentialError> {}

export interface PathData {
  path: string
}
export type PathDataOrError = DefiniteError | PathData
