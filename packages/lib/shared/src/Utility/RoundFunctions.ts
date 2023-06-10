export const roundMethod = (rounding = ''): (value: number) => number => {
  switch (rounding) {
    case 'ceil': return Math.ceil
    case 'floor': return Math.floor
    default: return Math.round
  }
}

export const roundWithMethod = (number: number, method = ''): number => {
  const func = roundMethod(method)
  return func(number)
}
