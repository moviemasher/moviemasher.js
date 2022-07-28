import { expectArray } from "../../../../dev/test/Utilities/Expect"

import { isProperty } from "../Setup/Property"
import { FilterClass } from "./FilterClass"
import { filterDefaults, filterFromId, FilterIdPrefix } from "./FilterFactory"

describe("Filter", () => {
  describe.each(filterDefaults)("%s", (filterDefinition) => {
    const filter = filterFromId(filterDefinition.id)
    const properties = filter.properties


    test("id starts with expected prefix", () => {
      expect(filterDefinition.id.startsWith(FilterIdPrefix))
    })

    test("filterFromId returns a FilterClass instance", () => {
      expect(filter).toBeInstanceOf(FilterClass)
    })
    test("its properties is a populated Array", () => {
      expectArray(properties)
      if (properties.length) {
        const [property] = properties
        expect(isProperty(property)).toBe(true)
      }
      
    })
    test("its value() method returns defaultValue for each Property", () => {
      properties.forEach(property => {
        const { name } = property
        expect(filter.value(name)).toEqual(property.defaultValue)
      })
    })
  })
})
