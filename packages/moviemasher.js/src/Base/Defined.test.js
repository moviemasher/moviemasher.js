import { describe, test } from 'node:test'
import assert from 'assert'

import { DefaultFontId, EffectDefinitionClass, OverlayFilter, DefinitionType, Defined } from "@moviemasher/moviemasher.js"

describe("Defined.fromId", () => {
  test("returns OverlayFilter", () => {
    const definition = Defined.fromId('com.moviemasher.filter.overlay')
    assert(definition)
    assert(definition instanceof OverlayFilter)
  })
  
  test("returns EffectDefinition", () => {
    const definition = Defined.fromId('com.moviemasher.effect.chromakey')
    assert(definition)
    // console.log(definition.constructor.name, definition)
    assert(definition instanceof EffectDefinitionClass)
  })

  test("returns FontDefinition", () => {
    const definition = Defined.fromId(DefaultFontId)
    assert(definition)
  })

  test("returns ImageDefinition", () => {
    const imageDefinitionObject = {
      id: 'globe', type: DefinitionType.Image, 
      request: { endpoint: { pathname: '../shared/image/globe.jpg' }}
    }
    Defined.define(imageDefinitionObject)
    const definition = Defined.fromId(imageDefinitionObject.id)
    assert(definition)
  })
})
