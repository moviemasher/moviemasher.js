import { CEIL, COMMA, DASH, ERROR, FLOOR, ROUND, arrayFromOneOrMore, errorThrow, isFunction, isNumber, isNumeric } from '../runtime.js'
import { Numbers, Value, Values } from '../types.js'
import { assertNumber, assertTrue } from './guards.js'



export type Operative = Operation | Value 
export interface Operatives extends Array<Operative> {}
export interface OperativePoint {
  x: Operative
  y: Operative
}
export interface OperativeSize {
  width: Operative
  height: Operative
}


type MathProperty = string & keyof Math
type MathMethod = MathProperty & Method
type SingleMethod = string & typeof SINGLE_METHODS
type DoubleMethod = string & typeof DOUBLE_METHODS

export type If = string & typeof IFS

type Method = string & typeof METHODS
type Conditional = string & typeof CONDITIONALS
type Arithmetic = string & typeof ARITHMETICS
export type OperationId = string | typeof OPERATIONS


export const $IF = 'if' as const
export const $IFNOT = 'ifnot' as const

export const $MIN = 'min' as const
export const $MAX = 'max' as const

export const $GTE = 'gte' as const
export const $LT = 'lt' as const
export const $LTE = 'lte' as const
export const $GT = 'gt' as const
export const $EQ = 'eq' as const
export const $NE = 'ne' as const
export const $DIVIDE = '/' as const
export const $MULTIPLY = '*' as const
export const $ADD = '+' as const
export const $SUBTRACT = '-' as const


export const IFS = [$IF, $IFNOT] as const
const isIf = (value: any): value is If => IFS.includes(value)

export const SINGLE_METHODS = [FLOOR, ROUND, CEIL] as const
const isSingleMethod = (value: any): value is SingleMethod=> (
  SINGLE_METHODS.includes(value)
)

export const DOUBLE_METHODS = [$MIN, $MAX] as const
const isDoubleMethod = (value: any): value is DoubleMethod => (
  DOUBLE_METHODS.includes(value)
)

export const METHODS = [...SINGLE_METHODS, ...DOUBLE_METHODS] as const

const isMathMethod = (value: any): value is MathProperty => (
  METHODS.includes(value)
)

function assertMathMethod(value: any, name?: string): asserts value is MathProperty {
  if (!isMathMethod(value)) errorThrow(value, 'MathMethod', name)
}


type MathSingle = (_: number) => number 
type MathDouble = (_: number, __: number) => number

const isSingleMath = (key: MathProperty, value: any): value is MathSingle => (
  isSingleMethod(key) && isFunction(value)
)

const isDoubleMath = (key: MathProperty, value: any): value is MathDouble => (
  isDoubleMethod(key) && isFunction(value)
)

function assertSingleMath(key: MathProperty, value: any, name?: string): asserts value is MathSingle {
  if (!isSingleMath(key, value)) errorThrow(value, 'SingleMath', name)
}


export const CONDITIONALS = [$GT, $GTE, $LT, $LTE, $EQ, $NE] as const
const isConditional = (value: any): value is Conditional => (
  CONDITIONALS.includes(value)
)
export const ARITHMETICS = [$DIVIDE, $MULTIPLY, $ADD, $SUBTRACT] as const
const isArithmetic = (value: any): value is Arithmetic => (
  ARITHMETICS.includes(value)
)

export const OPERATIONS = [...ARITHMETICS, ...CONDITIONALS, ...METHODS, ...IFS] as const
const isOperationId = (value: any): value is OperationId => (
  OPERATIONS.includes(value)
)
function assertOperationId(value: any, name?: string): asserts value is OperationId {
  if (!isOperationId(value)) errorThrow(value, 'OperationId', name)
}

const isOperation = (value: any): value is Operation => value instanceof Operation


const trueValue = (value: Value): boolean => {
  switch(value) {
    case '':
    case '0':
    case '(0)':
    case '()':
    case 0: {
      // console.log('trueValue false', value)
      return false
    }
  }
  const ok = Boolean(value)
  // if (!ok) console.trace('trueValue', ok, value)
  return ok
}

const logValue = (value: Value, message: string): Value => {
  // console.log(message, value)
  return value
}

