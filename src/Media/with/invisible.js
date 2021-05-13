import { UrlsByType } from "../../Utilities";

export const invisible = { 
  visible: { value: false },
  urlsVisibleInTimeRangeForClipByType: { 
    value: function() { return UrlsByType.none } 
  },
}