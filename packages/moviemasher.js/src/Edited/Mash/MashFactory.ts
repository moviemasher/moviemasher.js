import { Mash, MashArgs } from "./Mash"
import { MashClass } from "./MashClass"

export const mashInstance = (object: MashArgs = {}): Mash => {
  return new MashClass(object)
}

export const isMash = (value: any): value is Mash => value instanceof MashClass

export function assertMash(value: any): asserts value is MashClass {
  if (!isMash(value)) throw new Error("expected Mash")
}
