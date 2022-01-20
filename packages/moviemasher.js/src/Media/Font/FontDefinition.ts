import { Any, UnknownObject, LoadPromise } from "../../declarations"
import { Errors } from "../../Setup/Errors"
import { DefinitionType } from "../../Setup/Enums"
import { Time } from "../../Helpers/Time"
import { urlAbsolute } from "../../Utilities/Url"
import { DefinitionBase } from "../../Base/Definition"
import { Definitions } from "../../Definitions/Definitions"
import { LoaderFactory } from "../../Loader/LoaderFactory"
import { cacheCached, cacheCaching, cacheGet } from "../../Loader/Cache"
import { Font, FontDefinition, FontDefinitionObject, FontObject } from "./Font"
import { FontClass } from "./FontInstance"

class FontDefinitionClass extends DefinitionBase implements FontDefinition {
  constructor(...args : Any[]) {
    super(...args)
    const [object] = args
    const { source, url } = <FontDefinitionObject> object
    if (!(source || url)) throw Errors.invalid.definition.source

    this.source = source || url || ''
    Definitions.install(this)
  }
  get absoluteUrl(): string { return urlAbsolute(this.source) }

  get instance() : Font {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : FontObject) : Font {
    return new FontClass({ ...this.instanceObject, ...object })
  }

  loadDefinition(): LoadPromise | void {
    const url = this.absoluteUrl
    if (cacheCached(url)) return

    if (cacheCaching(url)) return cacheGet(url)

    return LoaderFactory.font().loadUrl(url)
  }

  definitionUrls(_start : Time, _end? : Time) : string[] {
    return [urlAbsolute(this.source)]
  }

  loadedVisible() : Any { return cacheGet(urlAbsolute(this.source)) }

  retain = true

  source : string

  toJSON() : UnknownObject {
    return { ...super.toJSON(), source: this.source }
  }

  type = DefinitionType.Font
}

export { FontDefinitionClass }
