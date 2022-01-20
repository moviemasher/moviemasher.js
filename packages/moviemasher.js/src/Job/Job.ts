import { ServerOptions } from "../declarations"
import { Definition, DefinitionObject } from "../Base/Definition"

import { OutputOptions } from "../Output/Output"
import { Mash, MashObject } from "../Edited/Mash/Mash"

interface Job {
  definitions: Definition[]
  mash: Mash
  serverOptions?: ServerOptions
  outputs: OutputOptions[]
}

interface JobObject {
  definitions: DefinitionObject[]
  mash: MashObject
  serverOptions?: ServerOptions
  outputs: OutputOptions[]
}

export { Job, JobObject }
