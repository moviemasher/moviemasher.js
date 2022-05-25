import { Is } from "../../Utility/Is"
import { Any, AudibleSource, UnknownObject, StartOptions, GraphFile } from "../../declarations"
import { ClipClass } from "../Clip/Clip"
import { AudibleClass, AudibleDefinition, AudibleObject } from "./Audible"
import { Default } from "../../Setup/Default"
import { Preloader } from "../../Preloader/Preloader"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"
import { AVType, GraphType, LoadType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"

const AudibleGainDelimiter = ','

export function AudibleMixin<T extends ClipClass>(Base: T) : AudibleClass & T {
  return class extends Base {
    constructor(...args : Any[]) {
      super(...args)
      const [object] = args
      const { gain } = <AudibleObject> object

      if (typeof gain !== "undefined") {
        if (typeof gain === "string") {
          if (gain.includes(AudibleGainDelimiter)){
            const floats = gain.split(AudibleGainDelimiter).map(string => parseFloat(string))
            const z = floats.length / 2
            for (let i = 0; i < z; i += 1) {
              this.gainPairs.push([floats[i * 2], floats[i * 2 + 1]])
            }
            this.gain = -1
          } else this.gain = Number(gain)
        } else this.gain = gain
      }
    }

    audible = true

    declare definition : AudibleDefinition

    filterChainPopulate(filterChain: FilterChain): void {
      // TODO: audio effects
    }

    gain = Default.instance.audio.gain

    gainPairs : number[][] = []

    override filterChainInitialize(filterChain: FilterChain): void  {
      const { filterGraph } = filterChain
      const { graphType, avType, preloading } = filterGraph
      // console.log(this.constructor.name, "initializeFilterChain", preloading)
      if (avType === AVType.Video) throw Errors.internal + 'initializeFilterChain Video'

      const source = this.definition.urlAudible
      if (!source) throw Errors.invalid.url

      // console.log(this.constructor.name, "initializeFilterChain addGraphFile", source, preloading)
      const graphFile: GraphFile = {
        type: LoadType.Audio, file: source,
        input: true,
        definition: this.definition
      }

      filterChain.addGraphFile(graphFile)
      if (!preloading) {
        switch (graphType) {
          case GraphType.Cast: {
            // ??
            graphFile.options = { loop: 1 }
            graphFile.options.re = ''
            break
          }
          case GraphType.Canvas: {

            break
          }
        }
      }
    }

    audibleSource(preloader: Preloader):AudibleSource | undefined {
      return this.definition.audibleSource(preloader)
    }

    get muted() : boolean {
      if (this.gain === 0) return true
      if (Is.positive(this.gain)) return false

      return this.gainPairs === [[0, 0], [1, 0]]
    }

    startOptions(seconds: number, quantize: number): StartOptions {
      const range = this.timeRange(quantize)
      let offset = 0
      let start = range.seconds - seconds
      let duration = range.lengthSeconds

      if (start < 0) {
        offset -= start
        duration += start
        start = 0
      }
      return { start, offset, duration }
    }

    toJSON() : UnknownObject {
      const object = super.toJSON()
      if (this.gain !== Default.instance.audio.gain) object.gain = this.gain
      return object
    }
  }
}
