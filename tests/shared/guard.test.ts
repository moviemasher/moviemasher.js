import type { Anys } from '../../packages/@moviemasher/shared-lib/src/types.js'

import assert from 'assert'
import { describe, test } from 'node:test'
import { isAboveZero, isArray, isBelowOne, isDate, isDefined, isFunction, isInteger, isNumber, isNumeric, isObject, isPopulatedArray, isPopulatedString, isString, isUndefined, isValue } from '../../packages/@moviemasher/shared-lib/src/utility/guard.js'


const emptyArray: Anys = []
const emptyObject = {}
const emptyString = ''
const emptyFunction = () => {} // needs to be called for 100% coverage
const undefineds: Anys = [undefined, emptyFunction()]
const booleans: Anys = [true, false]
const dates: Anys = [new Date]
const invalidNumbers: Anys = [NaN, Infinity, -Infinity]
const negativeIntegers: Anys = [-1, -2, -3]
const negativeFractions = [-0.5, -0.75]
const positiveFractions = [0.5, 0.75]
const positiveIntegers: Anys = [1, 2, 3]

const negatives: Anys = [...negativeIntegers, ...negativeFractions]
const integers: Anys = [0, ...positiveIntegers, ...negativeIntegers]
const fractions = [...negativeFractions, ...positiveFractions]
const belowOnes = [0, ...fractions, ...negatives]
const aboveZeros: Anys = [...positiveFractions, ...positiveIntegers]
const positives: Anys = [0, ...aboveZeros]
const numbers: Anys = [...positives, ...integers]
const numerics: Anys = [...numbers, ...numbers.map(String)]
const populatedStrings: Anys = [
  'abc', ...numbers.map(String), ...booleans.map(String), ...dates.map(String)
]
const functions: Anys = [Math.round, emptyFunction]
const strings: Anys = [emptyString, ...populatedStrings]
const values: Anys = [...strings, ...numbers]
const populatedArrays: Anys = [dates, numbers, strings]
const arrays: Anys = [emptyArray, ...populatedArrays]
const collections = [new Map, new Set]
const objects: Anys = [
  null, emptyObject, ...arrays, ...collections, ...dates, 
]
const defineds: Anys = [
  emptyObject, 
  ...arrays, ...booleans, ...collections, ...dates, ...functions, 
  ...invalidNumbers, ...numbers, ...strings
]
const all: Anys = [...defineds, ...undefineds]

describe('isAboveZero', () => {
  test('returns true for numbers greater than zero', () => {
    aboveZeros.forEach(value => { assert(isAboveZero(value)) })
  })
  test('returns false for everything else', () => {
    all.filter(value => !aboveZeros.includes(value)).forEach(value => 
      assert(!isAboveZero(value))
    )
  })
})

describe('isArray', () => {
  test('returns true for array objects, even if empty', () => {
    arrays.forEach(value => assert(isArray(value)))
  })
  test('returns false for everything else', () => {
    all.filter(value => !arrays.includes(value)).forEach(value => 
      assert(!isArray(value))
    )
  })
})

describe('isBelowOne', () => {
  test('returns true for numbers less than one', () => {
    belowOnes.forEach(value => assert(isBelowOne(value)))
  })
  test('returns false for everything else', () => {
    all.filter(value => !belowOnes.includes(value)).forEach(value => 
      assert(!isBelowOne(value))
    )
  })
})

describe('isDate', () => {
  test('returns true for date objects', () => {
    dates.forEach(value => assert(isDate(value)))
  })
  test('returns false for everything else', () => {
    all.filter(value => !dates.includes(value)).forEach(value => 
      assert(!isDate(value))
    )
  })
})

describe('isDefined', () => {
  test(`returns true for ${undefineds.join(', ')}`, () => {
    defineds.forEach(value => assert(isDefined(value)))
  })
  test('returns false for everything else', () => {
    all.filter(value => !defineds.includes(value)).forEach(value => {
      assert(!isDefined(value))
    })
  })
})

describe('isFunction', () => {
  test('returns true for function objects', () => {
    functions.forEach(value => assert(isFunction(value)))
  })
  test('returns false for everything else', () => {
    all.filter(value => !functions.includes(value)).forEach(value => 
      assert(!isFunction(value))
    )
  })
})

describe('isInteger', () => {
  test('returns true for integer numbers', () => {
    integers.forEach(value => assert(isInteger(value)))
  })
  test('returns false for everything else', () => {
    all.filter(value => !integers.includes(value)).forEach(value => {
      assert(!isInteger(value))
    })
  })
})

describe('isNumber', () => {
  test('returns true for valid numbers', () => {
    numbers.forEach(value => assert(isNumber(value)))
  })
 
  test(`returns false for ${invalidNumbers.join(', ')}, and everything else`, () => {
    all.filter(value => !numbers.includes(value)).forEach(value => 
      assert(!isNumber(value))
    )
  })
})

describe('isNumeric', () => {
  test('returns true for valid numbers and number strings', () => {
    numerics.forEach(value => { assert(isNumeric(value)) })
  })
  test('returns false for everything else', () => {
    all.filter(value => !numerics.includes(value)).forEach(value => {
      // if (isNumeric(value)) console.log(value, 'is numeric')
      assert(!isNumeric(value))
    })
  })
})

describe('isObject', () => {
  test('returns true for null and all objects', () => {
    objects.forEach(value => { assert(isObject(value)) })
  })
  test('returns false for strings, boolean, and numbers', () => {
    all.filter(value => !objects.includes(value)).forEach(value => {
      assert(!isObject(value))
    })
  })
})

describe('isPopulatedArray', () => {
  test('returns true for arrays with nonzero length', () => {
    populatedArrays.forEach(value => { assert(isPopulatedArray(value)) })
  })
  test('returns false for everything else', () => {
    all.filter(value => !populatedArrays.includes(value)).forEach(value => {
      assert(!isPopulatedArray(value))
    })
  })
})

describe('isPopulatedString', () => {
  test('returns true for strings with nonzero length', () => {
    populatedStrings.forEach(value => { assert(isPopulatedString(value)) })
  })
  test('returns false for everything else', () => {
    all.filter(value => !populatedStrings.includes(value)).forEach(value => {
      assert(!isPopulatedString(value))
    })
  })
})

describe('isString', () => {
  test('returns true for strings, regardless of content', () => {
    strings.forEach(value => { assert(isString(value)) })
  })
  test('returns false for everything else', () => {
    all.filter(value => !strings.includes(value)).forEach(value => {
      assert(!isString(value))
    })
  })
}) 

describe('isUndefined', () => {
  test(`returns true for ${undefineds.join(', ')}`, () => {
    undefineds.forEach(value => { assert(isUndefined(value)) })
  })
  test('returns false for everything else', () => {
    all.filter(value => !undefineds.includes(value)).forEach(value => {
      assert(!isUndefined(value))
    })
  })
})

describe('isValue', () => { 
  test(`returns true for strings and valid numbers`, () => {
    values.forEach(value => { assert(isValue(value)) })
  })
  test('returns false for everything else', () => {
    all.filter(value => !values.includes(value)).forEach(value => {
      assert(!isValue(value))
    })
  })
})
