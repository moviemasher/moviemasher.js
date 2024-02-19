import type { Evaluation, EvaluationObject, EvaluationValue, EvaluationValueObjects, EvaluationValues, NumberRecord, Numbers, Strings, Value, Values } from '../types.js'

import { $ADD, $CEIL, $DIVIDE, $EQ, $FLOOR, $GT, $GTE, $IF, $IFNOT, $LT, $LTE, $MAX, $MIN, $MULTIPLY, $NE, $NUMBER, $RAW, $ROUND, $SUBTRACT, $VARIABLE, COMMA, DASH, EQUALS, ERROR, QUESTION, SPACE, arrayFromOneOrMore, errorThrow, jsonParse } from '../runtime.js'
import { isArray, isFunction, isNumeric, isObject, isString } from './guard.js'
import { isNumber } from './guard.js'
import { isDefined } from './guard.js'
import { assertDefined, assertTrue, assertValue } from './guards.js'

type EvaluationId = string & typeof EVALUATION_IDS
type EvaluationType = typeof EVALUATION_TYPES[number]

type Comparison = string & typeof COMPARISONS
type Conditional = string & typeof CONDITIONALS
type Operator = string & typeof OPERATORS
type Method = string & typeof METHODS
type Raw = string & typeof RAWS

type SingleMethod = string & typeof SINGLE_METHODS
type DoubleMethod = string & typeof DOUBLE_METHODS

type MathProperty = string & keyof Math
type MathDouble = (_: number, __: number) => number
type MathSingle = (_: number) => number 

interface EvaluationInstances extends Array<EvaluationClass> {}

export const Eval = (id: string | EvaluationId, value: EvaluationValue | EvaluationValues, name?: string): Evaluation => {
  assertOperationId(id)

  return new EvaluationClass(id, value, name)  
}

export const EvaluationVariables: NumberRecord = {}



export const operation = (objectOrJson: EvaluationObject | string): Evaluation => {
  const object = isObject(objectOrJson) ? objectOrJson : jsonParse(objectOrJson)
  assertEvaluationObject(object)

  return new EvaluationClass(object)
}

export const isOperation = (value: any): value is Evaluation => (
  isObject(value) && 'toValue' in value
)

const SINGLE_METHODS = [$FLOOR, $ROUND, $CEIL] as const
const DOUBLE_METHODS = [$MIN, $MAX] as const

const COMPARISONS = [$GT, $GTE, $LT, $LTE, $EQ, $NE] as const
const CONDITIONALS = [$IF, $IFNOT] as const
const METHODS = [...SINGLE_METHODS, ...DOUBLE_METHODS] as const
const OPERATORS = [$DIVIDE, $MULTIPLY, $ADD, $SUBTRACT] as const
const RAWS = [$VARIABLE, $NUMBER] as const
const EVALUATION_IDS = [...RAWS, ...OPERATORS, ...COMPARISONS, ...METHODS, ...CONDITIONALS] as const

const $COMPARISON = 'comparison' as const
const $CONDITIONAL = 'conditional' as const
const $METHOD = 'method' as const
const $OPERATOR = 'operator' as const

const EVALUATION_TYPES = [$OPERATOR, $COMPARISON, $METHOD, $RAW, $CONDITIONAL] as const

const isOperator = (value: any): value is Operator => (
  OPERATORS.includes(value)
)

function assertOperator(value: any, name?: string): asserts value is Operator {
  if (!isOperator(value)) errorThrow(value, 'Operator', name)
}

const OPERATOR_NAMES: Record<Operator, string> = (() => {
  assertOperator($DIVIDE)
  assertOperator($MULTIPLY)
  assertOperator($ADD)
  assertOperator($SUBTRACT)
  return {
    [$DIVIDE]: 'division',
    [$MULTIPLY]: 'multiplication',
    [$ADD]: 'addition',
    [$SUBTRACT]: 'subtraction',
  } 
})()
const COMPARISON_NAMES: Record<Comparison, string> = (() => {
  return {
    [$GT]: '>',
    [$GTE]: '>=',
    [$LT]: '<',
    [$LTE]: '<=',
    [$EQ]: '==',
    [$NE]: '!=',
  }
})()


function assertEvaluationObject(value: any, name?: string): asserts value is EvaluationObject {
  if (!isEvaluationObject(value)) errorThrow(value, 'OperationObject', name)
}

