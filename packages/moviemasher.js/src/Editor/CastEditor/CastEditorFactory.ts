import { CastEditor, CastEditorOptions } from "./CastEditor"
import { CastEditorClass } from "./CastEditorClass"

import { Interval } from "../../declarations"

const CasterEditorFactoryTics = 10 * 1000

const CasterEditorFactoryCasterers : CastEditor[] = []
let CasterEditorFactoryInterval: Interval | undefined

const CasterEditorFactoryHandler = () => {
  // const urls = CasterEditorFactoryCasterers.flatMap(caster => caster.stream.loadUrls)
  // cacheFlush(urls)

  // const definitions = CasterEditorFactoryCasterers.flatMap(caster => caster.stream.definitions)

  // Definitions.map.forEach(definition => {
  //   if (definitions.includes(definition) || definition.retain) return

  //   Definitions.uninstall(definition.id)
  // })
}

/**
 * @category Factory
 */
const CastEditorFactory = {
  destroy: (caster: CastEditor): void => {
    const index = CasterEditorFactoryCasterers.indexOf(caster)
    if (index < 0) return

    CasterEditorFactoryCasterers.splice(index, 1)
    if (!CasterEditorFactoryCasterers.length && CasterEditorFactoryInterval) {
      clearInterval(CasterEditorFactoryInterval)
      CasterEditorFactoryInterval = undefined
    }
  },

  instance: (object: CastEditorOptions = {}): CastEditor => {

    const instance = new CastEditorClass(object)

    if (!(CasterEditorFactoryCasterers.length || CasterEditorFactoryInterval)) {
      CasterEditorFactoryInterval = setInterval(() => CasterEditorFactoryHandler(), CasterEditorFactoryTics)
    }
    CasterEditorFactoryCasterers.push(instance)

    return instance
  }
}

export { CastEditorFactory }
