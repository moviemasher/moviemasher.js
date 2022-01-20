import { Definitions } from "../../Definitions/Definitions"
import { StreamEditor, StreamEditorObject } from "./StreamEditor"
import { StreamEditorClass } from "./StreamEditorClass"

import { cacheFlush } from "../../Loader/Cache"
import { Interval } from "../../declarations"

const StreamEditorFactoryTics = 10 * 1000

const StreamEditorFactoryStreamers : StreamEditor[] = []
let StreamEditorFactoryInterval: Interval | undefined

const StreamEditorFactoryHandler = () => {
  // const urls = StreamEditorFactoryStreamers.flatMap(streamer => streamer.stream.loadUrls)
  // cacheFlush(urls)

  // const definitions = StreamEditorFactoryStreamers.flatMap(streamer => streamer.stream.definitions)

  // Definitions.map.forEach(definition => {
  //   if (definitions.includes(definition) || definition.retain) return

  //   Definitions.uninstall(definition.id)
  // })
}

/**
 * @category Factory
 */
const StreamEditorFactory = {
  destroy: (streamer: StreamEditor): void => {
    const index = StreamEditorFactoryStreamers.indexOf(streamer)
    if (index < 0) return

    StreamEditorFactoryStreamers.splice(index, 1)
    if (!StreamEditorFactoryStreamers.length && StreamEditorFactoryInterval) {
      clearInterval(StreamEditorFactoryInterval)
      StreamEditorFactoryInterval = undefined
    }
  },

  instance: (object: StreamEditorObject = {}): StreamEditor => {

    const instance = new StreamEditorClass(object)

    if (!(StreamEditorFactoryStreamers.length || StreamEditorFactoryInterval)) {
      StreamEditorFactoryInterval = setInterval(() => StreamEditorFactoryHandler(), StreamEditorFactoryTics)
    }
    StreamEditorFactoryStreamers.push(instance)

    return instance
  }
}

export { StreamEditorFactory }
