import { Errors } from "../../Setup/Errors"

export const deprecated = {
  uuid: { value() { return 'ID' } },
  canvas_context: {
    get() {
      console.warn(Errors.deprecation.canvas_context.get)
      return this.videoContext
    },
    set(value) {
      console.warn(Errors.deprecation.canvas_context.set)
      this.videoContext = value
    }
  },
  buffertime: {
    get() { return this.buffer },
    set(value) { this.buffer = value }
  },
  minbuffertime: {
    get() { return this.buffer },
    set(value) { this.buffer = value }
  },
}
