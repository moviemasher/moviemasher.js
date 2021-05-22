import { MediaFactory } from "../../Factory/MediaFactory"
import { Is } from "../../Utilities/Is"

export const media = {
  media: {
    get() {
      if (Is.undefined(this.__media)) {
        this.__media = MediaFactory.createFromObject(this.object.media)
      }
      return this.__media
    }
  },
}
