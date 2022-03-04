import {
  JsonValue,
  UnknownObject,
  Value,
  Size,
  ValueObject
} from "../declarations"
import { AVType, DataType, GraphType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { isDefined, isNumber, isNumeric, isString, isUndefined } from "../Utility/Is"
import { TimeRange } from "./TimeRange"
import { VisibleContext } from "../Context/VisibleContext"
import { Preloader } from "../Preloader/Preloader"
import { colorRgbaToHex, colorRgbToHex } from "../Utility/Color"
import { Filter } from "../Media/Filter/Filter"
import { Modular } from "../Mixin/Modular/Modular"
import { Parameter } from "../Setup/Parameter"

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
  if (isDefined(conditional.is)) return `${condition}==${conditional.is}`

  const elements = conditional.in
  if (isUndefined(elements)) return String(condition)

  // support supplying values as array or comma-delimited string
  const array = EvaluatorArray(<JsonValue> elements)

  const strings = isString(array[0])
  const escaped = array.map(element => (strings ? `"${element}"` : element))
  const type = strings ? 'String' : 'Number'
  const expression = `([${escaped.join(',')}].includes(${type}(${condition})))`
  return expression
}

interface EvaluatorExpanding {
  code: Value
  args: UnknownObject
}

interface EvaluatorArgs {
  modular: Modular
  preloader: Preloader
  timeRange: TimeRange
  outputSize: Size
  context?: VisibleContext
  mergeContext?: VisibleContext
  graphType: GraphType
  avType: AVType
  filter: Filter
}

interface EvaluatorMethod {
  (...args: any[]): any
}

interface EvaluatorMethodObject {
  [index:string]: EvaluatorMethod
}

interface EvaluatorDebug {
  method: string
  expanded?: string[]
  input: Value | ValueObject[]
  output?: Value
}

const EvaluatorMethods: EvaluatorMethodObject = {
  if: (tf: boolean, tv: Value, fv: Value): Value => tf ? tv : fv,
  gt: (a: Value, b: Value): boolean => Number(a) > Number(b),
  gte: (a: Value, b: Value): boolean => Number(a) >= Number(b),
  eq: (a: Value, b: Value): boolean => Number(a) === Number(b),
  lt: (a: Value, b: Value): boolean => Number(a) < Number(b),
  lte: (a: Value, b: Value): boolean => Number(a) <= Number(b),
  rgb: (r: Value, g: Value, b: Value): string => colorRgbToHex({ r, g, b }),
  rgba: (r: Value, g: Value, b: Value, a: Value): string => colorRgbaToHex({ r, g, b, a }),
  ceil: Math.ceil,
  floor: Math.floor,
  max: Math.max,
  min: Math.min,
  round: Math.round,
  abs: Math.abs,
}

const EvaluatorMethodKeys = Object.keys(EvaluatorMethods)


class Evaluator {
  constructor(args: EvaluatorArgs) {
    const { graphType, avType, modular } = args
    this.modular = modular
    this.graphType = graphType
    this.avType = avType
    this.timeRange = args.timeRange
    this.context = args.context
    this.mergeContext = args.mergeContext
    this.outputSize = args.outputSize
    this.preloader = args.preloader
    this.filter = args.filter
    this.set('out_height_scaled', 'if(gt(out_width, out_height), scale * out_height, out_height + ((scale - 1.0) * out_width))')
    this.set('out_width_scaled', 'if(gt(out_height, out_width), scale * out_width, out_width + ((scale - 1.0) * out_height))')
    this.set('out_height', this.outputSize.height)
    this.set('out_width', this.outputSize.width)
    this.setVariable('out_size', `${this.outputSize.width}x${this.outputSize.height}`)
    this.set('out_duration', this.timeRange.lengthSeconds)
    this.set('out_rate', this.timeRange.fps)
    if (this.graphType === GraphType.Canvas) this.set('t', this.position)
  }

  avType = AVType.Both

