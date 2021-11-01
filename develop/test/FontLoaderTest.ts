import { registerFont } from "canvas"
import { Cache } from "../../src/Loading/Cache"
import { FontLoader } from "../../src/Mash/Font/FontLoader"
import path from 'path'
import { LoadFontPromise } from "../../src/declarations"


export class FontLoaderTest extends FontLoader {
  requestUrl(url : string) : LoadFontPromise {
    const family = Cache.key(url)
    const object = { family }

    const urlResolved = url.startsWith('http') ? url : path.resolve(__dirname, '..', url)
    // console.log("FontLoaderTest.requestUrl", url, urlResolved)
    registerFont(urlResolved, object)
    return Promise.resolve(object)
  }
}
