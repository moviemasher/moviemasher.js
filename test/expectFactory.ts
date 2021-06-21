import { Definition, DefinitionClass, GenericFactory } from "../src"
import { Instance, InstanceClass } from "../src/Mash/Instance"
import { Errors } from "../src/Setup/Errors"

const expectFactory = (object : unknown | undefined) :void => {
  expect(object).toBeDefined()
  if (!object) throw Errors.internal
  expect(object).toBeInstanceOf(Object)
  if (!(object instanceof Object)) throw Errors.internal
  const factory = <GenericFactory <Instance, InstanceClass, Definition, DefinitionClass>> object

  expect(factory.define).toBeInstanceOf(Function)
  expect(factory.definition).toBeInstanceOf(Function)
  expect(factory.definitionFromId).toBeInstanceOf(Function)
  expect(factory.fromId).toBeInstanceOf(Function)
  expect(factory.initialize).toBeInstanceOf(Function)
  expect(factory.instance).toBeInstanceOf(Function)

}

export { expectFactory }
