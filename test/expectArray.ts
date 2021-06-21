import { Any } from "../src/Setup/declarations"

const expectArray = (value : Any) : Any[] => {
  const is = Array.isArray(value)
  if (!is) console.error('expectArray', typeof value, value.constructor.name)
  expect(value).toBeInstanceOf(Array)
  if (!is) throw 'expectArray'

  return <Any[]> value
}

export { expectArray }
