import type { Evaluation, Values } from '../../packages/@moviemasher/shared-lib/src/types.js'

import assert from 'assert'
import { describe, test } from 'node:test'
import { $ADD, $CEIL, $DIVIDE, $EQ, $FLOOR, $GT, $GTE, $IF, $IFNOT, $LT, $LTE, $MAX, $MIN, $MULTIPLY, $NE, $NUMBER, $ROUND, $SUBTRACT, $VARIABLE } from '../../packages/@moviemasher/shared-lib/src/runtime.js'
import { Eval, EvaluationVariables } from '../../packages/@moviemasher/shared-lib/src/utility/evaluation.js'

const number = 5.5
const numeric = String(number)
const numericOperation = Eval($VARIABLE, numeric)
const string = 'w'
const numberOperation = Eval($NUMBER, number)
const stringOperation = Eval($VARIABLE, string)
const numberAdditionOperation = Eval($ADD, [number, number])
const stringAdditionOperation = Eval($ADD, [string, string])
const additionOperation = Eval($ADD, [number, string])
const additionResultNumber = number + number

const bracketed = (delimiter: string, ...values: Values) => `(${values.join(delimiter)})`

const additionResultString = bracketed($ADD, string, string)

const additionResult = bracketed($ADD, number, string)


describe('Evaluation', () => {
  describe('description', () => {
    const w = Eval($VARIABLE, 'w', 'width')
    const two = Eval($NUMBER, 2)
    const three = Eval($NUMBER, 3, 'three')
    const twoPlusThree = Eval($ADD, [two, three], 'twoPlusThree')

    const one = Eval($NUMBER, 1)
    const zero = Eval($NUMBER, 0, 'zero')
    const onePlusZero = Eval($ADD, [one, zero])
    const wPlusOnePlusZero = Eval($ADD, [w, onePlusZero])
    const h = Eval($VARIABLE, 'h')

    const onePointFive = Eval($NUMBER, 1.5)
    const round = Eval($ROUND, [onePointFive], 'rounded')
    const gt = Eval($GT, [one, two])
    const ifOperation = Eval($IF, [gt, two, one], 'ifOperation')

    type EvaluationDescription = [Evaluation, string]
    const expected: Record<string, EvaluationDescription> = {
      [$ADD]: [twoPlusThree, `
(   // addition operator [twoPlusThree]
  2 // number
  + // 
  3 // number [three]
)   // = 5 addition operator [twoPlusThree]
      `],
      [$NUMBER]: [one, '1 // number'],
      labeledNumber: [zero, '0 // number [zero]'],
      [$VARIABLE]: [h, 'h // variable h'],
      labeledVariable: [w, 'w // variable w [width]'],
      wPlusOnePlusZero: [ wPlusOnePlusZero, `
(     // addition operator
  w   // variable w [width]
  +   // 
  (   // addition operator
    1 // number
    + // 
    0 // number [zero]
  )   // = 1 addition operator
)     // = ? addition operator
      `],
      ifOperation: [ifOperation, `
if(   // if conditional [ifOperation]
  gt( // gt comparison
    1 // number
    , // >
    2 // number
  )   // = false gt comparison
  ,   // then
  2   // number
  ,   // else
  1   // number
)     // = 1 if conditional [ifOperation]
      `],
      [$ROUND]: [round, `
round( // round method [rounded]
  1.5  // number
)      // = 2 round method [rounded] 
      `]
    }
    Object.entries(expected).forEach(([testName, [operation, description]]) => {
      const expected = description.trim()
      test(testName, () => {
        const { description } = operation
        if (description !== expected) console.log(description)
        assert.strictEqual(description, expected)
      })
    })
  })
})

