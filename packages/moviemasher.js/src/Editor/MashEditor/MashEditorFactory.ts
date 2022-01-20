import { Default } from "../../Setup/Default"
import { Definitions } from "../../Definitions/Definitions"
import { MashEditor, MashEditorObject } from "./MashEditor"
import { MashEditorClass } from "./MashEditorClass"

import { cacheFlush } from "../../Loader/Cache"
import { Interval } from "../../declarations"

const MashEditorFactoryTics = 10 * 1000

const MashEditorFactoryMashers : MashEditor[] = []
let MashEditorFactoryInterval: Interval | undefined

const MashEditorFactoryHandler = () => {
  const urls = MashEditorFactoryMashers.flatMap(masher => masher.mash.loadUrls)
  cacheFlush(urls)

  const definitions = MashEditorFactoryMashers.flatMap(masher => masher.mash.definitions)

  Definitions.map.forEach(definition => {
    if (definitions.includes(definition) || definition.retain) return

    Definitions.uninstall(definition.id)
  })
}

/**
 * @category Factory
 */
const MashEditorFactory = {
  destroy: (masher: MashEditor): void => {
    const index = MashEditorFactoryMashers.indexOf(masher)
    if (index < 0) return

    MashEditorFactoryMashers.splice(index, 1)
    if (!MashEditorFactoryMashers.length && MashEditorFactoryInterval) {
      clearInterval(MashEditorFactoryInterval)
      MashEditorFactoryInterval = undefined
    }
  },

  instance: (object: MashEditorObject = {}): MashEditor => {
    object.autoplay ||= Default.masher.autoplay
    object.precision ||= Default.masher.precision
    object.loop ||= Default.masher.loop
    object.fps ||= Default.masher.fps
    object.volume ||= Default.masher.volume
    object.buffer ||= Default.masher.buffer
    const instance = new MashEditorClass(object)

    if (!(MashEditorFactoryMashers.length || MashEditorFactoryInterval)) {
      MashEditorFactoryInterval = setInterval(() => MashEditorFactoryHandler(), MashEditorFactoryTics)
    }
    MashEditorFactoryMashers.push(instance)

    return instance
  }
}

export { MashEditorFactory }
