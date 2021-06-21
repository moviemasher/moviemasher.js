import { DefinitionTypes } from "../../Setup"
import { Factories } from "../Factories"
import { expectFactory } from "../../../test/expectFactory"


describe("Factories", () => {
  test("is instance of object", () => expect(Factories).toBeInstanceOf(Object))
  test("has 11 keys", () => expect(Object.keys(Factories).length).toBe(11))
  test("has key for each definition type", () => (
    expect(Object.keys(Factories).sort()).toEqual(DefinitionTypes)
  ))
  test.each(DefinitionTypes)(".%s returns factory object", (type) => {
    expectFactory(Factories[type])
  })
})
