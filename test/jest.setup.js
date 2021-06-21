/* eslint-disable @typescript-eslint/no-var-requires */
import { AudioFactoryImplementation } from "../src/Mash/Audio"
import { EffectFactoryImplementation } from "../src/Mash/Effect"
import { FilterFactoryImplementation } from "../src/Mash/Filter"
import { FontFactoryImplementation } from "../src/Mash/Font/FontFactory"
import { ImageFactoryImplementation } from "../src/Mash/Image/ImageFactory"
import { MergerFactoryImplementation } from "../src/Mash/Merger/MergerFactory"
import { ScalerFactoryImplementation } from "../src/Mash/Scaler/ScalerFactory"
import { ThemeFactoryImplementation } from "../src/Mash/Theme/ThemeFactory"
import { TransitionFactoryImplementation } from "../src/Mash/Transition/TransitionFactory"
import { VideoFactoryImplementation } from "../src/Mash/Video/VideoFactory"
import { LoaderFactory } from "../src/Loading/LoaderFactory"
import { LoadType } from "../src/Setup/Enums"
import { expectContext } from "./expectContext"
import { FontLoaderTest } from "./FontLoaderTest"
import { ImageLoaderTest } from "./ImageLoaderTest"
import { Definitions } from "../src/Mash/Definitions/Definitions"
import { MashFactoryImplementation } from "../src/Mash/Mash/MashFactory"

const factories = [
  AudioFactoryImplementation,
  EffectFactoryImplementation,
  FilterFactoryImplementation,
  FontFactoryImplementation,
  ImageFactoryImplementation,
  MashFactoryImplementation,
  MergerFactoryImplementation,
  ScalerFactoryImplementation,
  ThemeFactoryImplementation,
  TransitionFactoryImplementation,
  VideoFactoryImplementation,
]
const fs = require('fs')
const path = require('path')
const { toMatchImageSnapshot } = require('jest-image-snapshot')
const fetchMock = require('jest-fetch-mock')

beforeEach(() => {
  Definitions.clear()
  factories.forEach(factory => factory.initialize())
})

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

LoaderFactory.install(LoadType.Font, FontLoaderTest)
LoaderFactory.install(LoadType.Image, ImageLoaderTest)
