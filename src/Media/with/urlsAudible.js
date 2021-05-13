import { LoadType } from "../../Types"
import { UrlsByType } from "../../Utilities"

export const urlsAudible = { 
  urlsAudibleInTimeRangeForClipByType: { 
    value: function() { 
      const urls = new UrlsByType
      const url = this.urlAudible
      if (url) urls.audio.push(url)
      return urls
    }
  },
}