const $Indent = '  '

const isRaw = (value: any): value is Raw => RAWS.includes(value)

const isConditional = (value: any): value is Conditional => CONDITIONALS.includes(value)

const isSingleMethod = (value: any): value is SingleMethod=> (
  SINGLE_METHODS.includes(value)
)

const isDoubleMethod = (value: any): value is DoubleMethod => (
  DOUBLE_METHODS.includes(value)
)

const isMethod = (value: any): value is Method => (
  METHODS.includes(value)
)

const isMathMethod = (value: any): value is MathProperty => (
  METHODS.includes(value)
)

function assertMathMethod(value: any, name?: string): asserts value is MathProperty {
  if (!isMathMethod(value)) errorThrow(value, 'MathMethod', name)
}


const isSingleMath = (key: MathProperty, value: any): value is MathSingle => (
  isSingleMethod(key) && isFunction(value)
)

const isDoubleMath = (key: MathProperty, value: any): value is MathDouble => (
  isDoubleMethod(key) && isFunction(value)
)

function assertSingleMath(key: MathProperty, value: any, name?: string): asserts value is MathSingle {
  if (!isSingleMath(key, value)) errorThrow(value, 'SingleMath', name)
}

const isComparison = (value: any): value is Comparison => (
  COMPARISONS.includes(value)
)

function assertComparison(value: any, name?: string): asserts value is Comparison {
  if (!isComparison(value)) errorThrow(value, 'Comparison', name)
}

const isEvaluationId = (value: any): value is EvaluationId => (
  EVALUATION_IDS.includes(value)
)

function assertOperationId(value: any, name?: string): asserts value is EvaluationId {
  if (!isEvaluationId(value)) errorThrow(value, 'OperationId', name)
}

const isEvaluationInstance = (value: any): value is EvaluationClass & Evaluation => value instanceof EvaluationClass

const trueValue = (value: Value): boolean => {
  switch(value) {
    case '':
    case '0':
    case '(0)':
    case '()':
    case 0: {
      return false
    }
  }
  const ok = Boolean(value)
  return ok
}

const negativeValue = (value: string): string => (
  value.startsWith(DASH) ? value.slice(1) : [DASH, value].join('')
)

const trueOrFalse = (number: number): string => { return number ? 'true' : 'false' }

const stringOperation = (operation: string, values: Strings): string => {
  return parens(values.join(operation))
}

const addValues = (operator: Operator, values: Strings): string => {
  const [firstValue, secondValue] = values
  const [firstTrue, secondTrue] = values.map(trueValue)

  // adding false and false is zero
  if (!(firstTrue || secondTrue)) return '0'

  // adding false to something is just something
  if (!firstTrue) return secondValue

  // adding something to false is just something
  if (!secondTrue) return firstValue
  
  // adding something negative is subtracting the negation of it
  if (String(secondValue).startsWith(DASH)) {
    // console.log('adding something negative is subtracting the negation of it', firstValue, secondValue)
    const added = Eval($SUBTRACT, [firstValue, negativeValue(secondValue)])
    return String(added)
  }
  return stringOperation(operator, values)
}

const subtractValues = (operator: Operator, values: Strings): string => {
  const [firstValue, secondValue] = values
  const [firstTrue, secondTrue] = values.map(trueValue)

  // subtracting false from false is zero
  if (!(firstTrue || secondTrue)) return '0'

  // subtracting false from something is just something
  if (!secondTrue) return firstValue

  // but subtracting something from false is negative something
  if (!firstTrue) return negativeValue(secondValue)

  // subtracting something negative is adding the negation of it
  if (String(secondValue).startsWith(DASH)) {
    console.log('subtracting something negative is adding the negation of it', firstValue, secondValue)
    const added = Eval($ADD, [firstValue, negativeValue(secondValue)])
    return String(added)
  }


  return stringOperation(operator, values)
}

const divideValues = (operator: Operator, values: Strings): string => {
  const [firstValue, secondValue] = values
  const [firstTrue, secondTrue] = values.map(trueValue)

  // dividing by false (zero) is a big no no
  assertTrue(secondTrue, String(secondValue))
  
  // dividing false by something is zero
  if (!firstTrue) return '0'

  // diving something by one is something
  if (secondValue == '1') return firstValue

  // dividing something by negative one is just negating something
  if (secondValue == '-1') return negativeValue(firstValue)

  return stringOperation(operator, values)
}

