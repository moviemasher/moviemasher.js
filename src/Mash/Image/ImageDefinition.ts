import { DefinitionClass } from "../Definition/Definition"
import { Any, DrawingSource, JsonObject, LoadPromise } from "../../Setup/declarations"
import { Errors } from "../../Setup/Errors"
import { DefinitionType, LoadType } from "../../Setup/Enums"
import { Image, ImageDefinitionObject, ImageObject } from "./Image"
import { ImageClass } from "./ImageInstance"
import { VisibleDefinitionMixin } from "../Mixin/Visible/VisibleDefinitionMixin"
import { ClipDefinitionMixin } from "../Mixin/Clip/ClipDefinitionMixin"
import { Definitions } from "../Definitions/Definitions"
import { Time, Times } from "../../Utilities/Time"
import { Cache } from "../../Loading"
import { LoaderFactory } from "../../Loading/LoaderFactory"


const ImageDefinitionWithClip = ClipDefinitionMixin(DefinitionClass)
const ImageDefinitionWithVisible = VisibleDefinitionMixin(ImageDefinitionWithClip)

class ImageDefinitionClass  extends ImageDefinitionWithVisible {
  constructor(...args : Any[]) {
    super(...args)
    const [object] = args
    if (!object) throw Errors.unknown.definition
    // console.log("ImageDefinition", object)
    const { url, source } = <ImageDefinitionObject> object
    if (!url) throw Errors.invalid.definition.url

    this.urlVisible = url
    if (source) this.source = source

    Definitions.install(this)
  }

  get instance() : Image {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : ImageObject) : Image {
    const instance = new ImageClass({ ...this.instanceObject, ...object })
    return instance
  }

  load(start : Time, end? : Time) : LoadPromise {
    const promises = [super.load(start, end)]
    if (Cache.cached(this.urlVisible)) {
      const cached = Cache.get(this.urlVisible)
      if (cached instanceof Promise) promises.push(cached)
    } else promises.push(LoaderFactory.image().loadUrl(this.urlVisible))
    return Promise.all(promises).then()
  }

  loaded(start : Time, end? : Time) : boolean {
    return super.loaded(start, end) && Cache.cached(this.urlVisible)
  }

  loadedVisible(_time? : Time) : DrawingSource | undefined { return Cache.get(this.urlVisible) }


  source = ''

  type = DefinitionType.Image

  toJSON() : JsonObject {
    const object = super.toJSON()
    object.url = this.urlVisible
    if (this.source) object.source = this.source
    return object
  }

  unload(times : Times[] = []) : void {
    super.unload(times)
    if (times.length) return // don't unload since any times indicate image needed

    if (!Cache.cached(this.urlVisible)) return // we're not loaded

    Cache.remove(this.urlVisible)
  }

  urlVisible : string
}

export { ImageDefinitionClass }
