import { byLabel } from "../Utilities/Sort"
import { ModuleType, ModuleTypes } from "./Types"
import { Errors } from "./Errors"

import fontDefaultJson from "./modules/font/default.json"
import effectBlurJson from "./modules/effect/blur.json"
import effectChromaKeyJson from "./modules/effect/chromakey.json"
import effectEmbossJson from "./modules/effect/emboss.json"
import effectGrayscaleJson from "./modules/effect/grayscale.json"
import effectSepiaJson from "./modules/effect/sepia.json"
import effectSharpenJson from "./modules/effect/sharpen.json"
import effectTextJson from "./modules/effect/text.json"
import mergerBlendJson from "./modules/merger/blend.json"
import mergerCenterJson from "./modules/merger/center.json"
import mergerConstrainedJson from "./modules/merger/constrained.json"
import mergerDefaultJson from "./modules/merger/default.json"
import mergerOverlayJson from "./modules/merger/overlay.json"
import scalerDefaultJson from "./modules/scaler/default.json"
import scalerPanJson from "./modules/scaler/pan.json"
import scalerScaleJson from "./modules/scaler/scale.json"
import themeColorJson from "./modules/theme/color.json"
import themeTextJson from "./modules/theme/text.json"

// interface Defaults {
//   font: Object
//   merger: Object
//   scaler: Object
//   effect?: Object
// }

// TODO: rewrite as properties applied to class
class Module {
  // defaults: Defaults
  constructor() {
    this.defaults = {
      font: fontDefaultJson,
      merger: mergerDefaultJson,
      scaler: scalerDefaultJson,
    }
    this[ModuleType.theme] = [
      themeColorJson,
      themeTextJson,
    ]
    this[ModuleType.effect] = [
      effectBlurJson,
      effectChromaKeyJson,
      effectEmbossJson,
      effectGrayscaleJson,
      effectSepiaJson,
      effectSharpenJson,
      effectTextJson
    ]
    this[ModuleType.font] = [this.defaults.font]
    this[ModuleType.merger] = [
      mergerBlendJson,
      mergerCenterJson,
      mergerConstrainedJson,
      mergerOverlayJson,
      this.defaults.merger,
    ]
    this[ModuleType.scaler] = [
      scalerPanJson,
      scalerScaleJson,
      this.defaults.scaler,
    ]
    ModuleTypes.forEach(type => this[type] ||= [])
  }

  addModulesOfType(objects, type) {
    if (! ModuleTypes.includes(type)) {
      console.warn(Errors.deprecation.addModulesOfType + type)
      return
    }
    const array = this[type]
    let changed = false
    objects.forEach(object => {
      const { id } = object
      const is_default = id === 'com.moviemasher.' + type + '.default'
      const existing = this[type].find(object => object.id === id)
      if (existing) array.splice(array.indexOf(existing), 1)
      array.push(object)
      if (is_default) this.defaults[type] = object
      changed = true
    })
    if (changed) array.sort(byLabel)
    return changed
  }

  fontById(id) { return this.ofType(id, ModuleType.font) }

  scalerById(id) { return this.ofType(id, ModuleType.scaler) }

  mergerById(id) { return this.ofType(id, ModuleType.merger) }


  effectById(id) { return this.ofType(id, ModuleType.effect) }


  themeById(id) { return this.ofType(id, ModuleType.theme) }

  defaultOfType(type) { return { ...this.defaults[type], type } }

  objectWithDefaultId(type) {
    const module = this.defaultOfType(type)
    if (module) return { id: module.id, type }
  }

  ofType(id, type) {
    if (! ModuleTypes.includes(type)) {
      console.warn("Module.ofType unsupported type", type)
      return
    }
    if (!this[type]) console.log(this.constructor.name, "ofType", type)
    const module = this[type].find(object => object.id === id)
    if (module) return { ...module, type }
  }
}

const ModuleInstance = new Module
export { ModuleInstance as Module }