const multiplyValues = (operator: Operator, values: Strings): string => {
  const [firstValue, secondValue] = values
  const [firstTrue, secondTrue] = values.map(trueValue)

  // multiplying by false (zero) is just zero
  if (!(firstTrue && secondTrue)) return '0'

  // multiplying something by one is just something
  if (secondValue == '1') return firstValue
  if (firstValue == '1') return secondValue

  // multiplying something by negative one is just negating something
  if (secondValue == '-1') return negativeValue(firstValue)
  if (firstValue == '-1') return negativeValue(secondValue)
  
  return stringOperation(operator, values)
}

const hasParens = (value: Value): boolean => {
  return false
  // if (isNumeric(value)) return false

  // if (!value) return false

  // if (!(value.startsWith('(') && value.endsWith(')'))) return false

  // const withoutParens = value.slice(1, -1)
  // const trimmed = withoutParens.split('')
  // let count = 0
  // return trimmed.every(char => {
  //   switch(char) {
  //     case '(': count++; break
  //     case ')': {
  //       if (!count) return false 
  //       count--
  //     }
  //   }
  //   return true
  // })
}

const parens = (value: string, force?: boolean): string => (
  force || !hasParens(value) ? `(${value})` : value
)

const isEvaluationObject = (value: any): value is EvaluationObject => (
  isObject(value) && 'evaluations' in value && isArray(value.evaluations)
)

class EvaluationClass implements Evaluation {
  constructor(idOrObject: EvaluationId | string | EvaluationObject, operative: EvaluationValue | EvaluationValues = [], label?: string, evaluation?: EvaluationClass) {
    const isObject = isEvaluationObject(idOrObject)
    const id = isObject ? idOrObject.operationId : idOrObject
    assertOperationId(id, 'constructor')

    this.operationId = id
    this.evaluation = evaluation
    this.name = isObject ? idOrObject.name : label
    if (isObject && idOrObject.variables) this.variables = idOrObject.variables
    const objects = isObject ? idOrObject.evaluations : arrayFromOneOrMore(operative)
    const [first] = objects
    switch(id) {
      case $NUMBER: {
        this.number = Number(first)
        break
      }
      case $VARIABLE: {
        this.variable = String(first)
        break
      }
      default: {
        this.evaluations = objects.map(operative => {
          if (isEvaluationInstance(operative)) {
            operative.evaluation = this
            return operative
          }

          if (isEvaluationObject(operative)) return new EvaluationClass(operative, [], '', this)

          assertValue(operative, 'operative')
          
          if (isNumeric(operative)) return new EvaluationClass($NUMBER, Number(operative), '', this)
          const name = isString(operative) ? operative : ''
          return new EvaluationClass($VARIABLE, [operative], name, this)
        })
      }
    }
  }

  private get asComparisonNumber(): number {
    const { asComparisonBoolean } = this
    if (!isDefined(asComparisonBoolean)) return NaN

    return asComparisonBoolean ? 1 : 0
  }

  private get asComparisonBoolean(): boolean | undefined {
    const { operativeNumbers } = this
    if (!operativeNumbers.every(isNumber)) return 

    const [firstValue, secondValue] = operativeNumbers
    switch (this.operationId) {
      case $GT: return firstValue > secondValue
      case $GTE: return firstValue >= secondValue
      case $LT: return firstValue < secondValue
      case $LTE: return firstValue <= secondValue
      case $EQ: return firstValue === secondValue
      case $NE: return firstValue !== secondValue
    }
  }

  private get asConditionalNumber(): number {
    const { operationId, operativeNumbers } = this
    if (!operativeNumbers.every(isNumber)) return NaN

    const [firstValue, secondValue, thirdValue = 0] = operativeNumbers
    const boolean = Boolean(firstValue) === (operationId === $IF)
    return boolean ? secondValue : thirdValue
  }

  private asConditionalString(values?: Values): string {
    const strings = values ? values.map(String) : this.operativeStrings
    const { operationId } = this
    const [firstValue, secondValue = '1', thirdValue = '0'] = strings
  
    if (isNumeric(firstValue)) {
      const number = Number(firstValue)
      const boolean = Boolean(number) === (operationId === $IF)
  
      return boolean ? secondValue : thirdValue
    }
    return this.asMethodString(strings)
  }

