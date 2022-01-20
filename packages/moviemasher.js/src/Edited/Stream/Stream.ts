import { UnknownObject } from "../../declarations"
import { Edited } from "../Edited"

interface StreamObject extends UnknownObject {
  id? : string
  createdAt?: string
  label?: string
}
interface Stream extends Edited {
  id: string
  label: string
  toJSON(): UnknownObject
}

export { Stream, StreamObject}
