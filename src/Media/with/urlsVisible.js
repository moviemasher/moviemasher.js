import { LoadType } from "../../Setup"
import { UrlsByType } from "../../Loading"

export const urlsVisible = {
  urlsVisibleInTimeRange: { value: function() { return [this.urlVisible] } },
  urlsVisibleInTimeRangeForClipByType: { value: function(timeRange, clip) {
    const urls = new UrlsByType
    const url = this.urlVisible
    if (url) urls[LoadType.image].push(url)
    return urls
  }},
}
