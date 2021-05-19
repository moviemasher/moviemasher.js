import { Errors } from "../Setup"
import { Is } from "../Utilities/Is"
import { TimeRange } from "../Utilities/TimeRange"


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

const THIS = "evaluator"

function Evaluator(timeRange, context, dimensions) { 
  if (!Is.instanceOf(timeRange, TimeRange)) throw Errors.argument + timeRange
  if (!Is.object(timeRange)) throw Errors.argument + context
  if (!Is.object(dimensions)) throw Errors.argument + dimensions

  this.timeRange = timeRange
  this.context = context
  this.dimensions = dimensions 
  this.map = new Map
}

const conditionalExpression = (conditional) => {
  const condition = conditional.condition

  // not strict equality, since we may have strings and numbers
  if (Is.defined(conditional.is)) return `${condition}==${conditional.is}`
  
  const elements = conditional.in
  if (Is.undefined(elements)) return condition

  // support supplying values as array or comma-delimited string
  const array = Is.string(elements) ? elements.split(',') : elements
  const strings =Is.string(array[0])
  const values = array.map(element => strings ? `"${element}"` : element)
  const type = strings ? 'String' : 'Number'
  const expression = `([${values.join(',')}].includes(${type}(${condition})))`
  return expression
}

const replaceOperators = (string) => { 
  return string.replaceAll(' or ', ' || ').replaceAll(' and ', ' && ')
}

Object.defineProperties(Evaluator.prototype, {
  canvas: { get: function() { return this.context.canvas } },

  ceil: { value: Math.ceil },

  replaceKeys: {
    value: function(expression) { 
      if (!Is.string(expression)) return expression

      const expressions = Object.fromEntries(this.keys.map(key => ([
        key, new RegExp(`\\b${key}\\b`, 'g')
      ])))
      Object.entries(expressions).forEach(([key, reg_exp]) => {
        expression = expression.replaceAll(reg_exp, `${THIS}.get("${key}")`) 
      })
      return expression
    }
  },

  conditionalValue: { 
    value: function(conditionals) {
      if (!Is.array(conditionals)) return conditionals

      let test_bool = false
      for (let conditional of conditionals) {
        const expression = replaceOperators(conditionalExpression(conditional))

        test_bool = this.evaluateExpression(expression)
        if (test_bool) return conditional.value
      }
      throw Errors.internal + 'no conditions were true'
    }
  },

  evaluate: {
    value: function(expressionOrConditions) {
      const expression = this.conditionalValue(expressionOrConditions)
      return this.evaluateExpression(expression)
    }
  },

  evaluateExpression: {
    value: function(expression) {
      const script = `return ${this.replaceKeys(expression)}`
      // console.log("evaluateScope", script)
      try {
        const method = new Function(THIS, script)
        return method(this) 
      } catch (exception) {
        // console.warn(`Evaluation failed`, script, this, exception)
        return expression
      }
    }
  },

  floor: { value: Math.floor },

  get: { value: function(key) { 
    if (this.map.has(key)) return this.map.get(key)
    const value = this[key]
    if (KEYS_GETTERS.includes(key)) return value

    if (Is.method(value)) return value.bind(this)

    console.log("Evaluator.get", key, value)
    return value
  } },
  
  keys: { 
    get: function() { return [...new Set([...this.map.keys(), ...KEYS])] } 
  },

  mm_cmp: { value: function(a, b, x, y) { return ((a > b) ? x : y) } },
  
  mm_dimensions: { 
    get: function() { return `${this.mm_width}x${this.mm_height}` } 
  },

  mm_duration: { get: function() { return this.timeRange.lengthSeconds } },

  mm_fps: { get: function() { return this.timeRange.fps } },

  mm_height: { get: function() { return this.dimensions.height } },

  mm_horz: { 
    value: function(size, proud) { return this.sized(0, size, proud) } 
  },

  mm_max: { value: Math.max },

  mm_min: { value: Math.min },

  mm_t: { get: function() { return this.timeRange.position } },

  mm_vert: { 
    value: function(size, proud) { return this.sized(1, size, proud) } 
  },

  mm_width: { get: function() { return this.dimensions.width } },

  set: { value: function(key, value) { this.map.set(key, value) } },

  sized: { value: function(vertical, size, proud) {
    const scale = Is.float(size) ? size : parseFloat(size)
    const value = parseFloat(this[KEYS_SIZED[vertical]])
    const scaled = value * scale
    if (! proud) return scaled

    const other = parseFloat(this[KEYS_SIZED[Math.abs(vertical - 1)]])
    if (other <= value) return scaled
    
    return value + (scale - 1.0) * other
  }},

  t: { get: function() { return this.mm_duration } },
})

export { Evaluator }