const negativeValue = (value: Value): Value => {
  if (isNumeric(value)) return logValue(-Number(value), 'negativeValue with numeric value')

  const negated = value.startsWith(DASH) ? value.slice(1) : [DASH, value].join('')

  return logValue(negated, 'negativeValue with string value')
}

const stringOperation = (operation: string, ...values: Values): Value => {
  const string = values.join(operation)
  return logValue(string, 'stringOperation')
}

const addValues = (arithmetic: Arithmetic, values: Values): Value => {
  const [firstValue, secondValue] = values
  const [firstTrue, secondTrue] = values.map(trueValue)

  // adding false and false is zero
  if (!(firstTrue || secondTrue)) return logValue(0, 'addValues with false values')

  // adding false to something is just something
  if (!firstTrue) return logValue(secondValue, 'addValues with false first value')

  // adding something to false is just something
  if (!secondTrue) return logValue(firstValue, 'addValues with false second value')
  
  return stringOperation(arithmetic, ...values)
}

const subtractValues = (arithmetic: Arithmetic, values: Values): Value => {
  const [firstValue, secondValue] = values
  const [firstTrue, secondTrue] = values.map(trueValue)

  // subtracting false from false is zero
  if (!(firstTrue || secondTrue)) return logValue(0, 'subtractValues with false values')

  // subtracting false from something is just something
  if (!secondTrue) return logValue(firstValue, 'subtractValues with false second value')

  // but subtracting something from false is negative something
  if (!firstTrue) return logValue(negativeValue(secondValue), 'subtractValues with false first value')

  return stringOperation(arithmetic, ...values)
}

const divideValues = (arithmetic: Arithmetic, values: Values): Value => {
  const [firstValue, secondValue] = values
  const [firstTrue, secondTrue] = values.map(trueValue)

  // dividing by false (zero) is a big no no
  assertTrue(secondTrue, String(secondValue))
  
  // dividing false by something is zero
  if (!firstTrue) return logValue(0, 'divideValues with false first value')

  // diving something by one is something
  if (secondValue == 1) return logValue(firstValue, 'divideValues with second value one')

  // dividing something by negative one is just negating something
  if (secondValue == -1) return logValue(negativeValue(firstValue), 'divideValues with second value negative one')

  return stringOperation(arithmetic, ...values)
}

const multiplyValues = (arithmetic: Arithmetic, values: Values): Value => {
  const [firstValue, secondValue] = values
  const [firstTrue, secondTrue] = values.map(trueValue)

  // multiplying by false (zero) is just zero
  if (!(firstTrue && secondTrue)) return logValue(0, 'multiplyValues with false values')

  // multiplying something by one is just something
  if (secondValue == 1) return logValue(firstValue, 'multiplyValues with second value one')
  if (firstValue == 1) return logValue(secondValue, 'multiplyValues with first value one')

  // multiplying something by negative one is just negating something
  if (secondValue == -1) return logValue(negativeValue(firstValue), 'multiplyValues with second value negative one')
  if (firstValue == -1) return logValue(negativeValue(secondValue), 'multiplyValues with first value negative one')
  
  return stringOperation(arithmetic, ...values)
}


const removedParens = (value: Value): string => {
  if (isNumeric(value)) return ''

  if (!value) return ''

  if (!(value.startsWith('(') && value.endsWith(')'))) return ''

  const withoutParens = value.slice(1, -1)
  const trimmed = withoutParens.split('')
  let count = 0
  const allClosed = trimmed.every(char => {
    switch(char) {
      case '(': count++; break
      case ')': {
        if (!count) return false 
        count--
      }
    }
    return true
  })
  return allClosed ? withoutParens : '' 
}


const parens = (value: Value, force?: boolean): Value => {
  if (isNumeric(value)) return logValue(Number(value), 'parens numeric')

  // if (!(force || value)) return logValue(0, 'parens not force or value')
  
  if (removedParens(value)) return logValue(value, 'parens removedParens')

  return `(${value})`
}

export class Operation {
  constructor(operative: Operative | Operatives, public operationId?: OperationId, public name?: string) {
    this.operatives = arrayFromOneOrMore(operative)
  }
  
  get description(): string { return '' }

  private evaluateArithmetic(values: Numbers): number {
    const { operation: arithmetic } = this
    const [firstValue, secondValue] = values
    switch (arithmetic) {
      case $ADD: return firstValue + secondValue
      case $SUBTRACT: return firstValue - secondValue
      case $MULTIPLY: return firstValue * secondValue
      case $DIVIDE: return firstValue / secondValue
    }
    return this.throwIdError()
  }

