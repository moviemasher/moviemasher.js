import { Is } from "../Is"

const invalid = "Invalid"
const unknown = "Unknown"
const expected = "Expected"
const invalid_argument = `${invalid} argument`
const invalid_property = `${invalid} property`
const deprecated = "deprecated in 4.1"
const internal = "Internal Error "
const Errors = {
  throwUnlessInstance: (object, klass) => {
    if (!Is.instance(object, klass)) throw Errors.wrongClass + klass.name
  },
  mash: `${expected} mash`,
  action: `${expected} Action`,
  actions: `${expected} Actions`,
  internal,
  argument: `${invalid_argument} `,
  type: `${invalid} type `,
  selection: `${invalid} selection `,
  unknown: {
    type: `${unknown} type `,
    merger: `${unknown} merger `,
    effect: `${unknown} effect `,
    filter: `${unknown} filter `,
    font: `${unknown} font `,
    scaler: `${unknown} scalar `,
  },
  uncached: "Uncached URL ",
  object: `${invalid_argument} object `,
  array: `${invalid_argument} array `,
  media: `${invalid_argument} media `,
  id: `${invalid_argument} id `,
  frame: `${invalid_argument} frame `,
  frames: `${invalid_property} frames `,
  fps: `${invalid_argument} fps `,
  seconds: `${invalid_argument} seconds `,
  url: `${invalid_argument} url `,
  time: `${invalid_argument} Time`,
  timeRange: `${invalid_argument} TimeRange`,
  mainTrackOverlap: `${internal}: main track clips overlap without transition`,
  unknownMash: `${unknown} Mash property `,
  property: `${invalid_argument} property `,
  deprecation: {
    property_types: `property_types ${deprecated} - please get MovieMasher.Property.types instead`,
    addModulesOfType: `addModulesOfType ${deprecated} for unsupported type `,
    configure: {
      get: `configure ${deprecated} - please get MovieMasher.defaults instead`,
      set: `configure ${deprecated} - please supply mash.quantize and media.duration instead`,
    },
    canvas_context: {
      get: `canvas_context ${deprecated} - please get videoContext instead`,
      set: `canvas_context ${deprecated} - please set videoContext instead`,
    }
  },
  wrongClass: `${expected} instance of class `,
}
export { Errors }