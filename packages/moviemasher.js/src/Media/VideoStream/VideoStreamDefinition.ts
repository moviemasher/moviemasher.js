import { DefinitionType, LoadType, TrackType } from "../../Setup/Enums"
import { Time} from "../../Helpers/Time"
import { DefinitionBase } from "../../Base/Definition"
import { VideoStreamClass } from "./VideoStreamInstance"
import { VideoStream, VideoStreamDefinition, VideoStreamDefinitionObject, VideoStreamObject } from "./VideoStream"
import { ClipDefinitionMixin } from "../../Mixin/Clip/ClipDefinitionMixin"
import { VisibleDefinitionMixin } from "../../Mixin/Visible/VisibleDefinitionMixin"
import { Any, UnknownObject, GraphFile, FilesArgs, GraphFiles } from "../../declarations"
import { Errors } from "../../Setup/Errors"
import { AudibleDefinitionMixin } from "../../Mixin/Audible/AudibleDefinitionMixin"
import { StreamableDefinitionMixin } from "../../Mixin/Streamable/StreamableDefinitionMixin"
import { Default } from "../../Setup/Default"
import { TransformableDefinitionMixin } from "../../Mixin/Transformable/TransformableDefintiionMixin"
import { Preloader } from "../../Preloader/Preloader"

const WithClip = ClipDefinitionMixin(DefinitionBase)
const WithAudible = AudibleDefinitionMixin(WithClip)
const WithVisible = VisibleDefinitionMixin(WithAudible)
const WithStreamable = StreamableDefinitionMixin(WithVisible)
const WithTransformable = TransformableDefinitionMixin(WithStreamable)
class VideoStreamDefinitionClass extends WithTransformable implements VideoStreamDefinition {
  constructor(...args : Any[]) {
    super(...args)
    const [object] = args
    const { url } = <VideoStreamDefinitionObject> object
    if (!url) throw Errors.invalid.definition.url + 'VIDEOSTREAM'

    this.url = url
    this.source ||= url

    // this.properties.push(new Property({ name: "speed", type: DataType.Number, value: 1.0 }))
  }

  frames(quantize: number): number {
    return Time.fromSeconds(Default.definition.videostream.duration, quantize, 'floor').frame
  }

  get file(): GraphFile {
    return { type: LoadType.Video, file: this.url, definition: this }
  }

  files(args: FilesArgs): GraphFiles {
    return [this.file]
  }

  get instance() : VideoStream { return this.instanceFromObject(this.instanceObject) }

  instanceFromObject(object : VideoStreamObject) : VideoStream {
    return new VideoStreamClass({ ...this.instanceObject, ...object })
  }

  loadedVisible(preloader: Preloader): HTMLVideoElement | undefined {
    return preloader.getFile(this.file)
  }

  source = ''

  trackType = TrackType.Video

  type = DefinitionType.VideoStream

  toJSON() : UnknownObject {
    const object = super.toJSON()
    object.url = this.url
    if (this.source) object.source = this.source
    return object
  }

  url : string
}

export { VideoStreamDefinitionClass }
