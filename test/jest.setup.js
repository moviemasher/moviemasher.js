import { LoadType } from "../src/Setup"
import { LoaderFactory } from "../src/Factory/LoaderFactory"
import { registerFont } from "canvas"
import { Cache, FontLoader, ImageLoader } from "../src/Loading"

const fs = require('fs')
const path = require('path')
const { loadImage } = require('canvas')
const { toMatchImageSnapshot } = require('jest-image-snapshot')
const fetchMock = require('jest-fetch-mock')
const crypto = require('crypto')

global.crypto = { getRandomValues: arr => crypto.randomBytes(arr.length) }

expect.extend({ toMatchImageSnapshot })
global.expectContext = context => {
  const { canvas } = context
  const dataUrl = canvas.toDataURL()
  const image = dataUrl.substring('data:image/png;base64,'.length)
  expect(image).toMatchImageSnapshot()
}

fetchMock.enableMocks()
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

class ImageLoaderTest extends ImageLoader {
  requestUrl(url) {
    return new Promise((resolve, reject) => {
      loadImage(path.resolve(__dirname, url))
        .then(image => resolve(image))
        .catch(error => reject(error))
    })
  }
}

LoaderFactory.install(LoadType.font, FontLoaderTest)
LoaderFactory.install(LoadType.image, ImageLoaderTest)
