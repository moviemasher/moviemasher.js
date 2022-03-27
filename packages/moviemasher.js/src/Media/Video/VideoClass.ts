import {
  GraphFile, GraphFilter, UnknownObject, ValueObject
} from "../../declarations"
import { AVType, GraphType, LoadType } from "../../Setup/Enums"
import { Default } from "../../Setup/Default"
import { Time } from "../../Helpers/Time/Time"
import { InstanceBase } from "../../Base/Instance"
import { ClipMixin } from "../../Mixin/Clip/ClipMixin"
import { TransformableMixin } from "../../Mixin/Transformable/TransformableMixin"
import { AudibleMixin } from "../../Mixin/Audible/AudibleMixin"
import { AudibleFileMixin } from "../../Mixin/AudibleFile/AudibleFileMixin"
import { VisibleMixin } from "../../Mixin/Visible/VisibleMixin"
import { Video, VideoDefinition } from "./Video"
import { FilterChain } from "../../Edited/Mash/FilterChain/FilterChain"
import { Errors } from "../../Setup/Errors"

const WithClip = ClipMixin(InstanceBase)
const WithAudible = AudibleMixin(WithClip)
const WithAudibleFile = AudibleFileMixin(WithAudible)
const WithVisible = VisibleMixin(WithAudibleFile)
const WithTransformable = TransformableMixin(WithVisible)

class VideoClass extends WithTransformable implements Video {
  get copy() : Video { return <Video> super.copy }

  declare definition : VideoDefinition

  definitionTime(quantize : number, time : Time) : Time {
    const scaledTime = super.definitionTime(quantize, time)
    if (this.speed === Default.instance.video.speed) return scaledTime

    return scaledTime.divide(this.speed) //, 'ceil')
  }

  override initializeFilterChain(filterChain: FilterChain): void {
    // console.log(this.constructor.name, "initializeFilterChain")
    const { filterGraph } = filterChain
    const {
      avType, graphType, preloading, preloader, time, quantize, size, videoRate
    } = filterGraph
    const { definition } = this
    const file = definition.preloadableSource(graphType)
    if (!file) throw Errors.invalid.url

    const options: ValueObject = {}
    const graphFile: GraphFile = {
      type: LoadType.Video, file, options, input: true, definition
    }
    const inputId = filterChain.addGraphFile(graphFile)

    const definitionStartTime = this.definitionTime(quantize, time)
    switch (graphType) {
      case GraphType.Cast: {
        options.re = ''
        // intentional fallthrough to Mash
      }
      case GraphType.Mash: {

        if (avType === AVType.Audio) {
          // TODO: add trim as options.ss
        } else {
          const trimFilter: GraphFilter = {
            avType: AVType.Both,
            inputs: [inputId], filter: 'trim', options: { start: definitionStartTime.seconds }
          }
          filterChain.addGraphFilter(trimFilter)

          const fpsFilter: GraphFilter = {
            inputs: [], filter: 'fps', options: { fps: videoRate }
          }
          filterChain.addGraphFilter(fpsFilter)
          const setptsFilter: GraphFilter = {
            inputs: [], filter: 'setpts', options: { expr: 'PTS-STARTPTS' }
          }
          filterChain.addGraphFilter(setptsFilter)
          const setsarFilter: GraphFilter = {
            inputs: [], filter: 'setsar', options: { sar: 1, max: 1 }
          }
          filterChain.addGraphFilter(setsarFilter)
        }

        break
      }
      case GraphType.Canvas: {
        options.width = size.width
        options.height = size.height
        options.videoRate = videoRate
        options.firstFrame = definitionStartTime.frame

        options.firstFrame = definitionStartTime.frame


        if (!preloading) {
          const context = this.contextAtTimeToSize(preloader, definitionStartTime, quantize)

          if (!context) throw Errors.invalid.context + ' ' + this.constructor.name + '.initializeFilterChain'

          filterChain.visibleContext = context
        }
        break
      }
    }
  }

  speed = Default.instance.video.speed

  toJSON() : UnknownObject {
    const object = super.toJSON()
    if (this.speed !== Default.instance.video.speed) object.speed = this.speed
    return object
  }
}

export { VideoClass }


// ffmpeg -y  -i /mnt/moviemasher.rb/tmp/spec/cache/30da29f7a68e9971dbf222647b2bb70937f6c2d89c3c8c3274ead66cca14ca4e/downloaded.mp4
// -filter_complex
// [0: v]trim = duration = 2.0: start = 2.0
// fps = fps = 30
// setpts = expr =
// setsar = sar = 1: max = 1


// - t 2.0 - an - s 512x288 - c:v libx264 - level 41 - movflags faststart - b:v 2000k - r:v 30 - metadata title\=test - pass 1 - passlogfile / mnt / moviemasher.rb / tmp / spec / temporary / 031cc40a - de8b - 4f07 - b7d5 - cf09daabd9fe / pass - 43bba8d8 - 3fcc - 4919 - bd91 - 6dc23511198a - f mp4 / dev / null
