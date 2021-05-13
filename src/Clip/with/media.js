import { MediaFactory } from "../../Factory/MediaFactory"
import { Is } from "../../Is"

export const media = { 
  media: { 
    get: function() { 
      if (Is.undefined(this.__media)) {
        this.__media = MediaFactory.create(this.object.media)
      }
      return this.__media 
    }
  }, 
}
