import { LoadType } from "../Setup/Enums"
import { ProcessorFactory } from "./ProcessorFactory"
import { Loader } from "./Loader"
import { LoadFontPromise } from "../declarations"

class FontLoader extends Loader {
  type = LoadType.Font

  requestUrl(url : string) : LoadFontPromise {
    return fetch(url)
      .then(response => response.arrayBuffer())
      .then(buffer => ProcessorFactory.font().process(url, buffer))
  }
}

export { FontLoader }
