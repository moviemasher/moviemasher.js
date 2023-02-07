import { LoadedMedia, UnknownObject } from "../../declarations";
import { isLoadedImage, isLoadedVideo } from "../../Loader/Loader";
import { assertLoadType, assertDefinitionType, DefinitionType, LoadType } from "../../Setup/Enums";
import { Errors } from "../../Setup/Errors";
import { mediaPromise } from "../../Utility/File";
import { RequestableClass } from "../../Base/Requestable/RequestableClass";
import { Transcoding, TranscodingObject } from "./Transcoding";


export class TranscodingClass extends RequestableClass implements Transcoding {
  constructor(object: TranscodingObject) {
    super(object)
    
    const { 
      loadedMedia, type, kind 
    } = object 
    assertDefinitionType(type)

    this.type = type
    if (kind) this.kind = kind
    if (loadedMedia) this.loadedMedia
  }

  get loadType(): LoadType { 
    const { type } = this
    console.log(this.constructor.name, "loadType", type)
    if (type === DefinitionType.Sequence) return LoadType.Image

    assertLoadType(type)

    return type
  }

  loadedMedia?: LoadedMedia

  get loadedMediaPromise(): Promise<LoadedMedia> {
    const { loadedMedia } = this
    if (loadedMedia) return Promise.resolve(loadedMedia)

    const { request, loadType } = this
    
    console.log(this.constructor.name, 'loadedMediaPromise...', loadType, request)
    return mediaPromise(loadType, request).then(loadedMedia => {
      console.log(this.constructor.name, 'loadedMediaPromise!', loadType, request, loadedMedia.constructor.name)

      this.loadedMedia = loadedMedia
      return loadedMedia
    })
  }

  get srcPromise(): Promise<string> {
    return this.loadedMediaPromise.then(loadedMedia => {
      if (isLoadedImage(loadedMedia) || isLoadedVideo(loadedMedia)) {
        return loadedMedia.src
      }
      throw new Error(Errors.type)
    })
  }
  
  type: DefinitionType
  kind = ''
  
  toJSON(): UnknownObject {
    const { type, kind } = this
    return { ...super.toJSON(), type, kind }
  }

  unload() {
    delete this.loadedMedia
  }
}