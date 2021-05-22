import { registerFont } from "canvas";
import { Cache, FontLoader } from "../src/Loading";
const path = require('path');

export class FontLoaderTest extends FontLoader {
  requestUrl(url) {
    const family = Cache.key(url);
    const object = { family };
    registerFont(path.resolve(__dirname, url), object);
    return Promise.resolve(object);
  }
}
