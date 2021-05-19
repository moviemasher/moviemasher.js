import { ColorFilter, CoreFilter } from "../CoreFilter"
import { FilterFactory } from "./FilterFactory"

describe("FilterFactory", () => {
  test("color", () => {
    const color = FilterFactory.create(FilterFactory.type.color)
    expect(color).toStrictEqual(ColorFilter)
  })
  test.each(FilterFactory.types)("create(%s)", type => {
    const filter = FilterFactory.create(type)
    expect(filter).toBeInstanceOf(CoreFilter)
  })
})