import { UnknownRecord, Value } from "../declarations"

import { colorRgbaToHex, colorRgbToHex } from "./Color/ColorFunctions"
import { isDefined, isNumeric, isString, isValue } from "../Utility/Is"
import { errorThrow } from "./Error/ErrorFunctions"
import { ErrorName } from "./Error/ErrorName"


export interface EvaluationCallback { (evaluation: Evaluation): Value }

interface EvaluatorMethod {
  (...args: any[]): any
}

interface EvaluatorMethodObject {
  [index:string]: EvaluatorMethod
}

const EvaluatorMethods: EvaluatorMethodObject = {
  abs: Math.abs,
  ceil: Math.ceil,
  eq: (a: Value, b: Value): boolean => Number(a) === Number(b),
  floor: Math.floor,
  gt: (a: Value, b: Value): boolean => Number(a) > Number(b),
  gte: (a: Value, b: Value): boolean => Number(a) >= Number(b),
  if: (tf: boolean, tv: Value, fv: Value): Value => tf ? tv : fv,
  includes: (value: Value, ...values: Value[]): boolean => values.includes(value),
  lt: (a: Value, b: Value): boolean => Number(a) < Number(b),
  lte: (a: Value, b: Value): boolean => Number(a) <= Number(b),
  max: Math.max,
  min: Math.min,
  number: Number,
  rgb: (r: Value, g: Value, b: Value): string => colorRgbToHex({ r, g, b }),
  rgba: (r: Value, g: Value, b: Value, a: Value): string => colorRgbaToHex({ r, g, b, a }),
  round: Math.round,
  string: String,
}

const EvaluatorMethodKeys = Object.keys(EvaluatorMethods)

const EvaluatorCodeRegex = /\\b[a-z]\\b/i

const EvaluatorCleanString = (string: string): string => {
  let expression = string.replaceAll(' or ', '||').replaceAll(' and ', '&&')
  expression = expression.replaceAll(' ', '')

  return expression
}

const EvaluatorRegExp = (key: string): RegExp => {
  return new RegExp(`\\b${key}\\b`, 'g')
}
const EvaluatorMethodRegExp = (key: string): RegExp => {
  return new RegExp(`\\b${key}\\b\\(`, 'g')
}

export class Evaluation {
  constructor(expression: string, evalution?: Evaluation) {
    this.expressions.push(expression)
    this.evaluation = evalution
  }

  args: UnknownRecord = {}

  execute(message?: string): void {
    if (this.resolved) return

    const { expression, args } = this
    let cleaned = EvaluatorCleanString(expression)
    if (cleaned.match(EvaluatorCodeRegex)) errorThrow(ErrorName.Evaluation)
    

    const keys: string[] = []
    const unknowns: unknown[] = []
    Object.entries(args).forEach(([key, value]) => {
      keys.push(key)
      unknowns.push(value)
    })

    const functionBody = `return ${cleaned}`
    try {
      // eslint-disable-next-line no-new-func
      const compiledFunction = new Function(...keys, functionBody)
      const result = compiledFunction(...unknowns)
      this.expressions.push(String(result))
      if (isNumeric(result)) {
        this.resolved = true
        this._result = Number(result)
        this.log(message || 'executed')
      } else if (!isString(result)) errorThrow(ErrorName.Evaluation) 
    
    } catch (exception) {
      const underKeys = keys.filter(key => key.startsWith('_'))
      underKeys.forEach(key => {
        cleaned = cleaned.replaceAll(EvaluatorRegExp(key), key.slice(1))
      })
      this.expressions.push(cleaned)
      this.log('execute failure', String(exception))
    }
  }

  get expression(): string {
    const { expressions } = this
    const { length } = expressions
    const expression = expressions[length - 1]!
    return expression
  }

  expressions: string[] = []

  evaluation?: Evaluation

  evaluations: Evaluation[] = []

  log(message: string, key?: string): void {
    const indent = this.resolved ? '* ' : '- '
    const words = [indent]
    words.push(message)
    if (key) words.push(`${key}:`)
    const [previous, current] = this.expressions.slice(-2)
    words.push(previous, ' -> ', current)
    this._logs.push(words.join(' '))
  }

  _logs: string[] = []
  get logs(): string[] { return this.logsIndented() }

  logsIndented(depth = 0): string[] {
    const indent = ' '.repeat(depth * 2)
    return [
      `${indent}Evaluation: ${this.expressions[0]}`,
      ...this._logs.map(line => `${indent}${line}`),
      ...this.evaluations.flatMap(evaluation => evaluation.logsIndented(depth + 1))
    ]
  }

  get rootExpression(): string {
    if (this.evaluation) return this.evaluation.rootExpression

    return this.expressions[0]
  }

  replaceAll(key: string, method: EvaluationCallback, message?: string): boolean {
    if (this.resolved) return true

    const { expression } = this
    const is = expression === key
    const regExp = is ? undefined : EvaluatorRegExp(key)
    const contains = is || regExp!.test(expression)
    if (contains) {
      const value = method(this)
      const string = String(value)
      const numeric = isNumeric(value)
      if (numeric && is) {
        this.expressions.push(string)
        this.resolved = true
        this._result = Number(value)
        this.log(message || 'resolved', key)
        return true
      }
      const replaced = is ? string : expression.replaceAll(regExp!, string)
      this.expressions.push(replaced)
      this.log(message || 'evaluated', key)
    } //else console.log(this.constructor.name, "replaceAll", message, "NOT FOUND", key, expression)
    return false
  }

  replaceMethods(message?: string): void {
    if (this.resolved) return

    const { args } = this
    EvaluatorMethodKeys.forEach(key => {
      const methodRegExp = EvaluatorMethodRegExp(key)
      const { expression } = this
      if (methodRegExp.test(expression)) {
        const underKey = `_${key}`
        args[underKey] = EvaluatorMethods[key]
        const regExp = EvaluatorRegExp(key)
        this.expressions.push(expression.replaceAll(regExp, underKey))
        this.log(message || 'method', key)
      }
    })
  }

  resolved = false

  _result?: number

  get result(): Value {
    if (isValue(this._result)) return this._result
    
    return this.expression

  }
}
