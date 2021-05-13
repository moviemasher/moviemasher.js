import { FilterType, FilterTypes } from "../Types"
import { FilterFactory } from "./FilterFactory"

describe("FilterFactory", () => {
  test("color", () => {
    const color = FilterFactory.create(FilterType.color)
    // console.log(`Color: ${color}`)
  })
  test.each(FilterTypes)("create(%s)", type => {
    const filter = FilterFactory.create(type)
    expect(filter).toBeDefined()
  })
})