describe('Eval', () => {
  describe('value', () => {
    test('returns string when supplied string', () => {
      const value = stringOperation.toValue()
      assert.strictEqual(value, string)
    })
    test('returns number when supplied numeric string', () => {
      const value = numericOperation.toValue()
      assert.strictEqual(value, number)
    })
    test('returns number when supplied number', () => {
      const value = numberOperation.toValue()
      assert.strictEqual(value, number)
    })
  })

  describe('Number', () => {
    test('number coerces correctly to number', () => {
      assert.strictEqual(Number(numberOperation), number)
    })
    test('sum of numbers coerces to proper number', () => {
      assert.strictEqual(Number(numberAdditionOperation), additionResultNumber)
    })
    test('string coerces to NaN', () => {
      assert.strictEqual(Number(stringOperation), NaN)
    })
    test('sum of number and string coerces to NaN', () => {
      assert.strictEqual(Number(additionOperation), NaN)
    })
    test('sum of strings coerces to NaN', () => {
      assert.strictEqual(Number(stringAdditionOperation), NaN)
    })
  })

  describe('String', () => {
    test('string coerces to string', () => {
      assert.strictEqual(String(stringOperation), string)
    })
    test('number coerces to string', () => {
      assert.strictEqual(String(numberOperation), numeric)
    })
    test('sum of numbers coerces to string', () => {
      assert.strictEqual(String(numberAdditionOperation), bracketed($ADD, numeric, numeric))
    })
    test('sum of strings coerces to string', () => {
      assert.strictEqual(String(stringAdditionOperation), additionResultString)
    })
    test('sum of number and string coerces to string', () => {
      assert.strictEqual(String(additionOperation), additionResult)
    })
  })

  describe('arithmetic', () => {
    const expected = {
      [$ADD]: [
        ['w', 1, '(w+1)'],
        [0, 'w', 'w'],
        ['w', 0, 'w'],
        ['w', 'h', '(w+h)'],
        [1, 2, 3],
        [1, 0, 1],
        [0, 1, 1],
      ],
      [$SUBTRACT]: [
        ['w', 1, '(w-1)'],
        ['w', 'h', '(w-h)'],
        [0, 1, -1],
        [1, 0, 1],
        [1, 2, -1],
        [3, 2, 1],
      ],
      [$MULTIPLY]: [
        [0, 1, 0],
        [1, 0, 0],
        [0, 'w', '0'],
        ['w', 0, '0'],
        ['w', 1, 'w'],
        [1, 'w', 'w'],
        ['w', 'h', '(w*h)'],
        [1, 2, 2],
        [3, 2, 6],
      ],
      [$DIVIDE]: [
        ['w', 1, 'w'],
        [1, 'w','(1/w)'],
        ['w', 'h', '(w/h)'],
        [1, 2, 0.5],
        [6, 2, 3],
        [0, 1, 0],
      ],
    }
    Object.entries(expected).forEach(([operationId, values]) => {
      values.forEach(([a, b, c]) => {
        test(`${a} ${operationId} ${b} === ${c}`, () => {
          const evaluation = Eval(operationId, [a, b])
          const value = evaluation.toValue()
          assert.strictEqual(value, c)
          // if (isNumber(value)) assert.strictEqual(value, evaluation.evaluate())

        })
      })
    })
  })

  describe('math double argument', () => {
    const expected = {
      [$MIN]: [
        ['w', 1, 'min(w,1)'],
        [0, 'w', 'min(0,w)'],
        ['w', 0, 'min(w,0)'],
        ['w', 'h', 'min(w,h)'],
        [1, 2, 1],
        [1, 0, 0],
      ],
      [$MAX]: [
        ['w', 1, 'max(w,1)'],
        [0, 'w', 'max(0,w)'],
        ['w', 0, 'max(w,0)'],
        ['w', 'h', 'max(w,h)'],
        [1, 2, 2],
        [1, 0, 1],
      ],
    }
    Object.entries(expected).forEach(([operationId, values]) => {
      values.forEach(([a, b, c]) => {
        test(`${operationId}(${a},${b}) === ${c}`, () => {
          const evaluation = Eval(operationId, [a, b])
          const value = evaluation.toValue()
          assert.strictEqual(value, c)
          // if (isNumber(value)) assert.strictEqual(value, evaluation.evaluate())
        })
      })
    })
  })

  describe('math single argument', () => {
    const expected = {
      [$ROUND]: [
        [1, 1],
        [0, 0],
        [0.5, 1],
        [0.51, 1],
        [0.49, 0],
        ['w', 'round(w)'],
      ],
      [$CEIL]: [
        [1, 1],
        [0, 0],
        [0.5, 1],
        [0.51, 1],
        [0.49, 1],
        ['w', 'ceil(w)'],
      ],
      [$FLOOR]: [
        [1, 1],
        [0, 0],
        [0.5, 0],
        [0.51, 0],
        [0.49, 0],
        ['w', 'floor(w)'],
      ],
    }
    Object.entries(expected).forEach(([operationId, values]) => {
      values.forEach(([a, b]) => {
        test(`${operationId}(${a}) === ${b}`, () => {
          assert.strictEqual(Eval(operationId, a).toValue(), b)
        })
      })
    })
  })

  describe('branching', () => {
    const expected = {
      [$IF]: [
        [1, 2, 2],
        [0, 2, 0],
        [0, 1, 2, 2],
        [1, 2, 3, 2],
        ['w', 1, 1, 'if(w,1,1)'],
        ['w', 0, 1, 'if(w,0,1)'],
        ['w', 1, 2, 'if(w,1,2)'],
      ],
      [$IFNOT]: [
        [1, 2, 0],
        [0, 2, 2],
        [0, 1, 2, 1],
        [1, 2, 3, 3],
        ['w', 1, 1, 'ifnot(w,1,1)'],
        ['w', 0, 1, 'ifnot(w,0,1)'],
        ['w', 1, 2, 'ifnot(w,1,2)'],
      ]
    }
    Object.entries(expected).forEach(([operationId, values]) => {
      values.forEach(array => {
        const last = array.pop()
        test(`${operationId}(${array.join(', ')}) === ${last}`, () => {
          const evaluation = Eval(operationId, array)
          const value = evaluation.toValue()
          assert.strictEqual(value, last)
          // if (isNumber(value)) assert.strictEqual(value, evaluation.evaluate())
        })
      })
    })
  })

  describe('comparison', () => {
    const expected = {
      [$GT]: [
        [1, 2, 0],
        [2, 1, 1],
        ['w', 1, 'gt(w,1)'],
        [1, 'w', 'gt(1,w)'],
      ],
      [$LT]: [
        [1, 2, 1],
        [2, 1, 0],
        ['w', 1, 'lt(w,1)'],
        [1, 'w', 'lt(1,w)'],
      ],
      [$GTE]: [
        [1, 2, 0],
        [2, 1, 1],
        [1, 1, 1],
        ['w', 1, 'gte(w,1)'],
        [1, 'w', 'gte(1,w)'],
      ],
      [$LTE]: [
        [1, 2, 1],
        [2, 1, 0],
        [1, 1, 1],
        ['w', 1, 'lte(w,1)'],
        [1, 'w', 'lte(1,w)'],
      ],
      [$EQ]: [
        [1, 2, 0],
        [2, 1, 0],
        [1, 1, 1],
        ['w', 1, 'eq(w,1)'],
        [1, 'w', 'eq(1,w)'],
      ],
      [$NE]: [
        [1, 2, 1],
        [2, 1, 1],
        [1, 1, 0],
        ['w', 1, 'ne(w,1)'],
        [1, 'w', 'ne(1,w)'],
      ],
    }
    Object.entries(expected).forEach(([operationId, values]) => {
      values.forEach(([a, b, c]) => {
        test(`${operationId}(${a}, ${b}) === ${c}`, () => {
          const evaluation = Eval(operationId, [a, b])
          const value = evaluation.toValue()
          assert.strictEqual(value, c)
          // if (isNumber(value)) assert.strictEqual(value, evaluation.evaluate())

        })
      })
    })
  })

  test('nested', () => {
    const one = Eval($NUMBER, 1)
    const zero = Eval($NUMBER, 0)
    const w = Eval($VARIABLE, 'w')
    const h = Eval($VARIABLE, 'h')
    const two = Eval($NUMBER, 2)

    let numberOperation = Eval($ADD, [one, 2])
    assert.strictEqual(numberOperation.toValue(), 3)
    // assert.strictEqual(3, numberOperation.evaluate())
    

    numberOperation = Eval($ADD, [two, numberOperation])
    assert.strictEqual(numberOperation.toValue(), 5)
    // assert.strictEqual(5, numberOperation.evaluate())

    numberOperation = Eval($MULTIPLY, [two, numberOperation])
    assert.strictEqual(numberOperation.toValue(), 10)
    // assert.strictEqual(10, numberOperation.evaluate())


    let stringOperation = Eval($ADD, [zero, w])
    assert.strictEqual(stringOperation.toValue(), 'w')

    stringOperation = Eval($ADD, [stringOperation, h])
    assert.strictEqual(stringOperation.toValue(), '(w+h)')

    let complexOparation = Eval($MULTIPLY, [numberOperation, stringOperation])
    assert.strictEqual(complexOparation.toValue(), '(10*(w+h))')

  })
})

describe('EvaluationVariables', () => {
  test('are incorporated into calculations', () => {
    EvaluationVariables.w = 1.5
    assert.strictEqual(Number(additionOperation), 7)
    delete EvaluationVariables.w
    assert.strictEqual(Number(additionOperation), NaN)
  })
})