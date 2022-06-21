/* eslint-disable @typescript-eslint/no-var-requires */

import fs from 'fs'
import path from 'path'


import { TestRenderOutput } from "./Setup/Constants"

import { audioDefinition } from "../../packages/moviemasher.js/src/Media/Audio/AudioFactory"
import { colorContentDefinition } from "../../packages/moviemasher.js/src/Content/ColorContent/ColorContentFactory"
import { shapeContainerDefinition } from "../../packages/moviemasher.js/src/Container/ShapeContainer/ShapeContainerFactory"
import { textContainerDefinition } from "../../packages/moviemasher.js/src/Container/TextContainer/TextContainerFactory"
import { effectDefinition } from "../../packages/moviemasher.js/src/Media/Effect/EffectFactory"
import { filterDefinition } from "../../packages/moviemasher.js/src/Filter/FilterFactory"
import { fontDefinition, fontDefault } from "../../packages/moviemasher.js/src/Media/Font/FontFactory"
import { imageDefinition } from "../../packages/moviemasher.js/src/Media/Image/ImageFactory"
import { visibleClipDefinition } from "../../packages/moviemasher.js/src/Media/VisibleClip/VisibleClipFactory"
import { videoDefinition } from "../../packages/moviemasher.js/src/Media/Video/VideoFactory"
import { videoSequenceDefinition } from "../../packages/moviemasher.js/src/Media/VideoSequence/VideoSequenceFactory"
import { idCountReset } from '../../packages/moviemasher.js/src/Utility/Id'


export default [
  audioDefinition,
  colorContentDefinition,
  effectDefinition,
  filterDefinition,
  fontDefinition,
  shapeContainerDefinition,
  visibleClipDefinition,
  imageDefinition,
  videoDefinition,
  textContainerDefinition,
  videoSequenceDefinition,
]

if (fs.existsSync(TestRenderOutput)) {
  fs.rmSync(TestRenderOutput, { recursive: true, force: true })
}

const { toMatchImageSnapshot } = require('jest-image-snapshot')

expect.extend({ toMatchImageSnapshot })

beforeEach(idCountReset)

jest.setTimeout(20 * 1000)

require('jest-fetch-mock').enableMocks()

fetchMock.mockResponse(req => {
  const promise = new Promise((resolve, reject) => {
    const localPath = path.resolve(__dirname, '..', req.url)
    fs.readFile(localPath, 'ascii', (err, data) => {
      if (err) reject(err)
      else resolve(data)
    })
  })
  return promise
})

fontDefault.url = fontDefault.source
