import { UrlsByType } from "../../Loading"

export const invisible = {
  visible: { value: false },
  urlsVisibleInTimeRangeForClipByType: {
    value: function() { return UrlsByType.none }
  },
}
