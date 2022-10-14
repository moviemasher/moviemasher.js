import { Mash, MashArgs } from "./Mash"
import { MashClass } from "./MashClass"

export const mashInstance = (object: MashArgs = {}): Mash => new MashClass(object)

export const isMashClass = (value: any): value is MashClass => value instanceof MashClass

export function assertMashClass(value: any): asserts value is MashClass {
  if (!isMashClass(value)) throw new Error("expected MashClass")
}
