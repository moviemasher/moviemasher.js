import { Any } from "../declarations"
import { Output } from "../Output/Output"
import { PreloaderClass } from "../Preloader/PreloaderClass"
import { EditorOptions } from "./Editor"

class EditorClass {
  constructor(...args: Any[]) {
    const [object] = args
    const { endpoint } = object as EditorOptions

    this.preloader = new PreloaderClass(endpoint)
  }


  output?: Output

  preloader: PreloaderClass
}

export { EditorClass }
