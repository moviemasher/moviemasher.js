import {
  JsonValue,
  UnknownObject,
  Value,
  Size,
  ValueObject,
} from "../declarations"
import { AVType, DataType, GraphType } from "../Setup/Enums"
import { Errors } from "../Setup/Errors"
import { isDefined, isNan, isNumeric, isString, isUndefined } from "../Utility/Is"
import { TimeRange } from "./Time/Time"
import { VisibleContext } from "../Context/VisibleContext"
import { Preloader } from "../Preloader/Preloader"
import { Filter } from "../Media/Filter/Filter"
import { Modular } from "../Mixin/Modular/Modular"
import { Parameter } from "../Setup/Parameter"
import { ContextFactory } from "../Context/ContextFactory"
import { Property } from "../Setup/Property"
import { Evaluation } from "./Evaluation"
import { dataTypeIsString } from "./DataType"

const EvaluatorArray = (elements : JsonValue) : Value[] => {
  if (typeof elements === "string") return String(elements).split(',')

  return <Value[]> elements
}

const EvaluatorConditional = (conditional : UnknownObject) : string => {
  const { condition } = conditional

  if (isDefined(conditional.is)) return `${condition}==${conditional.is}`

  const elements = conditional.in
  if (isUndefined(elements)) return String(condition).trim()

  // support supplying values as array or comma-delimited string
  const array = EvaluatorArray(<JsonValue> elements)
  const strings = isString(array[0])
  const escaped = array.map(element => (strings ? `"${element}"` : element))
  const type = strings ? 'string' : 'number'
  const expression = `(includes(${type}(${condition}),${escaped.join(',')}))`
  return expression
}

interface EvaluatorArgs {
  preloading: boolean
  modular?: Modular
  preloader: Preloader
  timeRange?: TimeRange
  outputSize: Size
  context?: VisibleContext
  graphType: GraphType
  avType: AVType
  filter?: Filter
}

const EvaluatorExpessions = {
  out_height_scaled: 'if(gt(out_width, out_height), scale * out_height, out_height + ((scale - 1.0) * out_width))',
  out_width_scaled: 'if(gt(out_height, out_width), scale * out_width, out_width + ((scale - 1.0) * out_height))',
}

class Evaluator {
  constructor(args: EvaluatorArgs) {
    const { timeRange, graphType, avType, modular, preloading, filter, context } = args
    if (context) this._visibleContext = context
    if (preloading) this.preloading = preloading
    this.graphType = graphType
    this.avType = avType
    this.outputSize = args.outputSize
    this.preloader = args.preloader

    Object.entries(EvaluatorExpessions).forEach(([k, v]) => { this.setExpression(k, v) })

    const { height, width } = this.outputSize
    this.setExpression('out_size', `${width}x${height}`)

    if (timeRange) this.timeRange = timeRange
    if (modular) this.modular = modular
    if (filter) this.filter = filter
  }

  avType = AVType.Both

  private evaluateBooleanValue(value: Value): boolean {
    switch (typeof value) {
      case 'boolean': return value
      case 'number': return !!value
      case 'string': {
        switch (value) {
          case 'true': return true
          case 'false':
          case '': return false
        }
      }
    }
    return false
  }

  private evaluateConditionals(evaluation: Evaluation, conditionals: ValueObject[], debug?: boolean): Value {
    const trueConditional = conditionals.find(conditional => {
      const expression = EvaluatorConditional(conditional)
      if (isNumeric(expression)) {
        console.log("evaluateConditionals isNumeric", expression, Number(expression))
        return !!Number(expression)
      }

      switch (expression) {
        case 'true': return true
        case 'false':
        case '': return false
      }

      const childEvaluation = new Evaluation(expression, evaluation)

      this.evaluateEvaluation(childEvaluation, debug)

      const { result } = childEvaluation
      if (debug) this.logDebug(childEvaluation)

      return this.evaluateBooleanValue(result)

    })
    if (typeof trueConditional === "undefined") throw Errors.eval.conditionTruth
    if (typeof trueConditional.value === "undefined") throw Errors.eval.conditionValue

    return trueConditional.value
  }

  private evaluateEvaluation(evaluation: Evaluation, debug?: boolean): void {
    this.expandEvaluation(evaluation, debug)
    evaluation.execute()
  }

  private expandParameter(evaluation: Evaluation, parameter: Parameter, debug?: boolean): boolean {
    let expanded = false

    const { name } = parameter
    evaluation.replaceAll(name, evaluation => {
      expanded = true
      return this.parameterConditionalValue(evaluation, parameter, debug)
    }, 'expandParameter')

    if (expanded) {
      this.expandEvaluationProperties(evaluation)
    }
    return expanded
  }

