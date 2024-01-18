
import assert from 'assert'
import { describe, test } from 'node:test'
import { $ADD, $DIVIDE, $EQ, $GT, $GTE, $IF, $IFNOT, $LT, $LTE, $MAX, $MIN, $MULTIPLY, $NE, $SUBTRACT, ARITHMETICS, Operation, operate } from '../../../packages/@moviemasher/shared-lib/src/utility/operation.js'
import { CEIL, FLOOR, ROUND } from '../../../packages/@moviemasher/shared-lib/src/runtime.js'


describe('Operation', () => {
  const number = 5.5
  const string = 'w'
  const operation = new Operation(number)
  describe('value', () => {
    test('returns string when supplied string', () => {
      assert.equal(new Operation(string).value, string)
    })
    test('returns number when supplied number', () => {
      assert.equal(operation.value, number)
    })
    test('returns operative value when supplied operative', () => {
      const parentOperation = new Operation(operation)
      assert.equal(parentOperation.value, number)
    })
  })
  describe('arithmetic', () => {
    const expected = {
      [$ADD]: [
        ['w', 1, 'w+1'],
        [0, 'w', 'w'],
        ['w', 0, 'w'],
        ['w', 'h', 'w+h'],
        [1, 2, 3],
      ],
      [$SUBTRACT]: [
        ['w', 1, 'w-1'],
        ['w', 'h', 'w-h'],
        [1, 2, -1],
        [3, 2, 1],
      ],
      [$MULTIPLY]: [
        [0, 1, 0],
        [1, 0, 0],
        [0, 'w', 0],
        ['w', 0, 0],
        ['w', 1, 'w'],
        [1, 'w', 'w'],
        ['w', 'h', 'w*h'],
        [1, 2, 2],
        [3, 2, 6],
      ],
      [$DIVIDE]: [
        ['w', 1, 'w'],
        [1, 'w','1/w'],
        ['w', 'h', 'w/h'],
        [1, 2, 0.5],
        [6, 2, 3],
      ],
    }
    Object.entries(expected).forEach(([operationId, values]) => {
      values.forEach(([a, b, c]) => {
        describe(`${a} ${operationId} ${b} === ${c}`, () => {
          assert.equal(operate(operationId, [a, b]).value, c)
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
        describe(`${operationId}(${a},${b}) === ${c}`, () => {
          assert.equal(operate(operationId, [a, b]).value, c)
        })
      })
    })
  })
  describe('math single argument', () => {
    const expected = {
      [ROUND]: [
        [1, 1],
        [0, 0],
        [0.5, 1],
        [0.51, 1],
        [0.49, 0],
        ['w', 'round(w)'],
      ],
      [CEIL]: [
        [1, 1],
        [0, 0],
        [0.5, 1],
        [0.51, 1],
        [0.49, 1],
        ['w', 'ceil(w)'],
      ],
      [FLOOR]: [
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
        describe(`${operationId}(${a}) === ${b}`, () => {
          assert.equal(operate(operationId, a).value, b)
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
        describe(`${operationId}(${array.join(',')}) === ${last}`, () => {
          assert.equal(operate(operationId, array).value, last)
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
        describe(`${operationId}(${a},${b}) === ${c}`, () => {
          assert.equal(operate(operationId, [a, b]).value, c)
        })
      })
    })
  })

  describe('complex', () => {
    const one = new Operation(1)
    const zero = new Operation(0)
    const w = new Operation('w')
    const h = new Operation('h')
    const two = new Operation(2)

    let operation = operate($ADD, [one, 2])
    assert.equal(operation.value, 3)

    operation = operate($ADD, [two, operation])
    assert.equal(operation.value, 5)

    operation = operate($MULTIPLY, [two, operation])

    assert.equal(operation.value, 10)
  })
})