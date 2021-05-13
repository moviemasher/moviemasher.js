import { LoadType } from "../Types"
import { Loader } from "./Loader"

class ModuleLoader extends Loader {
  constructor(object) {
    super(object)
    this.object.type ||= LoadType.module
  }
  requestUrl(url) { return import(url) }
}

export { ModuleLoader }