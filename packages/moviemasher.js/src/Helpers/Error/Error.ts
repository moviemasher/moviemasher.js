import { UnknownRecord } from "../../declarations"


export interface ErrorObject {
  message: string
  name: string
  cause?: unknown
}

export interface PotentialError  {
  error?: ErrorObject
}

export interface DefiniteError extends Required<PotentialError> {}

export interface PathOrError extends PotentialError {
  path?: string;
}
