import { describe, test } from 'node:test'
import assert from 'assert'
import type { AudioOutputOptions, OutputOptions, VideoOutputOptions } from '../../packages/@moviemasher/shared-lib/src/types.js'

import { $VIDEO, $AUDIO, $IMAGE, typeOutputOptions, $BITMAPS, $WAVEFORM } from '../../packages/@moviemasher/shared-lib/src/runtime.js'
import { assertSize } from '../../packages/@moviemasher/shared-lib/src/utility/guards.js'
import { isAboveZero } from '../../packages/@moviemasher/shared-lib/src/utility/guard.js'

const expectNoVideoKeys = (args: OutputOptions) => {
  assert(!args.videoBitrate)
  assert(!args.videoCodec)
}
const expectDimensionKeys = (args: VideoOutputOptions) => {
  assertSize(args)
  assert(args.width > 1)
  assert(args.height > 1)
}
const expectVideoKeys = (args: VideoOutputOptions) => {
  assert(isAboveZero(args.videoBitrate))
  assert(args.videoCodec)
}
const expectAudioKeys = (args: AudioOutputOptions) => {
  assert(isAboveZero(args.audioBitrate))
  assert(isAboveZero(args.audioChannels))
  assert(isAboveZero(args.audioRate))
  assert(args.audioCodec)
  assert(args.audioCodec)
}

const expectNoAudioKeys = (args: OutputOptions) => {
  assert(!args.audioChannels)
  assert(!args.audioRate)
  assert(!args.audioCodec)
  assert(!args.audioBitrate)
}
const expectNoDimensionKeys = (args: OutputOptions) => {
  assert(!args.width)
  assert(!args.height)
}

describe('typeOutputOptions', () => {
  test('audio', () => {
    const args = typeOutputOptions($AUDIO)
    assert(!args.format)
    assert.equal(args.extension, 'mp3')
    assert.equal(args.audioCodec, 'libmp3lame')
    expectAudioKeys(args)
    expectNoVideoKeys(args)
    expectNoDimensionKeys(args)
  })

  test('image', () => {
    const args = typeOutputOptions($IMAGE, {})
    assert(!args.format)
    assert.equal(args.extension, 'jpg')
    assert(!args.videoCodec)
    assert(!args.options?.g)
    expectNoAudioKeys(args)
  })

  test('bitmaps', () => {
    const args = typeOutputOptions($BITMAPS, {})
    assert.equal(args.extension, 'jpg')
    assert.equal(args.format, 'image2')
    assert(!args.options?.g)
    expectNoAudioKeys(args)
  })

  test('waveform', () => {
    const args = typeOutputOptions($WAVEFORM)
    expectAudioKeys(args)
    assert.equal(args.audioCodec, 'aac')
    assert.equal(args.extension, 'png')
    expectDimensionKeys(args)
    expectAudioKeys(args)
    
  })
  
  test('video', () => {
    const args = typeOutputOptions($VIDEO)
    assert.equal(args.videoCodec, 'libx264')
    assert.equal(args.format, 'mp4')
    expectDimensionKeys(args)
    expectAudioKeys(args)
    expectVideoKeys(args)
  })
})