  private get asMethodNumber(): number {
    const { operationId: operation, operativeNumbers } = this
    if (!operativeNumbers.every(isNumber)) return NaN

    assertMathMethod(operation)
    
    const method = Math[operation as MathProperty]
    if (isDoubleMath(operation, method)) return method(operativeNumbers[0], operativeNumbers[1])
    assertSingleMath(operation, method)

    return method(operativeNumbers[0])
  }

  private asMethodString(values?: Values): string {
    const strings = values ? values.map(String) : this.operativeStrings

    const { operationId } = this
    const string = [operationId, parens(strings.join(COMMA), true)].join('')
    return string
  }

  private get asOperatorNumber(): number {
    const { operationId: operator, operativeNumbers: values } = this
    if (!values.every(isNumber)) return NaN
    
    const [firstValue, secondValue] = values
    switch (operator) {
      case $ADD: return firstValue + secondValue
      case $SUBTRACT: return firstValue - secondValue
      case $MULTIPLY: return firstValue * secondValue
      case $DIVIDE: return firstValue / secondValue
    }
    return this.throwError()
  }

  private asOperatorString(values?: Values): string {
    const strings = values ? values.map(String) : this.operativeStrings
    const { operationId } = this
    assertOperator(operationId)
    switch (operationId) {
      case $ADD: return addValues(operationId, strings)
      case $SUBTRACT: return subtractValues(operationId, strings)
      case $DIVIDE: return divideValues(operationId, strings)
      case $MULTIPLY: return multiplyValues(operationId, strings)
    }
    return this.throwError()
  }

  private get asNumber(): number {
    const { operationType } = this
    switch (operationType) {
      case $OPERATOR: return this.asOperatorNumber
      case $COMPARISON: return this.asComparisonNumber
      case $CONDITIONAL: return this.asConditionalNumber
      case $METHOD: return this.asMethodNumber
      case $RAW: return this.asRawNumber
    }
  }

  get asObject(): EvaluationObject {
    const { operationId, name, variables } = this
    const evaluations: EvaluationValueObjects = []
    const object: EvaluationObject = { operationId, name, evaluations, variables }
    switch(operationId) {
      case $NUMBER: {
        evaluations.push(this.number)
        break
      }
      case $VARIABLE: {
        evaluations.push(this.variable)
        break
      }
      default: {
        evaluations.push(...this.evaluations.map(operation => operation.asObject))
      }
    }
    return object
  }

  private get asRawNumber(): number {
    const { operationId } = this
    // console.log('asRawNumber', operationId)
    if (operationId === $NUMBER) return this.number
    
    const { variable } = this
    if (isNumeric(variable)) return Number(variable)
    const number = this.variablesAll[this.variable]
    return isNumber(number) ? number : NaN
  }

  private get asRawString(): string { 
    
    const { operationId } = this
    return operationId === $NUMBER ? String(this.number) : this.variable
  }

  private get asString(): string {
    const { operationType } = this
    switch (operationType) {
      case $OPERATOR: return this.asOperatorString()
      case $CONDITIONAL: return this.asConditionalString()
      case $RAW: return this.asRawString
      case $COMPARISON: 
      case $METHOD: return this.asMethodString()
    }
  }

  private get asValue(): Value {
    const { operativeValues } = this
    const { operationType } = this
    switch (operationType) {
      case $OPERATOR: return this.asOperatorString(operativeValues)
      case $CONDITIONAL: return this.asConditionalString(operativeValues)
      case $RAW: return this.asRawString
      case $COMPARISON: 
      case $METHOD: return this.asMethodString(operativeValues)
    }
  }

  get description(): string { 
    const labels = this.descriptionLabels.map(description => description.trim())
    const descriptions = this.descriptions()
    const ok = labels.length === descriptions.length
    if (!ok) {
      console.log('labels and descriptions length', this.operationId, labels.length, descriptions.length)
      // return ''
    }
    // assertTrue(labels.length === descriptions.length, 'matching lengths')
    const max = descriptions.reduce((max, { length }) => Math.max(max, length), 0)
    const padded = descriptions.map(label => label.padEnd(max, SPACE))
    const strings = padded.map((label, index) => [label, '//', labels[index]].join(SPACE))
    return strings.join('\n')
  }

