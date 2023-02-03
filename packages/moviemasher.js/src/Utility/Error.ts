import { PotentialError } from "../MoveMe"
import { isString } from "./Is"

export const errorFromAny = (error: any): Required<PotentialError> => {
  const { message: errorMessage } = error
  const message = isString(errorMessage) ? errorMessage : String(error)
  return { error: { message } }
}

