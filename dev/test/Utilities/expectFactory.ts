import { GenericFactory } from "../../../packages/moviemasher.js/src/declarations"
import { Definition, DefinitionObject } from "@moviemasher/moviemasher.js/src/Definition/Definition"
import { Instance, InstanceObject } from "../../../packages/moviemasher.js/src/Instance/Instance"
import { Errors } from "../../../packages/moviemasher.js/src/Setup/Errors"

export const expectFactory = (object : unknown | undefined) :void => {
  expect(object).toBeDefined()
  if (!object) throw Errors.internal

  expect(object).toBeInstanceOf(Object)
  if (!(object instanceof Object)) throw Errors.internal

  const factory = <GenericFactory <Instance, InstanceObject, Definition, DefinitionObject>> object
  expect(factory.definition).toBeInstanceOf(Function)
  expect(factory.definitionFromId).toBeInstanceOf(Function)
  expect(factory.fromId).toBeInstanceOf(Function)
  expect(factory.instance).toBeInstanceOf(Function)
}
