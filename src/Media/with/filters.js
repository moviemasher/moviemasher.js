
import { FilterMedia } from "../FilterMedia"

export const filters = { 
  filters: { 
    get: function() { return this.__filters ||= this.filtersInitialize } 
  }, 
  filtersInitialize: { 
    get: function() { 
      const array = this.object.filters || []
      return array.map(object => new FilterMedia(object))
    }
  }
} 
