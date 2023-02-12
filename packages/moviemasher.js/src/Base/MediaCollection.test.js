import { describe, test } from 'node:test'
import assert from 'assert'

import { DefaultFontId, EffectDefinitionClass, OverlayFilter, MediaCollection } from "@moviemasher/moviemasher.js"

describe("MediaCollection", () => {
  const media = new MediaCollection()
  test("returns OverlayFilter", () => {
    const definition = media.fromId('com.moviemasher.filter.overlay')
    assert(definition)
    assert(definition instanceof OverlayFilter)
  })
  
  test("returns EffectDefinition", () => {
    const definition = media.fromId('com.moviemasher.effect.chromakey')
    assert(definition)
    // console.log(definition.constructor.name, definition)
    assert(definition instanceof EffectDefinitionClass)
  })

  test("returns FontDefinition", () => {
    const definition = media.fromId(DefaultFontId)
    assert(definition)
  })

  test("returns ImageDefinition", () => {
    const imageDefinitionObject = {
      id: 'globe', type: ImageType, 
      request: { endpoint: { pathname: '../shared/image/globe.jpg' }}
    }
    media.define(imageDefinitionObject)
    const definition = media.fromId(imageDefinitionObject.id)
    assert(definition)
  })
})
