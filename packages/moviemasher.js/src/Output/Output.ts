import { Propertied } from "../Base/Propertied"
import { ValueObject, Value } from "../declarations"


interface OutputObject {
  audioBitrate: Value
  audioChannels: number
  audioCodec: string
  audioFrequency: number
  backcolor: string
  format: string
  fps: number
  g: number
  height: number
  options: ValueObject
  videoBitrate: Value
  videoCodec: string
  width: number
}


interface Output extends OutputObject, Propertied {}

interface OutputOptions extends Partial<OutputObject> {}


export  { OutputOptions, Output, OutputObject }