  private evaluateIfConditional(conditionals: Value | ValueObject[]): Value {
    if (!Array.isArray(conditionals)) return conditionals

    // console.log(this.constructor.name, "conditionalValue", conditionals)

    const trueConditional = conditionals.find(conditional => {
      const exp = EvaluatorConditional(conditional)
      const expression = exp.replaceAll(' or ', ' || ').replaceAll(' and ', ' && ')
      const debug: EvaluatorDebug = { input: expression, method: 'evaluateIfConditional' }
      this.debugs.push(debug)
      const result = this.evaluateExpressionUnlessNumber(expression)
      debug.output = result
      return result
    })
    if (typeof trueConditional === "undefined") throw Errors.eval.conditionTruth
    if (typeof trueConditional.value === "undefined") throw Errors.eval.conditionValue

    return trueConditional.value
  }

  context?: VisibleContext

  debugs: EvaluatorDebug[] = []

  evaluate(value: Value | ValueObject[]): Value {
    return this.evaluateExpressionUnlessNumber(this.evaluateIfConditional(value))
  }

  private evaluateExpression(expression: string): Value {
    const { args, code } = this.expandExpression(expression)
    return this.evaluateCodeUnlessNumber(code, args)
  }

  private evaluateExpressionUnlessNumber(value: Value): Value {
    return isNumeric(value) ? Number(value) : this.evaluateExpression(String(value))
  }

  private evaluateCode(code: string, args: UnknownObject): string {
    const debug: EvaluatorDebug = { input: code, method: 'evaluateCode' }
    this.debugs.push(debug)

    const keys: string[] = []
    const unknowns: unknown[] = []
    Object.entries(args).forEach(([key, value]) => {
      keys.push(key)
      unknowns.push(value)
    })

    const expression = `return ${code}`
    try {
      // eslint-disable-next-line no-new-func
      const compiledFunction = new Function(...keys, expression)
      const result = compiledFunction(...unknowns)
      debug.output = result
      return result
    } catch (exception) {
      const underKeys = keys.filter(key => key.startsWith('_'))
      let string = code
      underKeys.forEach(key => {
        string = string.replaceAll(EvaluatorRegExp(key), key.slice(1))
      })
      debug.output = string
      return string
    }
  }

  private evaluateCodeUnlessNumber(value: Value, args: UnknownObject): Value {
    return isNumeric(value) ? Number(value) : this.evaluateCode(String(value), args)
  }

  evaluateParameter(key: string): Value {
    const parameter = this.parameter(key)
    if (!parameter) return ''

    const value = this.evaluateIfConditional(parameter.value)
    if (isNumeric(value)) return Number(value)
    if (!value) return value

    const { values } = parameter
    const found = values?.find(test => test === value)
    if (found) return found

    return this.evaluate(value)
  }

  get valueObject() : ValueObject {
    const evaluated : ValueObject = {}
    const parameters = this.filter.parametersDefined

    parameters.forEach(parameter => {
      const { name } = parameter
      evaluated[name] = this.evaluateParameter(name)
    })
    return evaluated
  }

  private expandVariablesUnlessNumber(object: EvaluatorExpanding): void {
    if (isNumeric(object.code)) return

    const expanded: string[] = []
    const debug: EvaluatorDebug = { input: object.code, method: 'expandVariablesUnlessNumber', expanded }

    for (const entry of this.variables.entries()) {
      const [key, value] = entry
      if (key === object.code) {
        expanded.push(key)
        object.code = value
        break
      }
      const regExp = EvaluatorRegExp(key)
      if (regExp.test(String(object.code))) {
        expanded.push(key)
        object.args[key] = value
      }
    }
    if (expanded.length) {
      debug.output = object.code
      this.debugs.push(debug)
    }
  }

