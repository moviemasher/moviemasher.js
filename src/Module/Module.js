import { Sort } from "../Sort"
import { Utilities } from "../Utilities"
import fontDefaultJson from "./json/font/default.json"
import effectBlurJson from "./json/effect/blur.json"
import effectChromaKeyJson from "./json/effect/chromakey.json"
import effectEmbossJson from "./json/effect/emboss.json"
import effectGrayscaleJson from "./json/effect/grayscale.json"
import effectSepiaJson from "./json/effect/sepia.json"
import effectSharpenJson from "./json/effect/sharpen.json"
import effectTextJson from "./json/effect/text.json"
import mergerBlendJson from "./json/merger/blend.json"
import mergerCenterJson from "./json/merger/center.json"
import mergerConstrainedJson from "./json/merger/constrained.json"
import mergerDefaultJson from "./json/merger/default.json"
import mergerOverlayJson from "./json/merger/overlay.json"
import scalerDefaultJson from "./json/scaler/default.json"
import scalerPanJson from "./json/scaler/pan.json"
import scalerScaleJson from "./json/scaler/scale.json"
import themeColorJson from "./json/theme/color.json"
import themeTextJson from "./json/theme/text.json"
import { ModuleType, ModuleTypes } from "../Types"
import { Errors } from "../Errors"


class Module {
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
    this[[ModuleType.merger]] = [
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
      if (existing) Utilities.deleteFromArray(array, existing)
      array.push(object)
      if (is_default) this.defaults[type] = object 
      changed = true
    })
    if (changed) array.sort(Sort.byLabel)
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
    const module = this[type].find(object => object.id === id)
    if (module) return { ...module, type }
  }
}

const ModuleInstance = new Module
export { ModuleInstance as Module }
