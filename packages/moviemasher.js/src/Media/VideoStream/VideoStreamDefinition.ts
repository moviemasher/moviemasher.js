import { AVType, DefinitionType, LoadType, TrackType } from "../../Setup/Enums"
import { VideoStreamClass } from "./VideoStreamInstance"
import { VideoStream, VideoStreamDefinition, VideoStreamObject } from "./VideoStream"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { VisibleDefinitionMixin } from "../../Mixin/Visible/VisibleDefinitionMixin"
import { GraphFile, FilesArgs, GraphFiles } from "../../declarations"
import { AudibleDefinitionMixin } from "../../Mixin/Audible/AudibleDefinitionMixin"
import { StreamableDefinitionMixin } from "../../Mixin/Streamable/StreamableDefinitionMixin"
import { Default } from "../../Setup/Default"
import { TransformableDefinitionMixin } from "../../Mixin/Transformable/TransformableDefintiionMixin"
import { Preloader } from "../../Preloader/Preloader"
import { PreloadableDefinition } from "../../Base/PreloadableDefinition"
import { timeFromSeconds } from "../../Helpers/Time/TimeUtilities"

const WithClip = ClipDefinitionMixin(PreloadableDefinition)
const WithAudible = AudibleDefinitionMixin(WithClip)
const WithVisible = VisibleDefinitionMixin(WithAudible)
const WithStreamable = StreamableDefinitionMixin(WithVisible)
const WithTransformable = TransformableDefinitionMixin(WithStreamable)
class VideoStreamDefinitionClass extends WithTransformable implements VideoStreamDefinition {
  frames(quantize: number): number {
    return timeFromSeconds(Default.definition.videostream.duration, quantize, 'floor').frame
  }

  get file(): GraphFile {
    const graphFile: GraphFile = {
      type: LoadType.Video, file: this.url, definition: this
    }
    return graphFile
  }

  definitionFiles(args: FilesArgs): GraphFiles {
    return [this.file]
  }

  get instance() : VideoStream { return this.instanceFromObject(this.instanceObject) }

  instanceFromObject(object : VideoStreamObject) : VideoStream {
    return new VideoStreamClass({ ...this.instanceObject, ...object })
  }

  loadedVisible(preloader: Preloader): HTMLVideoElement | undefined {
    return preloader.getFile(this.file)
  }

  trackType = TrackType.Video

  type = DefinitionType.VideoStream
}

export { VideoStreamDefinitionClass }
