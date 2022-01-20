import { NumberConverter } from "../declarations"

const roundMethod = (rounding = '') : NumberConverter => {
  switch (rounding) {
    case 'ceil': return Math.ceil
    case 'floor': return Math.floor
    default: return Math.round
  }
}

const roundWithMethod = (number: number, method = ''): number => {
  const func = roundMethod(method)
  return func(number)
}

/**
 * @category Utility
 */
const Round = {
  method: roundMethod,
  withMethod: roundWithMethod,
}

export { Round, roundMethod, roundWithMethod }
