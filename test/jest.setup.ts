import { LoaderFactory } from "../src/Factory/LoaderFactory"
import { LoadType } from "../src/Setup/Types"
import { expectContext } from "./expectContext"
import { FontLoaderTest } from "./FontLoaderTest"
import { ImageLoaderTest } from "./ImageLoaderTest"

const fs = require('fs')
const path = require('path')
const { toMatchImageSnapshot } = require('jest-image-snapshot')
const fetchMock = require('jest-fetch-mock')
const crypto = require('crypto')

global.crypto = { getRandomValues: arr => crypto.randomBytes(arr.length) }

expect.extend({ toMatchImageSnapshot })

global.expectContext = expectContext

fetchMock.enableMocks()
fetch.mockResponse(req => {
  const promise = new Promise((resolve, reject) => {
    const localPath = path.resolve(__dirname, req.url)
    fs.readFile(localPath, 'ascii', (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
  return promise
})

LoaderFactory.install(LoadType.font, FontLoaderTest)
LoaderFactory.install(LoadType.image, ImageLoaderTest)
