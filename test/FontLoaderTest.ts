import { registerFont } from "canvas"
import { Cache, FontLoader } from "../src/Loading"
import path from 'path'
import { LoadFontPromise } from "../src/Setup/declarations"

export class FontLoaderTest extends FontLoader {
  requestUrl(url : string) : LoadFontPromise {
    const family = Cache.key(url)
    const object = { family }
    registerFont(path.resolve(__dirname, url), object)
    return Promise.resolve(object)
  }
}
