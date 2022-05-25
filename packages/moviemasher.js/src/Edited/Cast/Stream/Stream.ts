import { Size } from "../../../declarations"

export type Streams = Stream[]

export interface StreamObject {
  size?: Size
}

export interface Stream {
  size: Size
}
