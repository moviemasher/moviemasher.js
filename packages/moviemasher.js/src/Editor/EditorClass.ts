import { Any } from "../declarations"
import { BrowserPreloaderClass } from "../Preloader/BrowserPreloaderClass"
import { EditorOptions } from "./Editor"

export class EditorClass {
  constructor(...args: Any[]) {
    const [object] = args
    const { endpoint, preloader } = object as EditorOptions
    this.preloader = preloader || new BrowserPreloaderClass(endpoint)
  }

  preloader: BrowserPreloaderClass
}
