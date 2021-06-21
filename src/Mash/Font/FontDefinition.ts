import { Any, JsonObject, LoadPromise } from "../../Setup/declarations"
import { Errors } from "../../Setup/Errors"
import { DefinitionType } from "../../Setup/Enums"
import { DefinitionClass } from "../Definition/Definition"
import { Font, FontDefinitionObject, FontObject } from "./Font"
import { FontClass } from "./FontInstance"
import { Definitions } from "../Definitions/Definitions"
import { Time } from "../../Utilities/Time"
import { LoaderFactory } from "../../Loading/LoaderFactory"
import { Cache } from "../../Loading/Cache"


class FontDefinitionClass extends DefinitionClass {
  constructor(...args : Any[]) {
    super(...args)
    const [object] = args
    const { source } = <FontDefinitionObject> object
    if (!source) throw Errors.invalid.definition.source + JSON.stringify(object)

    this.source = source

    Definitions.install(this)
  }

  get instance() : Font {
    return this.instanceFromObject(this.instanceObject)
  }

  instanceFromObject(object : FontObject) : Font {
    const instance = new FontClass({ ...this.instanceObject, ...object })
    return instance
  }


  load(start : Time, end? : Time) : LoadPromise {
    const promises = [super.load(start, end)]
    if (Cache.cached(this.source)) {
      const cached = Cache.get(this.source)
      if (cached instanceof Promise) promises.push(cached)
    } else promises.push(LoaderFactory.font().loadUrl(this.source))
    return Promise.all(promises).then()
  }

  loaded(start : Time, end? : Time) : boolean {
    return super.loaded(start, end) && Cache.cached(this.source)
  }

  loadedVisible(_time?: Time) : Any { return Cache.get(this.source) }

  retain = true

  source : string

  toJSON() : JsonObject {
    return { ...super.toJSON(), source: this.source }
  }

  type = DefinitionType.Font
}

export { FontDefinitionClass }
