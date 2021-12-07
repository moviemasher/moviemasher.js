import { OutputOptions, RemoteServer } from "../declarations"
import { Definition, DefinitionObject } from "../Base/Definition"
import { Mash, MashObject } from "../Mash/Mash/Mash"

interface Job {
  definitions: Definition[]
  mash: Mash
  remoteServer?: RemoteServer
  outputs: OutputOptions[]
}

interface JobObject {
  definitions: DefinitionObject[]
  mash: MashObject
  remoteServer?: RemoteServer
  outputs: OutputOptions[]
}

export { Job, JobObject }
