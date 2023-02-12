
type NumberConverter = (value: number) => number 

export const roundMethod = (rounding = ''): NumberConverter => {
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
