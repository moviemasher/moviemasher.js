import { Is } from "../../Utilities"
import { Module, Errors } from "../../Setup"
import { UrlsByType } from "../../Loading"

export const urlsFromFilters = {
  urlsVisibleInTimeRangeForClipByType: {
    value(timeRange, clip) {
      const urls = new UrlsByType()
      const propertiesByType = this.modularPropertiesByType
      Object.keys(propertiesByType).forEach(type => {
        const modularProperties = propertiesByType[type]
        modularProperties.forEach(property => {
          const value = clip.get(property)
          // console.log(clip)
          if (Is.defined(value)) {
            const module = Module.ofType(value, type)
            if (Is.defined(module)) {
              urls[type].push(module.source)
            }
          } else throw Errors.unknown.type
        })
      })

      return urls
    }
  }
}
