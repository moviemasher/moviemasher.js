import { UrlsByType } from "../../Utilities";

export const inaudible = { 
  audible: { value: false },
  urlsAudibleInTimeRangeByType: { 
    value: function() { return UrlsByType.none } 
  },
}