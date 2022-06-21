import { expectArray } from "../../../../dev/test/Utilities/expectArray"
import { expectArrayLength } from "../../../../dev/test/Utilities/expectArrayLength"
import { ValueObject } from "../declarations"
import { Default } from "../Setup/Default"
import { isProperty } from "../Setup/Property"
import { FilterClass } from "./FilterClass"
import { filterDefaults, filterFromId, FilterIdPrefix } from "./FilterFactory"

describe("Filter", () => {
  describe.each(filterDefaults)("%s", (filterDefinition) => {
    const filter = filterFromId(filterDefinition.id)
    const properties = filter.properties()


    const chain = filter.chain()
    test("id starts with expected prefix", () => {
      expect(filterDefinition.id.startsWith(FilterIdPrefix))
    })

    test("filterFromId returns a FilterClass instance", () => {
      expect(filter).toBeInstanceOf(FilterClass)
    })
    test("its properties() method returns a populated Array", () => {
      expectArrayLength(properties)
      const [property] = properties
      expect(isProperty(property)).toBe(true)
      
    })
    test("its value() method returns defaultValue for each Property", () => {
      properties.forEach(property => {
        const { name } = property
        expect(filter.value(name)).toEqual(property.defaultValue)
      })
    })
    test("its chain() method returns a Chain object", () => {
      expect(chain).toBeInstanceOf(Object)
      const { commandFiles, commandFilters } = chain
      expectArray(commandFiles)
      expectArray(commandFilters)
    })
  })
})
