import { UrlsByType } from "../../Loading"

export const inaudible = {
  audible: { value: false },
  urlsAudibleInTimeRangeByType: {
    value: function() { return UrlsByType.none }
  },
}
