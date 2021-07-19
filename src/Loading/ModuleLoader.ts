import { LoadType } from "../Setup/Enums"
import { Loader } from "./Loader"
import { Any } from "../declarations"

class ModuleLoader extends Loader {
  type = LoadType.Module

  async requestUrl(url : string) : Promise<Any> { return import(url) }
}

export { ModuleLoader }