  private get descriptionLabel(): string {
    const { name, operationId, operationType } = this
    const strings: Strings = []
    if (isOperator(operationId)) strings.push(OPERATOR_NAMES[operationId]) 
    else strings.push(operationId)
    
    if (operationType === $RAW) {
      if (operationId === $VARIABLE) {
        strings.push(this.variable)
        const number = this.variablesAll[this.variable]
        if (isNumber(number)) strings.unshift(EQUALS, String(number))

      }
    }
    else strings.push(operationType)
    if (name) strings.push(['[', name, ']'].join(''))
    return strings.join(SPACE)
  }

  private get descriptionLabelEnd(): string {
    const strings: Strings = [EQUALS]
    const number = Number(this)
    const is = isNumber(number)
    if (is) {
      const { operationType } = this
      const isComparison = operationType === $COMPARISON
      strings.push(isComparison ? trueOrFalse(number) : String(number))
    } else strings.push(QUESTION)
    strings.push(this.descriptionLabel)
    return strings.join(SPACE)
  }

  private get descriptionLabels(): Strings {
    const strings: Strings = []
    const { descriptionLabel, operationType } = this
    strings.push(descriptionLabel)
    switch(operationType) {
      case $RAW: return strings
      case $CONDITIONAL: {
        strings.push(...this.descriptionLabelsIf)
        break
      }
      case $METHOD: {
        strings.push(...this.descriptionLabelsMethod)
        break
      }
      case $COMPARISON: {
        strings.push(...this.descriptionLabelsComparison)
        break
      }
      case $OPERATOR: {
        strings.push(...this.descriptionLabelsOperator)
        break
      }
    }
    strings.push(this.descriptionLabelEnd)
    return strings
  }

  private get descriptionLabelsOperator(): Strings {
    const strings: Strings = []
    const { evaluations } = this
    const [first, second] = evaluations
    assertDefined(second)

    strings.push(...first.descriptionLabels)
    strings.push(SPACE)
    strings.push(...second.descriptionLabels)
    return strings
  }

  private get descriptionLabelsComparison(): Strings {
    const strings: Strings = []
    const { evaluations, operationId } = this
    const [first, second] = evaluations
    assertDefined(second)
    assertComparison(operationId)
    strings.push(...first.descriptionLabels)
    strings.push(COMPARISON_NAMES[operationId])
    strings.push(...second.descriptionLabels)
    return strings
  }

  private get descriptionLabelsIf(): Strings {
    const strings: Strings = []
    const { evaluations: operations } = this
    const [first, second, third] = operations
    strings.push(...first.descriptionLabels)
    strings.push('then')
    if (isDefined(second)) strings.push( ...second.descriptionLabels)
    else strings.push(SPACE)
    strings.push('else')
    if (isDefined(third)) strings.push(...third.descriptionLabels)
    else strings.push(SPACE)
    return strings
  }
  
  private get descriptionLabelsMethod(): Strings {
    const strings: Strings = []
    const { evaluations } = this
    const [first, second] = evaluations
    strings.push(...first.descriptionLabels)
    if (second) {
      assertDefined(second)
      strings.push(SPACE)
      strings.push( ...second.descriptionLabels)
    }
    return strings

  }

  private descriptionsOperator(depth: number): Strings {
    const indent = $Indent.repeat(depth)
    const strings: Strings = []
    const { evaluations, operationId } = this
    const [first, second] = evaluations
    assertDefined(first)
    assertDefined(second)

    strings.push(...first.descriptions(depth + 1))
    strings.push([indent, operationId].join($Indent))
    strings.push(...second.descriptions(depth + 1))
    return strings
  }

  private descriptionsComparison(depth: number): Strings {
    const indent = $Indent.repeat(depth)
    const strings: Strings = []
    const { evaluations, operationId } = this
    const [first, second] = evaluations
    assertDefined(first)
    assertDefined(second)

    strings.push(...first.descriptions(depth + 1))
    strings.push([indent, COMMA].join($Indent))
    strings.push(...second.descriptions(depth + 1))
    return strings
  }

