
import { Errors } from "../../Errors"
import { Is } from "../../Is"
import { Module } from "../../Module"
import { UrlsByType } from "../../Utilities"

export const urlsFromFilters = { 
  urlsVisibleInTimeRangeForClipByType: { 
    value: function(timeRange, clip) { 
      const urls = new UrlsByType
      const properties_by_type = this.modularPropertiesByType
      Object.keys(properties_by_type).forEach(type => {
        const modular_properties = properties_by_type[type]
        modular_properties.forEach(property => {
          const value = clip.property(property)
          // console.log(clip)
          if (Is.defined(value)) {
            const module = Module.ofType(value, type)
            if (Is.defined(module)) {
              urls[type].push(module.source)
            }
          } else throw(Errors.unknown.type + type)
        }) 
      })
     
      return urls
    } 
  },
}

// we no longer load filters - they must be registered or defined in full
// urlsVisibleInTimeRange(timeRange) { 
//   const urls = super.urlsVisibleInTimeRange(timeRange)
//   if (Is.array(this.filters)) {
//     this.filters.forEach(filter => {
//       const filter_id = filter.id
//       if (!FilterFactory.created(filter_id)) {
//         // console.log(`!FilterFactory.created(${filter_id})`, filter)
//         const source = filter_config.source
//         if (source) urls.push(source)
//       }
//     })
//   }
//   return urls
// }

