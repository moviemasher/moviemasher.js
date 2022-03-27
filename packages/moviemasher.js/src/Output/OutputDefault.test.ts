import { CommandOutput } from "./Output"
import { OutputFormat, OutputType } from "../Setup/Enums"
import { outputDefaultRendering } from "./OutputDefault"
import { ExtJpeg, ExtPng } from "../Setup/Constants"

const expectNoVideoKeys = (args: CommandOutput) => {
  expect(args.videoBitrate).toBeUndefined()
  expect(args.videoCodec).toBeUndefined()
}
const expectDimensionKeys = (args: CommandOutput) => {
  expect(args.width).toBeGreaterThan(1)
  expect(args.height).toBeGreaterThan(1)
}
const expectVideoKeys = (args: CommandOutput) => {
  expect(args.videoCodec).toBeTruthy()
  expect(args.videoBitrate).toBeGreaterThan(1)
}
const expectAudioKeys = (args: CommandOutput) => {
  expect(args.audioChannels).toBeGreaterThan(1)
  expect(args.audioRate).toBeGreaterThan(1)
  expect(args.audioCodec).toBeTruthy()
  expect(args.audioBitrate).toBeGreaterThan(1)
}

const expectNoAudioKeys = (args: CommandOutput) => {
  expect(args.audioChannels).toBeUndefined()
  expect(args.audioRate).toBeUndefined()
  expect(args.audioCodec).toBeUndefined()
  expect(args.audioBitrate).toBeUndefined()
}
const expectNoDimensionKeys = (args: CommandOutput) => {
  expect(args.width).toBeUndefined()
  expect(args.height).toBeUndefined()
}

describe("outputDefaultRendering", () => {
  test("OutputType.Audio", () => {
    const args = outputDefaultRendering(OutputType.Audio)
    expect(args.format).toBeUndefined()
    expect(args.extension).toEqual(OutputFormat.Mp3)
    expect(args.outputType).toEqual(OutputType.Audio)
    expectAudioKeys(args)
    expectNoVideoKeys(args)
    expectNoDimensionKeys(args)
    expect(args.options?.g).toBeUndefined()
  })

  test("OutputType.Image, cover", () => {
    const args = outputDefaultRendering(OutputType.Image, { cover: true })
    // console.log('Image', args)
    expect(args.cover).toBe(true)
    expect(args.format).toBeUndefined()
    expect(args.extension).toEqual(ExtJpeg)
    expect(args.options?.g).toBeUndefined()
  })
  test("OutputType.Image, no cover", () => {
    const args = outputDefaultRendering(OutputType.Image, { cover: false })
    // console.log('Image', args)
    expect(args.cover).toBe(false)
    expect(args.format).toBeUndefined()
    expect(args.extension).toEqual(ExtJpeg)
    expect(args.options?.g).toBeUndefined()
  })

  test("OutputType.Video", () => {
    const args = outputDefaultRendering(OutputType.Video)
    // console.log('Video', args)
    expect(args.format).toEqual(OutputFormat.Mp4)
    expect(args.extension).toEqual(OutputFormat.Mp4)
    expectDimensionKeys(args)
    expectAudioKeys(args)
    expectVideoKeys(args)
    expect(args.options?.g).toEqual(60)
  })

  test("OutputType.VideoSequence", () => {
    const args = outputDefaultRendering(OutputType.ImageSequence)
    // console.log('VideoSequence', args)
    expect(args.extension).toEqual(ExtJpeg)
    expectDimensionKeys(args)
    expectNoAudioKeys(args)
    expect(args.options?.g).toBeUndefined()
  })

  test("OutputType.Waveform", () => {
    const args = outputDefaultRendering(OutputType.Waveform)
    // console.log('Waveform', args)
    expect(args.format).toBeUndefined()
    expect(args.extension).toEqual(ExtPng)
    expectDimensionKeys(args)
    expect(args.options?.g).toBeUndefined()
  })
})
