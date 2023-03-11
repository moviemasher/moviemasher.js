export interface ErrorObject {
  message: string
  name: string
  cause?: unknown
}

export interface DefiniteError {
  error: ErrorObject
}


export interface PotentialError extends Partial<DefiniteError>  {
}