  private evaluateConditional(values: Numbers): number {
    return this.evaluateConditionTrue(values) ? 1 : 0
  }

  private evaluateConditionTrue(values: Numbers) {
    const [firstValue, secondValue] = values
    switch (this.operation) {
      case $GT: return firstValue > secondValue
      case $GTE: return firstValue >= secondValue
      case $LT: return firstValue < secondValue
      case $LTE: return firstValue <= secondValue
      case $EQ: return firstValue === secondValue
      case $NE: return firstValue !== secondValue
    }
    return false
  }

  private evaluateIf(values: Numbers): number {
    const { operation: condition } = this
    const [firstValue, secondValue, thirdValue = 0] = values
    const boolean = Boolean(firstValue) === (condition === $IF)
    return boolean ? secondValue : thirdValue
  }

  private evaluateMath(values: Numbers): Value {
    const { operation } = this
    assertMathMethod(operation)

    const method = Math[operation]
    if (isDoubleMath(operation, method)) return method(values[0], values[1])
    assertSingleMath(operation, method)

    return method(values[0])
  }

  private get number(): number { 
    const { operative } = this
    if (isOperation(operative)) return operative.number

    return Number(operative) 
  }
  
  private get numberOrString(): Value {
    const { number } = this
    return isNumber(number) ? number : this.string
  }

  
  private operate = (values: Numbers): Value => {
    const { operation: operationId } = this
    if (isMathMethod(operationId)) return this.evaluateMath(values)
    if (isConditional(operationId)) return this.evaluateConditional(values)
    if (isArithmetic(operationId)) return this.evaluateArithmetic(values)
    if (isIf(operationId)) return this.evaluateIf(values)
    return this.throwIdError()
  }

  private get operative(): Operative {
    const { operatives } = this
    if (operatives.length !== 1) errorThrow(ERROR.Evaluation, 'operative')

    return operatives[0]
  }

  private get operation(): OperationId {
    const { operationId } = this
    assertOperationId(operationId)

    return operationId
  }

  private get operativeValues(): Values { 
    return this.operatives.map(operative => (
      isOperation(operative) ? operative.value : operative
    )) 
  }

  private operatives: Operatives = []

  private get string(): string { return String(this.operative) }

  private stringArithmetic = (arithmetic: Arithmetic, values: Values): Value => {
    switch (arithmetic) {
      case $ADD: return addValues(arithmetic, values)
      case $SUBTRACT: return subtractValues(arithmetic, values)
      case $DIVIDE: return divideValues(arithmetic, values)
      case $MULTIPLY: return multiplyValues(arithmetic, values)
    }
    return this.throwIdError()
  }

  private stringFunction = (values: Values): Value => {
    const { operation } = this
    const string = [operation, parens(values.join(COMMA), true)].join('')
    return string
  }
  
  private stringIf(values: Values): Value {
    const { operation: condition } = this
    const [firstValue, secondValue, thirdValue = 0] = values
  
    if (isNumeric(firstValue)) {
      const number = Number(firstValue)
      const boolean = Boolean(number) === (condition === $IF)
  
      return boolean ? secondValue : thirdValue
    }
    return this.stringFunction(values)
  }

  private stringValue(operativeValues: Values): Value {
    const { operation } = this
    assertOperationId(operation)

    if (isMathMethod(operation)) return this.stringFunction(operativeValues)
    if (isConditional(operation)) return this.stringFunction(operativeValues)
    if (isArithmetic(operation)) return this.stringArithmetic(operation, operativeValues)
    if (isIf(operation)) return this.stringIf(operativeValues)
    return this.throwIdError()
  }

  private throwIdError = () => {
    return errorThrow(ERROR.Evaluation, String(this.operationId || 'id'))
  }

  get value(): Value { 
    const { operationId } = this
    if (!operationId) return this.numberOrString

    const { operativeValues } = this
    if (operativeValues.every(isNumber)) return this.operate(operativeValues)

    return this.stringValue(operativeValues)
  }
}

export const operate = (operation: OperationId, value: Operative | Operatives, name?: string): Operation => {
  return new Operation(value, operation, name)
}

