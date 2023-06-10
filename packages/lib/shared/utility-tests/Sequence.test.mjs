import { describe, test } from 'node:test'
import assert from 'assert'

import { 
  MediaType, sequenceDefinition, idGenerateString, 
  SequenceClass, SequenceMediaClass 
} from "@moviemasher/lib-shared"


describe(SequenceType, () => {
  const definitionObject = {
    id: idGenerateString(),
    url: "frames/",
    type: SequenceType,
    fps: 30, duration: 10
  }

  const definition = () => sequenceDefinition(definitionObject)

  describe("definition", () => {
      test("returns SequenceMediaClass instance", () => {
      assert(definition() instanceof SequenceMediaClass)
    })
  })

  describe("instance", () => {
    test("returns VideoClass instance", () => {
      assert(definition().instanceFromObject() instanceof SequenceClass)
    })
  })
})
