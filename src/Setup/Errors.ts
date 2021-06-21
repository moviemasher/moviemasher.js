const $invalid = "Invalid"
const $unknown = "Unknown"
const $expected = "Expected"
const $invalidArgument = `${$invalid} argument`
const $invalidProperty = `${$invalid} property`
const $invalidDefinitionProperty = `${$invalid} definition property`
const $deprecated = "deprecated in 4.1"
const $internal = "Internal Error "
const Errors = {
  eval: {
    sourceRect: `${$invalid} evaluation of source rect `,
    outputSize: `${$invalid} evaluation of output size `,
    conditionTruth: `${$expected} at least one condition to evaluate to true `,
    conditionValue: `${$expected} condition to have a value `,
    number: `${$expected} evaluated value to be a number `,
    get: `${$expected} to get evaluated value `,
  },
  composition: { mashUndefined: `${$internal}composition.mash undefined` },
  audibleContext: `${$expected} AudioContext`,
  mash: `${$expected} mash`,
  action: `${$expected} Action`,
  actions: `${$expected} Actions`,
  internal: $internal,
  argument: `${$invalidArgument} `,
  invalid: {
    definition: {
      duration: `${$invalidDefinitionProperty} duration`,
      audio: `${$invalidDefinitionProperty} audio|url`,
      url: `${$invalidDefinitionProperty} url`,
      source: `${$invalidDefinitionProperty} source`,
      id: `${$invalidDefinitionProperty} id`,
    },
    track: `${$invalid} track `,
    trackType: `${$invalidProperty} trackType `,
    action: `${$invalid} action `,
    name: `${$invalidProperty} name `,
    value: `${$invalidProperty} value `,
    type: `${$invalidProperty} type `,
    url: `${$invalidProperty} url `,
    property: $invalidProperty,
    argument: $invalidArgument,
    object: `${$invalidArgument} object `,
    factory: `${$invalid} factory `,
    volume: `${$invalidArgument} volume`,
  },
  type: `${$unknown} type `,
  selection: `${$invalid} selection `,
  unknown: {
    type: `${$unknown} type `,
    merger: `${$unknown} merger `,
    effect: `${$unknown} effect `,
    filter: `${$unknown} filter `,
    font: `${$unknown} font `,
    scaler: `${$unknown} scalar `,
    mode: `${$unknown} mode `,
    definition: `${$unknown} definition `,
  },
  uncached: "Uncached URL ",
  object: `${$invalidArgument} object `,
  array: `${$invalidArgument} array `,
  media: `${$invalidArgument} media `,
  id: `${$invalidArgument} id `,
  frame: `${$invalidArgument} frame `,
  frames: `${$invalidProperty} frames `,
  fps: `${$invalidArgument} fps `,
  seconds: `${$invalidArgument} seconds `,
  url: `${$invalidArgument} url `,
  time: `${$invalidArgument} Time`,
  timeRange: `${$invalidArgument} TimeRange`,
  mainTrackOverlap: `${$internal}: main track clips overlap without transition`,
  unknownMash: `${$unknown} Mash property `,
  unimplemented: `${$expected} method to be overridden`,
  property: `${$invalidArgument} property `,
  deprecation: {
    property_types: `property_types ${$deprecated} - please get MovieMasher.Property.types instead`,
    addModulesOfType: `addModulesOfType ${$deprecated} for unsupported type `,
    configure: {
      get: `configure ${$deprecated} - please get MovieMasher.defaults instead`,
      set: `configure ${$deprecated} - please supply mash.quantize and media.duration instead`,
    },
    canvas_context: {
      get: `canvas_context ${$deprecated} - please get visibleContext instead`,
      set: `canvas_context ${$deprecated} - please set visibleContext instead`,
    }
  },
  wrongClass: `${$expected} instance of `,
}

export { Errors }
