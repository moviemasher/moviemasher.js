import { ImageLoader } from "../src/Loading";
const path = require('path');
const { loadImage } = require('canvas');

export class ImageLoaderTest extends ImageLoader {
  requestUrl(url) {
    return new Promise((resolve, reject) => {
      loadImage(path.resolve(__dirname, url))
        .then(image => resolve(image))
        .catch(error => reject(error));
    });
  }
}
