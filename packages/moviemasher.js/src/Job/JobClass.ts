import { ServerCallback, ServerOptions } from "../declarations"
import { Definition } from "../Base/Definition"
import { Factory } from "../Definitions/Factory/Factory"
import { Mash } from "../Edited/Mash/Mash"
import { OutputOptions } from "../Output/Output"
import { Job, JobOptions } from "./Job"
import { MashFactory } from "../Edited/Mash/MashFactory"

class JobClass implements Job {
  constructor(options: JobOptions) {
    const { mash, definitions, serverOptions, callback, outputs } = options
    if (definitions) this.definitions.push(...Factory.definitionsFromObjects(definitions))
    this.mash = MashFactory.instance(mash)
    this.outputs.push(...outputs)
    if (callback) this.callback = callback
    if (serverOptions) Object.assign(this.serverOptions, serverOptions)
  }

  callback?: ServerCallback

  definitions: Definition[] = []

  mash: Mash

  outputs: OutputOptions[] = []

  serverOptions?: ServerOptions
}

export { JobClass }
