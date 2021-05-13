import { Errors } from "../../Errors"
import { MediaFactory } from "../../Factory/MediaFactory"
import { Module } from "../../Module"

export const media = { 
  media: { get: function() { 
    return this.__media ||= this.mediaInitialize } 
  },
  mediaInitialize: { 
    get: function() {
      if (this.object.media) return MediaFactory.create(this.object.media)

      const module = Module.ofType(this.id, this.type)
      if (! module) throw Errors.unknown[this.type] + this.type + ' ' + this.id
      
      return MediaFactory.create(module)
    }
  }
}
