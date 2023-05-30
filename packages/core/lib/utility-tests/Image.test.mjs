import { describe, test } from 'node:test'
import assert from 'assert'

import { 
  MediaType, ImageClass, imageDefinition
  } from "@moviemasher/lib-core"

describe("image", () => {
  const imageMediaObject = {
    id: 'image-id',
    url: "../shared/image/globe.jpg",
    type: ImageType,
  }
  const definition = () => imageDefinition(imageMediaObject)

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