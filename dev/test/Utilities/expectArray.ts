

const expectArray = (value : any) : any[] => {
  const is = Array.isArray(value)
  if (!is) console.error('expectArray', typeof value, value.constructor.name)
  expect(value).toBeInstanceOf(Array)
  if (!is) throw 'expectArray'

  return <any[]> value
}

export { expectArray }
