import { Errors, Module } from "../../Setup"
import { MediaFactory } from "../../Factory/MediaFactory"
import { Is } from "../../Utilities"

export const media = {
  media: {
    get() {
      if (Is.undefined(this.__media)) this.__media = this.mediaInitialize

      return this.__media
    }
  },
  mediaInitialize: {
    get() {
      if (this.object.media) {
        return MediaFactory.createFromObject(this.object.media)
      }

      const module = Module.ofType(this.id, this.type)
      if (!module) throw Errors.unknown[this.type]

      return MediaFactory.createFromObject(module)
    }
  }
}
