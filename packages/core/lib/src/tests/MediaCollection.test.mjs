import { describe, test } from 'node:test'
import assert from 'assert'

import { 
  DefaultFontId, EffectMediaClass, MediaCollection, FontMediaClass, AudioMediaClass,
  TypeImage, TypeFont, ImageMediaClass, TypeEffect, TypeVideo, VideoMediaClass,
  MashMediaClass, TypeMash
} from '@moviemasher/lib-core'

describe('MediaCollection', () => {
  const collection = new MediaCollection()

  // test that we can find default font
  test('returns default FontMedia', () => {
    const definition = collection.fromId(DefaultFontId)
    assert(definition)
    assert(definition instanceof FontMediaClass)
  })


  // test that we can define new image
  test('returns new ImageMedia', () => {
    const imageDefinitionObject = {
      id: 'test-new-image', type: TypeImage, 
      request: { endpoint: { pathname: '../shared/image/globe.jpg' }}
    }
    const [media] = collection.define(imageDefinitionObject)
    assert(media)

    collection.install(media)
    const definition = collection.fromId(imageDefinitionObject.id)
    assert(definition)
    assert(definition instanceof ImageMediaClass)

  })

  // test that we can define new font
  test('returns new FontMedia', () => {
    const fontDefinitionObject = {
      id: 'test-new-font', type: TypeFont, 
      request: { endpoint: { pathname: '../shared/font/valken/valken.ttf' }}
    }
    const [media] = collection.define(fontDefinitionObject)
    assert(media)

    collection.install(media)
    const definition = collection.fromId(fontDefinitionObject.id)
    assert(definition)
  })

  // test that we can define new effect
  test('returns new EffectMedia', () => {
    const effectDefinitionObject = {
      id: 'test-new-effect', type: TypeEffect,
      request: { endpoint: { pathname: '../shared/effect/blur.json' }}
    }
    const [media] = collection.define(effectDefinitionObject)
    assert(media)
    assert(media instanceof EffectMediaClass) 
  })



  // test that we can define new audio
  test('returns new AudioMedia', () => {
    const audioDefinitionObject = {
      id: 'test-new-audio', type: 'audio',
      request: { endpoint: { pathname: '../shared/audio/loop.mp3' }}
    }
    const [media] = collection.define(audioDefinitionObject)
    assert(media)
    assert(media instanceof AudioMediaClass)
  })

  // test that we can define new video
  test('returns new VideoMedia', () => {
    const videoDefinitionObject = {
      id: 'test-new-video', type: TypeVideo,
      request: { endpoint: { pathname: '../shared/video/rgb.mp4' }}
    }
    const [media] = collection.define(videoDefinitionObject)
    assert(media)
    assert(media instanceof VideoMediaClass)
  })


  // test that we can define new mash
  test('returns new MashMedia', () => {
    const mashDefinitionObject = {
      id: 'test-new-mash', type: TypeMash,
      request: { endpoint: { pathname: '../shared/mash/test.json' }}
    }
    const [media] = collection.define(mashDefinitionObject)
    assert(media)
    assert(media instanceof MashMediaClass)
  })
})
