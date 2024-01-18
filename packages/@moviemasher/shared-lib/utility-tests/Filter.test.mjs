import { describe, test } from 'node:test'
import assert from 'assert'

import { expectArray } from "../../../../images/tester/Utilities/Expect.mjs"

import { 
  isProperty, FilterClass, filterDefaults, filterFromId, FilterIdPrefix 
} from "@moviemasher/shared-lib"

describe("Filter", () => {
  filterDefaults.forEach(filterDefinition => {
    const filter = filterFromId(filterDefinition.id)
    const properties = filter.properties


    test("id starts with expected prefix", () => {
      assert(filterDefinition.id.startsWith(FilterIdPrefix))
    })

    test("filterFromId returns a FilterClass instance", () => {
      assert(filter instanceof FilterClass)
    })
    test("its properties is a populated Array", () => {
      expectArray(properties)
      if (properties.length) {
        const [property] = properties
        assert(isProperty(property))
      }
      
    })
    test("its value() method returns defaultValue for each Property", () => {
      properties.forEach(property => {
        const { name } = property
        assert.equal(filter.value(name), property.defaultValue)
      })
    })
  })
})
