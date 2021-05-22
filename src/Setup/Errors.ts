const $invalid = "Invalid"
const $unknown = "Unknown"
const $expected = "Expected"
const $invalidArgument = `${$invalid} argument`
const $invalidProperty = `${$invalid} property`
const $deprecated = "deprecated in 4.1"
const $internal = "Internal Error "
const Errors = {
  mash: `${$expected} mash`,
  action: `${$expected} Action`,
  actions: `${$expected} Actions`,
  internal: $internal,
  argument: `${$invalidArgument} `,
  invalid: {
    track: `${$invalid} track `,
    trackType: `${$invalid} track type `,
  },
  type: `${$invalid} type `,
  selection: `${$invalid} selection `,
  unknown: {
    type: `${$unknown} type `,
    merger: `${$unknown} merger `,
    effect: `${$unknown} effect `,
    filter: `${$unknown} filter `,
    font: `${$unknown} font `,
    scaler: `${$unknown} scalar `,
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
  property: `${$invalidArgument} property `,
  deprecation: {
    property_types: `property_types ${$deprecated} - please get MovieMasher.Property.types instead`,
    addModulesOfType: `addModulesOfType ${$deprecated} for unsupported type `,
    configure: {
      get: `configure ${$deprecated} - please get MovieMasher.defaults instead`,
      set: `configure ${$deprecated} - please supply mash.quantize and media.duration instead`,
    },
    canvas_context: {
      get: `canvas_context ${$deprecated} - please get videoContext instead`,
      set: `canvas_context ${$deprecated} - please set videoContext instead`,
    }
  },
  wrongClass: `${$expected} instance of `,
}

export { Errors }
