import { JsonValue, UnknownObject, Value, ValueObject } from "../declarations"
import { Dimensions } from "../Setup/Dimensions"
import { Errors } from "../Setup/Errors"
import { isDefined, isNan, isNumeric, isString, isUndefined } from "../Utility/Is"
import { Time, TimeRange } from "./Time/Time"

import { Filter } from "../Filter/Filter"
import { Parameter } from "../Setup/Parameter"
import { Property } from "../Setup/Property"
import { Evaluation } from "./Evaluation"
import { propertyTypeIsString } from "./PropertyType"
import { Instance } from "../Instance/Instance"

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

const EvaluatorExpessions = {
  out_height_scaled: 'if(gt(out_width, out_height), scale * out_height, out_height + ((scale - 1.0) * out_width))',
  out_width_scaled: 'if(gt(out_height, out_width), scale * out_width, out_width + ((scale - 1.0) * out_height))',
}

export interface EvaluatorArgs {
  editing?: boolean
  instance?: Instance
  timeRange?: TimeRange
  outputDimensions: Dimensions
  filter?: Filter
  tweenTime?: Time
}

export class Evaluator {
  constructor(args: EvaluatorArgs) {
    const {
      tweenTime, timeRange, instance, editing, filter
    } = args
    this.tweenTime = tweenTime
    this.outputDimensions = args.outputDimensions
    this.editing = !!editing

    Object.entries(EvaluatorExpessions).forEach(([k, v]) => { this.setExpression(k, v) })

    const { height, width } = this.outputDimensions
    this.setExpression('out_size', `${width}x${height}`)

    if (timeRange) this.timeRange = timeRange
    if (instance) this.instance = instance
    if (filter) this.filter = filter
  }

  get customProperties(): Property[] {
    const record: Record<string, Property> = {} // instance overrides filter
    this.filterCustomProperties.forEach(property => { record[property.name] = property })
    this.instanceCustomProperties.forEach(property => { record[property.name] = property })
    return Object.values(record)
  }

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
        // console.log("evaluateConditionals isNumeric", expression, Number(expression))
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

    for (const property of this.customProperties) {
      const { name, type } = property
      if (propertyTypeIsString(type)) continue

      if (evaluation.replaceAll(name, () => {
        if (this.instanceCustomProperties.includes(property)) {
          return this.instance.value(name) as Value
        }
        return this.filter.value(name) as Value
      }, 'expandEvaluationNumbers.properties')) break

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
    for (const property of this.customProperties) {
      const { name } = property
      evaluation.replaceAll(name, () => {
        if (this.instanceCustomProperties.includes(property)) {
          return this.instance.value(name) as Value
        }
        return this.filter.value(name) as Value

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
    this.filterCustomProperties = [...this.filter.propertiesCustom]
    this.numbersInitialize()
  }

  editing: boolean

  private filterCustomProperties: Property[] = []

  // TODO: check if needed
  get(key: string): Value {
    if (this.numbers.has(key)) return this.numbers.get(key)!
    return ''
  }

  private logDebug(evaluation: Evaluation) {
    console.debug(this.filter.definitionId, `\n${evaluation.logs.join("\n")}`)
  }

  label = 'createVisibleContext'

  private _instance?: Instance
  get instance(): Instance { return this._instance! }
  set instance(value: Instance) {
    this._instance = value
    this.instanceCustomProperties = [...this.instance.propertiesCustom]
  }

  private numbers = new Map<string, number>()

  private numbersInitialize() {
    this.numbers.clear()
    const { height, width } = this.outputDimensions
    const { lengthSeconds, fps } = this.timeRange
    this.setNumber('out_height', height)
    this.setNumber('out_width', width)
    this.setNumber('out_duration', lengthSeconds)
    this.setNumber('out_rate', fps)

    if (this.editing) this.setNumber('t', this.position)
  }

  private outputDimensions: Dimensions

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
    for (const property of this.customProperties) {
      const { name } = property
      evaluation.replaceAll(name, () => {
        expanded.push(name)
        const underKey = `_${name}`
        if (this.instanceCustomProperties.includes(property)) {
          args[underKey] = this.instance.value(name) as Value
        } else args[underKey] = this.filter.value(name) as Value
        return underKey
      }, 'populateEvaluationArgs.properties')
    }
  }

  get position(): number { return this.timeRange.position }

  private instanceCustomProperties: Property[] = []


  propertyValue(key: string): Value {
    const selectionValue = this.instance.value(key)!
    switch (typeof selectionValue) {
      case 'boolean': return selectionValue ? 1 : 0
      default: return selectionValue
    }
  }

  private setExpression(key: string, expression: string): void {
    this.expressions.set(key, expression)
  }

  private setNumber(key: string, number: number): void {
    this.numbers.set(key, number)
  }

  private _timeRange?: TimeRange
  get timeRange(): TimeRange { return this._timeRange! }
  set timeRange(value: TimeRange) { this._timeRange = value }

  tweenTime?: Time
}
