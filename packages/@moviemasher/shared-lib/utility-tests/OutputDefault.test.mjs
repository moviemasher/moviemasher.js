import { describe, test } from 'node:test'
import assert from 'assert'

import { 
  OutputFormat, VideoType, ExtJpeg, PngExtension, AudioType, ImageType
} from "@moviemasher/shared-lib"

import { outputDefaultRendering } from '@moviemasher/server-lib'
const expectNoVideoKeys = (args) => {
  assert(!args.videoBitrate)
  assert(!args.videoCodec)
}
const expectDimensionKeys = (args) => {
  assert(args.width > 1)
  assert(args.height > 1)
}
const expectVideoKeys = (args) => {
  assert(args.videoCodec)
  assert(args.videoBitrate > 1)
}
const expectAudioKeys = (args) => {
  assert(args.audioChannels > 1)
  assert(args.audioRate > 1)
  assert(args.audioCodec)
  assert(args.audioBitrate > 1)
}

const expectNoAudioKeys = (args) => {
  assert(!args.audioChannels)
  assert(!args.audioRate)
  assert(!args.audioCodec)
  assert(!args.audioBitrate)
}
const expectNoDimensionKeys = (args) => {
  assert(!args.width)
  assert(!args.height)
}

describe("outputDefaultRendering", () => {
  test("AudioType", () => {
    const args = outputDefaultRendering(AudioType)
    assert(!args.format)
    assert.equal(args.extension, OutputFormat.Mp3)
    assert.equal(args.outputType, AudioType)
    expectAudioKeys(args)
    expectNoVideoKeys(args)
    expectNoDimensionKeys(args)
    assert(!args.options?.g)
  })

  test("ImageType, cover", () => {
    const args = outputDefaultRendering(ImageType, { cover: true })
    // console.log('Image', args)
    assert(args.cover)
    assert(!args.format)
    assert.equal(args.extension, ExtJpeg)
    assert(!args.options?.g)
  })
  test("ImageType, no cover", () => {
    const args = outputDefaultRendering(ImageType, { cover: false })
    // console.log('Image', args)
    assert(!args.cover)
    assert(!args.format)
    assert.equal(args.extension, ExtJpeg)
    assert(!args.options?.g)
  })

  test("VideoType", () => {
    const args = outputDefaultRendering(VideoType)
    // console.log('Video', args)
    assert.equal(args.format, OutputFormat.Mp4)
    assert.equal(args.extension, OutputFormat.Mp4)
    expectDimensionKeys(args)
    expectAudioKeys(args)
    expectVideoKeys(args)
    assert.equal(args.options?.g, 60)
  })
})
