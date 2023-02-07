import { describe, test } from 'node:test'
import assert from 'assert'

import { 
  OutputFormat, OutputType, ExtJpeg, ExtPng 
} from "@moviemasher/moviemasher.js"

import { outputDefaultRendering } from '@moviemasher/server-core'
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
  test("OutputType.Audio", () => {
    const args = outputDefaultRendering(OutputType.Audio)
    assert(!args.format)
    assert.equal(args.extension, OutputFormat.Mp3)
    assert.equal(args.outputType, OutputType.Audio)
    expectAudioKeys(args)
    expectNoVideoKeys(args)
    expectNoDimensionKeys(args)
    assert(!args.options?.g)
  })

  test("OutputType.Image, cover", () => {
    const args = outputDefaultRendering(OutputType.Image, { cover: true })
    // console.log('Image', args)
    assert(args.cover)
    assert(!args.format)
    assert.equal(args.extension, ExtJpeg)
    assert(!args.options?.g)
  })
  test("OutputType.Image, no cover", () => {
    const args = outputDefaultRendering(OutputType.Image, { cover: false })
    // console.log('Image', args)
    assert(!args.cover)
    assert(!args.format)
    assert.equal(args.extension, ExtJpeg)
    assert(!args.options?.g)
  })

  test("OutputType.Video", () => {
    const args = outputDefaultRendering(OutputType.Video)
    // console.log('Video', args)
    assert.equal(args.format, OutputFormat.Mp4)
    assert.equal(args.extension, OutputFormat.Mp4)
    expectDimensionKeys(args)
    expectAudioKeys(args)
    expectVideoKeys(args)
    assert.equal(args.options?.g, 60)
  })

  // test("OutputType.ImageSequence", () => {
  //   const args = outputDefaultRendering(OutputType.ImageSequence)
  //   assert.equal(args.extension, ExtJpeg)
  //   expectDimensionKeys(args)
  //   expectNoAudioKeys(args)
  //   assert(!args.options?.g)
  // })

  // test("OutputType.Waveform", () => {
  //   const args = outputDefaultRendering(OutputType.Waveform)
  //   // console.log('Waveform', args)
  //   assert(!args.format)
  //   assert.equal(args.extension, ExtPng)
  //   expectDimensionKeys(args)
  //   assert(!args.options?.g)
  // })
})
