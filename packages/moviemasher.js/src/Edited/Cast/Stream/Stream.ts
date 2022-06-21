import { Dimensions } from "../../../Setup/Dimensions"

export type Streams = Stream[]

export interface StreamObject {
  size?: Dimensions
}

export interface Stream {
  size: Dimensions
}
