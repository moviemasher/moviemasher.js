require('jest-fetch-mock').enableMocks()

import { LoadType } from '../src/Types'
import { LoaderFactory } from '../src/Factory/LoaderFactory'
import { registerFont } from "canvas"
import { Cache } from '../src/Cache'
import { FontLoader, ImageLoader } from '../src/Loader'

const fs = require('fs')
const path = require('path');
const { loadImage } = require('canvas')
const crypto = require('crypto');

global.crypto = { getRandomValues: arr => crypto.randomBytes(arr.length) }


fetch.mockResponse(req => {
  const promise = new Promise((resolve, reject) => {
    const local_path = path.resolve(__dirname, req.url)
    fs.readFile(local_path, 'ascii', (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
  return promise
})

class FontLoaderTest extends FontLoader {
  requestUrl(url) {
    const family = Cache.key(url)
    const object = { family }
    registerFont(path.resolve(__dirname, url), object)
    return Promise.resolve(object)
  }
}
LoaderFactory.install(LoadType.font, FontLoaderTest)

class ImageLoaderTest extends ImageLoader {
  requestUrl(url) {
    return new Promise((resolve, reject) => {  
      loadImage(path.resolve(__dirname, url))
        .then(image => resolve(image))
        .catch(error => reject(error))
    })
  }
}

LoaderFactory.install(LoadType.image, ImageLoaderTest)
// console.log("JEST SETUP", LoaderFactory.typeClass(LoadType.image))

