import { UrlsByType } from "../../Utilities";

export const inaudible = { 
  audible: { value: false },
  urlsAudibleInTimeRangeForClipByType: { 
    value: function() { return UrlsByType.none } 
  },
}