import { Any, JsonObject, LoadPromise } from "../../declarations"
import { Errors } from "../../Setup/Errors"
import { DefinitionType } from "../../Setup/Enums"
import { DefinitionBase } from "../../Base/Definition"
import { Font, FontDefinitionObject, FontObject } from "./Font"
import { FontClass } from "./FontInstance"
import { Definitions } from "../../Definitions/Definitions"
import { Time } from "../../Utilities/Time"
import { LoaderFactory } from "../../Loading/LoaderFactory"
import { Cache } from "../../Loading/Cache"
import { urlAbsolute } from "../../Utilities/Url"

class FontDefinitionClass extends DefinitionBase {
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
    if (Cache.cached(url)) return

    if (Cache.caching(url)) return Cache.get(url)

    return LoaderFactory.font().loadUrl(url)
  }

  definitionUrls(_start : Time, _end? : Time) : string[] {
    return [urlAbsolute(this.source)]
  }

  loadedVisible() : Any { return Cache.get(urlAbsolute(this.source)) }

  retain = true

  source : string

  toJSON() : JsonObject {
    return { ...super.toJSON(), source: this.source }
  }

  type = DefinitionType.Font
}

export { FontDefinitionClass }
