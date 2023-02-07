import { describe, test } from 'node:test'
import assert from 'assert'

import { 
  DefinitionType, sequenceDefinition, idGenerateString, 
  SequenceClass, SequenceMediaClass 
} from "@moviemasher/moviemasher.js"


describe(DefinitionType.Sequence, () => {
  const definitionObject = {
    id: idGenerateString(),
    url: "frames/",
    type: DefinitionType.Sequence,
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
