import { TrackType } from "../../Types";
import { UrlsByType } from "../../Utilities";

export const invisible = { 
  visible: { value: false },
  trackType: { value: TrackType.audio },
  urlsVisibleInTimeRangeByType: { 
    value: function() { return UrlsByType.none } 
  },
}