  private expandEvaluation(evaluation: Evaluation, debug?: boolean): void {
    this.exampleEvaluationParameters(evaluation, debug)
    this.expandEvaluationExpressions(evaluation)
    this.expandEvaluationNumbers(evaluation)
    this.populateEvaluationArgs(evaluation)
    this.expandEvaluationMethods(evaluation)
  }

  private expandEvaluationExpressions(evaluation: Evaluation): void {
    if (evaluation.resolved) return

    for (const entry of this.expressions.entries()) {
      const [key, value] = entry
      evaluation.replaceAll(key, () => value, 'expandEvaluationExpressions')
    }
  }

  private expandEvaluationMethods(evaluation: Evaluation): void {
    if (evaluation.resolved) return

    evaluation.replaceMethods()
  }

  private expandEvaluationNumbers(evaluation: Evaluation): void {
    if (evaluation.resolved) return

    for (const property of this.properties) {
      const { name, type } = property

      if (!dataTypeIsString(type)) {
        if (evaluation.replaceAll(name, () => this.modular.value(name) as Value, 'expandEvaluationNumbers.properties')) break
      }
    }
    for (const entry of this.numbers.entries()) {
      const [key, value] = entry
      if (evaluation.replaceAll(key, () => value, 'expandEvaluationNumbers.numbers')) break
    }
  }

  private exampleEvaluationParameters(evaluation: Evaluation, debug?: boolean): void {
    if (evaluation.resolved) return

    const expanded: string[] = []
    for (const parameter of this.parameterInstances) {
      const { name } = parameter
      const notRoot = evaluation.rootExpression !== name

      const expand = notRoot && !expanded.includes(name)
      // if (!expand) console.log(this.constructor.name, "exampleEvaluationParameters NOT EXPANDING", name, notRoot)
      if (expand && this.expandParameter(evaluation, parameter, debug)) {
        expanded.push(name)
      }
    }
  }

  private expandEvaluationProperties(evaluation: Evaluation): void {
    for (const property of this.properties) {
      const { name } = property
      evaluation.replaceAll(name, () => {
        const value = this.modular.value(name) as Value
        // console.log(this.constructor.name, "expandEvaluationProperties", name, value)
        return value
      }, 'expandEvaluationProperties')
    }
  }

  private expressions = new Map<string, string>()

  private _filter?: Filter
  get filter(): Filter { return this._filter! }
  set filter(value: Filter) {
    if (!value) return

    this._filter = value
    this.parameterInstances = this.filter.parametersDefined
    this.numbersInitialize()
  }

  get(key: string): Value {
    if (this.numbers.has(key)) return this.numbers.get(key)!
    if (this.strings.has(key)) return this.strings.get(key)!
    return ''
  }

  graphType = GraphType.Canvas

  preloading = false

  private logDebug(evaluation: Evaluation) {
    console.debug(this.filter.definitionId, `\n${evaluation.logs.join("\n")}`)
  }

  get createVisibleContext(): VisibleContext {
    const size = this._visibleContext ? this.visibleContext.size : this.outputSize

    return ContextFactory.toSize(size)
  }

  private _modular?: Modular
  get modular(): Modular { return this._modular! }
  set modular(value: Modular) {
    this._modular = value
    this.properties = this.modular.definition.propertiesCustom
  }

  private numbers = new Map<string, number>()

  private numbersInitialize() {
    this.numbers.clear()
    const { height, width } = this.outputSize
    const { lengthSeconds, fps } = this.timeRange
    this.setNumber('out_height', height)
    this.setNumber('out_width', width)
    this.setNumber('out_duration', lengthSeconds)
    this.setNumber('out_rate', fps)
    if (this.graphType === GraphType.Canvas) this.setNumber('t', this.position)
  }

  private outputSize: Size

  private parameterInstance(key: string): Parameter | undefined {
    return this.parameterInstances.find(parameter => parameter.name === key)
  }

  parameterNumber(key: string, debug?: boolean): number {
    const value = this.parameter(key, debug)
    const number = Number(value)
    if (isNan(number)) throw Errors.eval.number + `${key} ≠ ${value}`

    return number
  }

  parameter(key: string, debug?: boolean): Value {
    const parameter = this.parameterInstance(key)
    if (!parameter) throw Errors.eval.string + key

    const evaluation = new Evaluation(key)
    this.expandParameter(evaluation, parameter, debug)
    this.evaluateEvaluation(evaluation, debug)
    if (debug) this.logDebug(evaluation)
    return evaluation.result
  }

