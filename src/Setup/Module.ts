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
import { Is } from "../Utilities/Is"

interface ModuleInterface {

  label: string
  id: string
  type: string
  source? : string
}

interface ModuleDefaults {
  [index: string]: ModuleInterface
  font: ModuleInterface
  merger: ModuleInterface
  scaler: ModuleInterface
}

interface ModuleArray extends Array<ModuleInterface> {}

interface Modules {
  [index: string]: ModuleArray
  effect: ModuleArray
  font: ModuleArray
  merger: ModuleArray
  scaler: ModuleArray
  theme: ModuleArray
  transition: ModuleArray
}

class ModuleClass {
  defaults: ModuleDefaults

  modules: Modules

  constructor() {
    this.defaults = {
      font: fontDefaultJson,
      merger: mergerDefaultJson,
      scaler: scalerDefaultJson,
    }
    this.modules = {
      effect: [],
      font: [],
      merger: [],
      scaler: [],
      theme: [],
      transition: [],
    }
    this.addModulesOfType([themeColorJson, themeTextJson], ModuleType.theme)

    this.addModulesOfType([
      effectSharpenJson,
      effectBlurJson,
      effectChromaKeyJson,
      effectEmbossJson,
      effectGrayscaleJson,
      effectSepiaJson,
      effectTextJson
    ], ModuleType.effect)

    this.addModulesOfType([this.defaults.font], ModuleType.font)

    this.addModulesOfType([
      mergerBlendJson,
      mergerCenterJson,
      mergerConstrainedJson,
      mergerOverlayJson,
      this.defaults.merger,
    ], ModuleType.merger)

    this.addModulesOfType([
      scalerPanJson,
      scalerScaleJson,
      this.defaults.scaler,
    ], ModuleType.scaler)
  }

  addModulesOfType(objects : ModuleArray, type : string) : boolean {
    if (!ModuleTypes.includes(type)) {
      console.warn(Errors.deprecation.addModulesOfType + type)
      return false
    }
    const modules = this.modulesOfType(type)
    let changed = false
    objects.forEach((object) => {
      const { id } = object
      // allow existing modules to be redefined, including defaults
      if (id === `com.moviemasher.${type}.default`) this.defaults[type] = object
      if (this.ofTypeExists(id, type)) {
        modules.splice(modules.indexOf(this.ofType(id, type)), 1)
      }
      modules.push(object)
      changed = true
    })
    if (changed) modules.sort(byLabel)
    return changed
  }

  fontById(id : string) : ModuleInterface {
    return this.ofType(id, ModuleType.font)
  }

  scalerById(id : string) : ModuleInterface {
    return this.ofType(id, ModuleType.scaler)
  }

  mergerById(id : string) : ModuleInterface {
    return this.ofType(id, ModuleType.merger)
  }

  effectById(id : string) : ModuleInterface {
    return this.ofType(id, ModuleType.effect)
  }

  themeById(id : string) : ModuleInterface {
    return this.ofType(id, ModuleType.theme)
  }

  defaultOfType(type : string) : ModuleInterface {
    return { ...this.defaults[type], type }
  }

  modulesOfType(type : string) : ModuleArray {
    return this.modules[type]
  }

  objectWithDefaultId(type : string) : ModuleInterface {
    const module = this.defaultOfType(type)
    const { id, label } = module
    return { id, type, label }
  }

  ofType(id : string, type : string) : ModuleInterface {
    const module = this.modulesOfType(type).find((object) => object.id === id)
    if (module) return module

    return this.defaultOfType(type)
  }

  ofTypeExists(id: string, type: string) : boolean {
    const module = this.modulesOfType(type).find((object) => object.id === id)
    return Is.defined(module)
  }

  setDefault(type:string, object : ModuleInterface) {
    this.defaults[type] = object
  }
}

const ModuleInstance = new ModuleClass()
export { ModuleInstance as Module }
