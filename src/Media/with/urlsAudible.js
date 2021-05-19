import { UrlsByType } from "../../Loading"

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