  parameterValue(key: string, debug?: boolean): Value {
    const parameter = this.parameterInstance(key)
    if (!parameter) throw Errors.eval.string + key

    const evaluation = new Evaluation(key)
    this.expandParameter(evaluation, parameter, debug)
    if (debug) this.logDebug(evaluation)
    return evaluation.result
  }

  get parameters(): ValueObject {
    const evaluated: ValueObject = {}
    this.parameterInstances.forEach(parameter => {
      const { name } = parameter
      evaluated[name] = this.parameter(name)
    })
    return evaluated
  }

  get parameterValues(): ValueObject {
    const evaluated: ValueObject = {}
    this.parameterInstances.forEach(parameter => {
      const { name } = parameter
      evaluated[name] = this.parameterValue(name)
    })
    return evaluated
  }

  private parameterConditionalValue(evaluation: Evaluation, parameter: Parameter, debug?: boolean): Value {
    let value = parameter.value
    if (Array.isArray(value)) {
      value = this.evaluateConditionals(evaluation, value, debug)
    }
    if (isNumeric(value)) return Number(value)

    if (!value) return value // empty string

    const { values } = parameter
    const found = values?.find(test => test === value)
    if (found) return found // one of a set of supported vales

    return value
  }

  private parameterInstances: Parameter[] = []

  private populateEvaluationArgs(evaluation: Evaluation): void {
    if (evaluation.resolved) return

    const { args } = evaluation
    const expanded: string[] = []
    for (const property of this.properties) {
      const { name } = property
      evaluation.replaceAll(name, () => {
        expanded.push(name)
        const underKey = `_${name}`
        args[underKey] = this.modular.value(property.name) as Value
        return underKey
      }, 'populateEvaluationArgs.properties')
    }
    for (const entry of this.strings.entries()) {
      const [key, value] = entry
      evaluation.replaceAll(key, () => {
        expanded.push(key)
        const underKey = `_${key}`
        args[underKey] = String(value)
        return underKey
      }, 'populateEvaluationArgs.strings')
    }
  }

  private get position(): number { return this.timeRange.position }

  preloader: Preloader

  private properties: Property[] = []

  propertyValue(key: string): Value {
    const selectionValue = this.modular.value(key)
    switch (typeof selectionValue) {
      case 'boolean': return selectionValue ? 1 : 0
      case 'number':
      case 'string': return selectionValue
    }
    throw Errors.invalid.property + key
  }

  set(key: string, value: Value, dataType = DataType.Number): void {
    if (dataTypeIsString(dataType)) this.setExpression(key, String(value))
    else this.setNumber(key, Number(value))
  }

  setInputDimensions(prefix = 'in'): void {
    const { preloading, graphType } = this
    if (preloading || graphType !== GraphType.Canvas) return

    const key_w = `${prefix}_w`
    const key_h = `${prefix}_h`
    const { width, height } = this.visibleContext.size
    this.setNumber(key_w, width)
    this.setNumber(key_h, height)
  }

  setOutputDimensions(prefix = 'out'): void {
    const { outputSize } = this
    const { width, height } = outputSize
    this.setNumber(`${prefix}_w`, width)
    this.setNumber(`${prefix}_h`, height)
  }

  setExpression(key: string, expression: string): void {
    // console.log(this.constructor.name, "setExpression", key, expression)
    this.expressions.set(key, expression)
  }

  setNumber(key: string, number: number): void {
    this.numbers.set(key, number)
  }

  setString(key: string, string: string): void {
    this.strings.set(key, string)
  }

  strings = new Map<string, string>()

  private _timeRange?: TimeRange
  get timeRange(): TimeRange { return this._timeRange! }
  set timeRange(value: TimeRange) { this._timeRange = value }

  private _visibleContext?: VisibleContext
  get visibleContext(): VisibleContext {
    if (this._visibleContext) return this._visibleContext

    // console.trace(this.modular.definitionId, this.filter.definitionId, this.constructor.name, "get context", this.outputSize)

    return this._visibleContext = this.createVisibleContext
  }
  set visibleContext(value: VisibleContext) {
    // console.log(this.constructor.name, this.modular.definitionId, this.filter.definitionId, "set context", value.size)
    this._visibleContext = value
  }

  get visibleContextUpdated(): Boolean { return !!this._visibleContext }

}

export { Evaluator, EvaluatorArgs }
