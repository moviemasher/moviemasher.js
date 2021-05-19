import { UrlsByType } from "../../Loading/UrlsByType"

export const inaudible = {
  audible: { value: false },
  urlsAudibleInTimeRangeForClipByType: {
    value: function() { return UrlsByType.none }
  },
}