  private descriptionsConditional(depth: number): Strings {
    const indent = $Indent.repeat(depth)
    const strings: Strings = []
    const { evaluations: operations } = this
    const [first, second, third] = operations
    assertDefined(first)

    strings.push(...first.descriptions(depth + 1))
    strings.push([indent, COMMA].join($Indent))
    if (isDefined(second)) strings.push( ...second.descriptions(depth + 1))
    else strings.push([indent, String(1)].join(''))
    strings.push([indent, COMMA].join($Indent))
    if (isDefined(third)) strings.push(...third.descriptions(depth + 1))
    else strings.push([indent, String(0)].join(''))
    return strings
  }
  
  private descriptionsMethod(depth: number): Strings {
    const indent = $Indent.repeat(depth)
    const strings: Strings = []
    const { evaluations: operations, operationId } = this
    const [first, second] = operations
    strings.push(...first.descriptions(depth + 1))
    if (second) {
      strings.push([indent, COMMA].join($Indent))
      strings.push( ...second.descriptions(depth + 1))
    }
    return strings

  }

  private descriptions(depth: number = 0): Strings { 
    const indent = $Indent.repeat(depth)
    const { operationType, operationId } = this
    const startBits: Strings = [indent]
    const strings: Strings = []
    const endBits: Strings = []
    
    if (operationType === $RAW) {
      if (operationId === $NUMBER) startBits.push(String(this.number))
      else startBits.push(this.variable)
    } else {
      if (operationType !== $OPERATOR) startBits.push(operationId)
      startBits.push('(')
      endBits.push(indent, ')')
      switch(operationType) {
        case $COMPARISON: {
          strings.push(...this.descriptionsComparison(depth))
          break
        }
        case $CONDITIONAL: {
          strings.push(...this.descriptionsConditional(depth))
          break
        }
        case $OPERATOR: {
          strings.push(...this.descriptionsOperator(depth))
          break
        }
        default: {
          strings.push(...this.descriptionsMethod(depth))
        }
      }
      // startBits.push('(')
      // endBits.push(indent, ')')
      // const [first, second, third] = evaluations
      // strings.push(...first.descriptions(depth + 1))

      // const iAmOperator = isOperator(operationId)
      // const iAmIf = isConditional(operationId)

      // if (second || iAmIf) {
      //   if (iAmOperator) strings.push([indent, operationId].join($Indent))
      //   else strings.push([indent, COMMA].join($Indent))

      //   if (second) strings.push(...second.descriptions(depth + 1))
      //   else strings.push([indent, 1].join($Indent))

      //   if (third || iAmIf) {
      //     strings.push([indent, COMMA].join($Indent))
      //     if (third) strings.push(...third.descriptions(depth + 1))
      //     else strings.push([indent, 0].join($Indent))
      //   }
      // }
    }
    const descriptionStrings = [startBits.join(''), ...strings]
    if (endBits.length) descriptionStrings.push(endBits.join(''))
    return descriptionStrings
  }

  private throwError = (detail?: string) => {
    return errorThrow(ERROR.Evaluation, detail || this.operationId)
  }

  private evaluation?: EvaluationClass

  private evaluations: EvaluationInstances = []

  private name?: string

  private number = 0

  private operationId: EvaluationId

  private get operationType(): EvaluationType {
    const { operationId } = this
    if (isRaw(operationId)) return $RAW
    if (isMathMethod(operationId)) return $METHOD
    if (isComparison(operationId)) return $COMPARISON
    if (isOperator(operationId)) return $OPERATOR
    if (isConditional(operationId)) return $CONDITIONAL
    
    return this.throwError('operationType')
  }

  private get operativeNumbers(): Numbers { 
    return this.evaluations.map(operative => Number(operative))
  }

  private get operativeStrings(): Strings { return this.evaluations.map(String)}

  private get operativeValues(): Values { return this.evaluations.map(operation => operation.toValue())}

  toJSON(): EvaluationObject { return this.asObject }

  toNumber(): number { return this.asNumber }

  toObject(): EvaluationObject { return this.asObject }

  toString(): string { return this.asString }

  toValue(): Value { 
    const { asNumber: number } = this
    if (isNumber(number)) return number

    return this.asValue
  }

  valueOf(): number { return this.asNumber }

  private variable = ''

  variables = {}

  private get variablesAll(): NumberRecord {
    const { evaluation, variables } = this
    if (!evaluation) return { ...variables, ...EvaluationVariables }

    const all = { ...variables, ...evaluation.variablesAll }
    return all
  } 
}

