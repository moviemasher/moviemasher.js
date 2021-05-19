import { TrackType } from "../../Setup"
import { UrlsByType } from "../../Loading"

export const invisible = {
  visible: { value: false },
  trackType: { value: TrackType.audio },
  urlsVisibleInTimeRangeByType: {
    value: function() { return UrlsByType.none }
  },
}
