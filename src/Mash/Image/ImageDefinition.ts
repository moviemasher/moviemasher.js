import { DefinitionBase } from "../Definition/Definition"
import { Any, VisibleSource, JsonObject, LoadPromise } from "../../declarations"
import { Errors } from "../../Setup/Errors"
import { DefinitionType } from "../../Setup/Enums"
import { Image, ImageDefinitionObject, ImageObject } from "./Image"
import { ImageClass } from "./ImageInstance"
import { VisibleDefinitionMixin } from "../Mixin/Visible/VisibleDefinitionMixin"
import { ClipDefinitionMixin } from "../Mixin/Clip/ClipDefinitionMixin"
import { Definitions } from "../Definitions/Definitions"
import { Time, Times } from "../../Utilities/Time"
import { Cache } from "../../Loading"
import { LoaderFactory } from "../../Loading/LoaderFactory"
import { urlAbsolute } from "../../Utilities/Url"


const ImageDefinitionWithClip = ClipDefinitionMixin(DefinitionBase)
const ImageDefinitionWithVisible = VisibleDefinitionMixin(ImageDefinitionWithClip)
const ImageDefinitionWithTransformable = VisibleDefinitionMixin(ImageDefinitionWithVisible)

class ImageDefinitionClass extends ImageDefinitionWithTransformable {
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

  get absoluteUrl(): string { return urlAbsolute(this.urlVisible) }

  get instance() : Image {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : ImageObject) : Image {
    const instance = new ImageClass({ ...this.instanceObject, ...object })
    return instance
  }

  loadDefinition(quantize: number, start: Time, end?: Time): LoadPromise | void {
    const promises: LoadPromise[] = []
    const definitionPromise = super.loadDefinition(quantize, start, end)
    if (definitionPromise) promises.push(definitionPromise)
    const url = this.absoluteUrl
    if (!Cache.cached(url)) {
      if (Cache.caching(url)) promises.push(Cache.get(url))
      else promises.push(LoaderFactory.image().loadUrl(url))
    }
    switch (promises.length) {
      case 0: return
      case 1: return promises[0]
      default: return Promise.all(promises).then()
    }
  }

  definitionUrls(_start : Time, _end? : Time) : string[] { return [this.absoluteUrl] }

  loadedVisible(): VisibleSource | undefined { return Cache.get(this.absoluteUrl) }

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
