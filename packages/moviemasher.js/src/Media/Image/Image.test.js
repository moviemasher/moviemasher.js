import { describe, test } from 'node:test'
import assert from 'assert'

import { 
  DefinitionType, ImageClass, imageDefinition
  } from "@moviemasher/moviemasher.js"

describe("image", () => {
  const mediaObject = {
    id: 'image-id',
    url: "../shared/image/globe.jpg",
    type: DefinitionType.Image,
  }
  const definition = () => imageDefinition(mediaObject)

  describe("instance", () => {
    test("return ImageClass instance", () => {
      assert(definition().instanceFromObject() instanceof ImageClass)
    })
  })

  describe("toJSON", () => {
    test("returns expected clip", () => {
      const expected = {}
      assert.notDeepStrictEqual(definition().instanceFromObject().toJSON(), expected)
    })
  })
})