  private expandValues(expression: string): EvaluatorExpanding {
    const expanded: string[] = []
    const debug: EvaluatorDebug = { input: expression, method: 'expandValues', expanded }
    let finding = true
    let code = expression.trim()
    while (finding) {
      finding = false

      for (const entry of this.numbers.entries()) {
        const [key, value] = entry
        if (key === code) { // expression IS number
          // expanded.push(key)
          // debug.output = value
          // this.debugs.push(debug)
          return { args: {}, code: value }
        }

        // if expression CONTAINS number, just replace it
        const regExp = EvaluatorRegExp(key)
        if (regExp.test(code)) {
          code = code.replaceAll(regExp, String(value))

          finding = true
        }
      }
      if (finding) continue

      for (const entry of this.strings.entries()) {
        const [key, value] = entry
        if (key === code) {
          // expression IS reference
          expanded.push(key)
          finding = true
          code = String(value)
        } else {
          const regExp = EvaluatorRegExp(key)
          if (regExp.test(code)) {
            // expression CONTAINS reference
            expanded.push(key)
            finding = true
            code = code.replaceAll(regExp, String(value))
          }
        }
        if (finding) break
      }
    }
    if (expanded.length) {
      debug.output = code
      this.debugs.push(debug)
    }
    return { args: {}, code }
  }

  private expandMethodsUnlessNumber(object: EvaluatorExpanding): void {
    if (isNumeric(object.code)) return

    const changedKeys: string[] = []
    EvaluatorMethodKeys.forEach(key => {
      const regExp = EvaluatorRegExp(key)
      if (regExp.test(String(object.code))) {
        changedKeys.push(key)
        const underKey = `_${key}`
        object.args[underKey] = EvaluatorMethods[key]
        object.code = String(object.code).replaceAll(regExp, underKey)
      }
    })
    // if (changedKeys.length) console.log(this.constructor.name, "expandMethods", changedKeys.join(', '), "\n", expression, "\n", object.code)
  }

  private expandExpression(expression: string): EvaluatorExpanding {
    const object: EvaluatorExpanding = this.expandValues(expression)
    this.expandVariablesUnlessNumber(object)
    this.expandMethodsUnlessNumber(object)
    return object
  }

  filter: Filter

  graphType = GraphType.Canvas

  has(key : string) : boolean { return this.keys.includes(key) }

  private get keys(): string[] {
    return [...this.numbers.keys(), ...this.strings.keys(), ...EvaluatorMethodKeys]
  }


  logDebug() {
    if (!this.debugs.length) return

    const strings = this.debugs.map(debug => {
      const { input, output, expanded, method } = debug
      return `${method}: ${input} (${typeof input}) => ${output} (${typeof output}) ${expanded?.join(', ') || ''}`
    })
    // console.log(this.filter.definitionId, `\n${strings.join("\n")}`)
  }

  mergeContext?: VisibleContext

  modular: Modular

  modularValue(key: string): Value {
    const value = this.modular.value(key)
    if (typeof value === "boolean") return value ? 1 : 0

    if (typeof value === "number" || typeof value === "string") {
      return value
    }
    throw Errors.invalid.property + key
  }

  private numbers = new Map<string, number>()

  outputSize: Size

  parameter(key: string): Parameter | undefined {
    return this.filter.parametersDefined.find(parameter => parameter.name === key)
  }

  parameterValue(key: string): Value {
    const parameter = this.parameter(key)
    if (!parameter) return ''

    const { value } = parameter
    return this.evaluateIfConditional(value)
  }

  get position(): number { return this.timeRange.position }

  preloader: Preloader

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
      case DataType.Frame:
      case DataType.Direction4:
      case DataType.Direction8:
      case DataType.Number: {
        this.numbers.set(key, Number(value))
        break
      }
    }
  }

  setInputDimensions(prefix = 'in'): void {
    const { context } = this
    if (!context) return

    const { width, height } = context.size
    this.set(`${prefix}_w`, width)
    this.set(`${prefix}_h`, height)
  }

  setOutputDimensions(prefix = 'out'): void {
    const { outputSize } = this
    const { width, height } = outputSize
    this.set(`${prefix}_w`, width)
    this.set(`${prefix}_h`, height)
  }

  setVariable(key: string, value: Value): void {
    // console.log(this.constructor.name, "setVariable", key, value)
    this.variables.set(key, value)
  }

  private strings = new Map<string, string>()

  timeRange : TimeRange

  private variables = new Map<string, Value>()
}

export { Evaluator, EvaluatorArgs }
