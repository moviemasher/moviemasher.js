import {
  JsonValue,
  UnknownObject,
  Value,
  Size,
  ValueObject,
  ScalarConverter} from "../declarations"
import { DataType, GraphType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { Is } from "../Utility/Is"
import { TimeRange } from "./TimeRange"
import { VisibleContext } from "../Context/VisibleContext"
import { Preloader } from "../Preloader/Preloader"

enum MathMethod {
  Abs = 'abs',
  Ceil = 'ceil',
  Floor = 'floor',
  Max = 'max',
  Min = 'min',
  Round = 'round',
}

const EvaluatorMathMethods = Object.values(MathMethod)

const EvaluatorMathObjects = {
  [MathMethod.Ceil]: Math.ceil,
  [MathMethod.Floor]: Math.floor,
  [MathMethod.Max]: Math.max,
  [MathMethod.Min]: Math.min,
  [MathMethod.Round]: Math.round,
  [MathMethod.Abs]: Math.abs,
}

const EvaluatorMethodKeys = [
  "if", "gt", "gte", "lt", "lte", "eq",
]

const EvaluatorRegExp = (key: string): RegExp => {
  return new RegExp(`\\b${key}\\b`, 'g')
}

const EvaluatorArray = (elements : JsonValue) : Value[] => {
  if (typeof elements === "string") return String(elements).split(',')

  return <Value[]> elements
}

const EvaluatorConditional = (conditional : UnknownObject) : string => {
  const { condition } = conditional

  // not strict equality, since we may have strings and numbers
  if (Is.defined(conditional.is)) return `${condition}==${conditional.is}`

  const elements = conditional.in
  if (Is.undefined(elements)) return String(condition)

  // support supplying values as array or comma-delimited string
  const array = EvaluatorArray(<JsonValue> elements)

  const strings = Is.string(array[0])
  const values = array.map(element => (strings ? `"${element}"` : element))
  const type = strings ? 'String' : 'Number'
  const expression = `([${values.join(',')}].includes(${type}(${condition})))`
  return expression
}

interface EvaluatorExpanding {
  code: Value
  args: UnknownObject
}

interface EvaluatorArgs {
  preloader?: Preloader
  timeRange: TimeRange
  outputSize: Size
  context?: VisibleContext
  mergeContext?: VisibleContext
  graphType?: GraphType
}



class Evaluator {
  [index: string] : unknown

  constructor(args: EvaluatorArgs) {
    if (args.graphType) this.graphType = args.graphType
    this.timeRange = args.timeRange
    this.context = args.context
    this.mergeContext = args.mergeContext
    this.outputSize = args.outputSize
    this.preloader = args.preloader

    this.set('out_height_scaled', 'if(gt(out_width, out_height), scale * out_height, out_height + ((scale - 1.0) * out_width))')
    this.set('out_width_scaled', 'if(gt(out_height, out_width), scale * out_width, out_width + ((scale - 1.0) * out_height))')
    this.set('out_height', this.outputSize.height)
    this.set('out_width', this.outputSize.width)
    this.setVariable('out_size', `${this.outputSize.width}x${this.outputSize.height}`)
    this.set('out_duration', this.timeRange.lengthSeconds)
    this.set('out_rate', this.timeRange.fps)
    if (this.graphType === GraphType.Canvas) this.set('t', this.timeRange.position)
  }

  _if(boolean: boolean, trueValue: Value, falseValue: Value): Value {
    return boolean ? trueValue : falseValue
  }

  _gt(this: Value, that: Value): boolean {
    return Number(this) > Number(that)
  }
  _gte(this: Value, that: Value): boolean {
    return Number(this) >= Number(that)
  }
  _eq(this: Value, that: Value): boolean {
    return Number(this) === Number(that)
  }
  _lt(this: Value, that: Value): boolean {
    return Number(this) < Number(that)
  }

  _lte(this: Value, that: Value): boolean {
    return Number(this) <= Number(that)
  }


  conditionalValue(conditionals : ValueObject[]) : Value {
    // console.log(this.constructor.name, "conditionalValue", conditionals)

    const trueConditional = conditionals.find(conditional => {
      const exp = EvaluatorConditional(conditional)
      const expression = exp.replaceAll(' or ', ' || ').replaceAll(' and ', ' && ')
      const result = this.evaluateExpression(expression)
      // console.log(this.constructor.name, "conditionalValue", expression, "=", result)
      return result
    })
    if (typeof trueConditional === "undefined") throw Errors.eval.conditionTruth

    const { value } = trueConditional
    if (typeof value === "undefined") throw Errors.eval.conditionValue

    // console.log(this.constructor.name, "conditionalValue", value.constructor.name, value)
    return value
  }

  context? : VisibleContext

  evaluate(value : Value | ValueObject[]) : Value {
    // console.log(this.constructor.name, "evaluate", value)
    if (typeof value === "number") return value

    const expression = (typeof value === "string") ? String(value) : this.conditionalValue(value)
    if (typeof expression === "number") return expression

    const result = this.evaluateExpression(expression)
    // console.log(this.constructor.name, "evaluate", expression, "=", result)
    return result
  }

  private evaluateExpression(expression: string): Value {
    // console.log(this.constructor.name, "evaluateExpression", expression)
    const { args, code } = this.expandExpression(expression)
    if (typeof code === 'number') return code

    return this.evaluateCode(code, args)
  }

  private evaluateCode(code: string, args: UnknownObject): string {
    const keys: string[] = []
    const values: unknown[] = []
    Object.entries(args).forEach(([key, value]) => {
      keys.push(key)
      values.push(value)
    })

    const expression = `return ${code}`
    try {
      // eslint-disable-next-line no-new-func
      const method = new Function(...keys, expression)
      const result = method(...values)
      // console.log(this.constructor.name, "evaluateExpression", expression, result)
      return result
    } catch (exception) {
      const msg = String(exception).split("\n")[0]
      // console.log(this.constructor.name, 'evaluateExpression!', msg, "\n", expression, "\n", this.values)

      const underKeys = keys.filter(key => key.startsWith('_'))
      let string = code
      underKeys.forEach(key => {
        string = string.replaceAll(EvaluatorRegExp(key), key.slice(1))
      })
      return string
    }
  }

  private expandVariables(object: EvaluatorExpanding): void {
    const changedKeys: string[] = []
    for (const entry of this.variables.entries()) {
      const [key, value] = entry
      if (key === object.code) {
        object.code = value
        return
      }
      const regExp = EvaluatorRegExp(key)
      if (regExp.test(String(object.code))) {
        changedKeys.push(key)
        object.args[key] = value
      }
    }
    // if (changedKeys.length) console.log(this.constructor.name, "expandVariables", changedKeys.join(', '))
  }

  private expandValues(expression: string): EvaluatorExpanding {
    let finding = true
    let code = expression.trim()
    const changedKeys: string[] = []
    while (finding) {
      finding = false
      for (const entry of this.values.entries()) {
        const [key, value] = entry
        if (key === code) {
          finding = true
          changedKeys.push(key)
          code = String(value)
        } else {
          const regExp = EvaluatorRegExp(key)
          if (regExp.test(code)) {
            finding = true
            changedKeys.push(key)
            code = code.replaceAll(regExp, String(value))
          }
        }
      }
    }
    // if (changedKeys.length) console.log(this.constructor.name, "expandValues", changedKeys.join(', '), "\n", expression, "\n", code)

    return { args: {}, code }
  }

  private expandMethods(object: EvaluatorExpanding): void {
    const changedKeys: string[] = []
    const expression = object.code
    EvaluatorMethodKeys.forEach(key => {
      const regExp = EvaluatorRegExp(key)
      if (regExp.test(String(object.code))) {
        changedKeys.push(key)
        const underKey = `_${key}`
        object.args[underKey] = (this[underKey] as (...args: any[]) => any).bind(this)
        object.code = String(object.code).replaceAll(regExp, underKey)
      }
    })
    // if (changedKeys.length) console.log(this.constructor.name, "expandMethods", changedKeys.join(', '), "\n", expression, "\n", object.code)
  }

  private expandMath(object: EvaluatorExpanding): void {
    const changedKeys: string[] = []
    EvaluatorMathMethods.forEach(key => {
      const regExp = EvaluatorRegExp(key)
      if (regExp.test(String(object.code))) {
        changedKeys.push(key)
        object.args[key] = EvaluatorMathObjects[key]
      }
    })
    // if (changedKeys.length) console.log(this.constructor.name, "expandMath", changedKeys.join(', '))
  }

  private expandFunctions(object: EvaluatorExpanding): void {
    const changedKeys: string[] = []
    for (const key of this.functions.keys()) {
      const regExp = EvaluatorRegExp(key)
      if (regExp.test(String(object.code))) {
        changedKeys.push(key)
        object.args[key] = this.functions.get(key)
      }
    }
    // if (changedKeys.length) console.log(this.constructor.name, "expandFunctions", changedKeys.join(', '))
  }


  private expandExpression(expression: string): EvaluatorExpanding {
    // console.debug(this.constructor.name, "expandExpression", "\n", expression)
    const object: EvaluatorExpanding = this.expandValues(expression)
    if (typeof object.code === 'number') return object

    this.expandVariables(object)
    if (typeof object.code === 'number') return object

    this.expandMath(object)
    this.expandFunctions(object)
    this.expandMethods(object)
    return object
  }

  graphType = GraphType.Canvas

  has(key : string) : boolean { return this.keys.includes(key) }

  private get methodKeys(): string[] {
    const keys = [
      ...this.functions.keys(),
      ...EvaluatorMethodKeys,
      ...EvaluatorMathMethods.map(String)]
    return [...new Set(keys)]
  }

  private get keys(): string[] {
    return [...this.values.keys(), ...this.methodKeys]
  }

  private values = new Map<string, Value>()

  private functions = new Map<string, ScalarConverter>()

  private variables = new Map<string, Value>()

  mergeContext? : VisibleContext

  outputSize : Size

  preloader?: Preloader

  set(key: string, value: Value, dataType = DataType.Number): void {
    switch (dataType) {
      case DataType.Mode:
      case DataType.Rgb:
      case DataType.Rgba:
      case DataType.Font:
      case DataType.String: {
        this.setVariable(key, value)
        break
      }
      case DataType.Number:
      case DataType.Direction4:
      case DataType.Direction8: {
        this.values.set(key, value)
        break
      }
    }
  }

  setFunction(key: string, value: ScalarConverter): void { this.functions.set(key, value) }

  setVariable(key: string, value: Value): void {
    // console.log(this.constructor.name, "setVariable", key, value)
    this.variables.set(key, value)
  }

  timeRange : TimeRange
}

export { Evaluator, EvaluatorArgs }
