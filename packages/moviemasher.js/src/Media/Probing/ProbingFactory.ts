import { Probing, ProbingObject } from "./Probing"
import { ProbingClass } from "./ProbingClass"

export const probingInstance = (object: ProbingObject): Probing => {
  return new ProbingClass(object)
}