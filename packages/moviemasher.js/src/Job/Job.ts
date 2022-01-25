import { ServerCallback, ServerOptions } from "../declarations"
import { Definition, DefinitionObject } from "../Base/Definition"

import { OutputOptions } from "../Output/Output"
import { Mash, MashObject } from "../Edited/Mash/Mash"



interface JobOptions {
  definitions?: DefinitionObject[]
  mash: MashObject
  serverOptions?: ServerOptions
  outputs: OutputOptions[]
  callback?: ServerCallback
}
interface Job {
  definitions: Definition[]
  mash: Mash
  serverOptions?: ServerOptions
  outputs: OutputOptions[]
  callback?: ServerCallback
}

export { Job, JobOptions }
