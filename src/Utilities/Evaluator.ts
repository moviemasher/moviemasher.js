import {
  EvaluatorValue,
  Scalar,
  UnknownObject,
  ScalarRaw,
  ScalarValue,
  Size,
  ValueObject
} from "../declarations"
import { Errors } from "../Setup/Errors"
import { Is } from "./Is"
import { TimeRange } from "./TimeRange"
import { VisibleContext } from "../Playing"

const KEYS_SIZED = ['mm_width', 'mm_height']

const KEYS_GETTERS = [
  "mm_dimensions",
  "mm_duration",
  "mm_fps",
  "mm_height",
  "mm_t",
  "mm_width",
  "t",
]

const KEYS = [
  "ceil",
  "floor",
  "mm_cmp",
  "mm_horz",
  "mm_max",
  "mm_min",
  "mm_vert",
  ...KEYS_GETTERS,
  ...KEYS_SIZED
]

const $evaluator = "evaluator"

const arrayFromElements = (elements : Scalar) : ScalarValue[] => {
  if (typeof elements === "string") return String(elements).split(',')

  return <ScalarValue[]> elements
}

const conditionalExpression = (conditional : UnknownObject) : string => {
  const { condition } = conditional

  // not strict equality, since we may have strings and numbers
  if (Is.defined(conditional.is)) return `${condition}==${conditional.is}`

  const elements = conditional.in
  if (Is.undefined(elements)) return String(condition)

  // support supplying values as array or comma-delimited string
  const array = arrayFromElements(<Scalar> elements)

  const strings = Is.string(array[0])
  const values = array.map(element => (strings ? `"${element}"` : element))
  const type = strings ? 'String' : 'Number'
  const expression = `([${values.join(',')}].includes(${type}(${condition})))`
  return expression
}

const replaceOperators = (string : string) : string => (
  string.replaceAll(' or ', ' || ').replaceAll(' and ', ' && ')
)

class Evaluator {
  [index: string] : unknown

  constructor(timeRange : TimeRange, size : Size, context? : VisibleContext, mergeContext? : VisibleContext) {
    this.timeRange = timeRange
    this.context = context
    this.mergeContext = mergeContext
    this.size = size
    this.setInputSize(this.size)
  }

  ceil = Math.ceil

  conditionalValue(conditionals : ValueObject[]) : ScalarValue {
    // console.log(this.constructor.name, "conditionalValue", conditionals)
    const trueConditional = conditionals.find((conditional) => {
      const expression = replaceOperators(conditionalExpression(conditional))
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

  get duration() : number { return this.timeRange.lengthSeconds }

  evaluate(value : ScalarValue | ValueObject[]) : ScalarValue {
    // console.log(this.constructor.name, "evaluate", value)
    if (typeof value === "number") return value

    const expression = (typeof value === "string") ? String(value) : this.conditionalValue(value)
    if (typeof expression === "number") return expression

    const result = this.evaluateExpression(expression)
    // console.log(this.constructor.name, "evaluate", expression, "=", result)
    return result
  }

  private evaluateExpression(expression : string) : ScalarValue {
    const script = `return ${this.replaceKeys(expression)}`
    try {
      // eslint-disable-next-line no-new-func
      const method = new Function($evaluator, script)
      const result = method(this)
      // console.log(this.constructor.name, "evaluateExpression", expression, result)
      return result
    } catch (exception) {
      //console.warn(`Evaluator.evaluateExpression`, exception, expression, this.map)
      return expression
    }
  }

  floor = Math.floor

  get(key : string) : EvaluatorValue | undefined {
    if (this.map.has(key)) {
      // console.log("Evaluator.get returning value from map", key, this.map.get(key))
      return this.map.get(key)
    }

    if (!KEYS.includes(key)) throw Errors.eval.get + key

    const value = this[key]
    if (KEYS_GETTERS.includes(key)) return <EvaluatorValue> value

    if (typeof value === "function") {
      // console.log("Evaluator.get returning method", key)
      return value.bind(this)
    }

    throw Errors.eval.get + key

    // return // unknown key
  }

  has(key : string) : boolean { return KEYS.includes(key) || this.map.has(key) }

  initialize(key : string, value : EvaluatorValue) : boolean {
    if (this.has(key)) return false

    this.set(key, value)
    return true
  }

  get inputSize() : Size {
    return {
      width: Number(this.get("mm_input_width")),
      height: Number(this.get("mm_input_height"))
    }
  }

  get keys() : string[] { return [...new Set([...this.map.keys(), ...KEYS])] }

  private map = new Map<string, EvaluatorValue>()

  mergeContext? : VisibleContext

  mm_cmp(a : number, b : number, x : number, y : number) : number {
    return ((a > b) ? x : y)
  }

  get mm_dimensions() : string { return `${this.mm_width}x${this.mm_height}` }

  get mm_duration() : number { return this.duration }

  get mm_fps() : number { return this.timeRange.fps }

  get mm_height() : number { return this.size.height }

  mm_horz(size : ScalarValue, proud : ScalarRaw) : number {
    return this.sized(0, size, proud)
  }

  mm_max = Math.max

  mm_min = Math.min

  get mm_t() : number { return this.position }

  mm_vert(size : ScalarValue, proud : ScalarRaw) : number {
    return this.sized(1, size, proud)
  }

  get mm_width() : number { return this.size.width }

  get position() : number { return this.timeRange.position }

  replaceKeys(value : string) : string {
    let expression = value
    const expressions = Object.fromEntries(this.keys.map(key => ([
      key, new RegExp(`\\b${key}\\b`, 'g')
    ])))
    Object.entries(expressions).forEach(([key, regExp]) => {
      expression = expression.replaceAll(regExp, `${$evaluator}.get("${key}")`)
    })
    return expression
  }

  set(key : string, value : EvaluatorValue) : void { this.map.set(key, value) }

  setInputSize({ width, height } : Size) : void {
    this.set("in_h", height)
    this.set("mm_input_height", height)
    this.set("in_w", width)
    this.set("mm_input_width", width)
  }

  size : Size

  sized(vertical : number, size : ScalarValue, proud : ScalarRaw) : number {
    const scale : number = Is.float(size) ? Number(size) : parseFloat(String(size))
    if (Is.nan(scale)) throw Errors.eval.number + 'scale'

    const sizedKey = KEYS_SIZED[vertical]
    const sizedValue = this.get(sizedKey)
    const value = parseFloat(String(sizedValue))
    if (Is.nan(value)) throw Errors.eval.number + `value ${sizedKey}=>${sizedValue}`

    const scaled = value * scale
    if (!proud) return scaled
    const otherSizedKey = KEYS_SIZED[Math.abs(vertical - 1)]
    const otherValue = this.get(otherSizedKey)
    if (typeof otherValue === "undefined") throw Errors.internal + 'otherValue'

    const other = parseFloat(String(otherValue))
    if (Is.nan(other)) throw Errors.eval.number + 'other'

    if (other <= value) return scaled

    return value + (scale - 1.0) * other
  }

  get t() : number { return this.mm_t }

  timeRange : TimeRange
}

export { Evaluator }
