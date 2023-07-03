import { describe, test } from 'node:test'
import assert from 'assert'

import { 
  sequenceDefinition, idGenerateString, 
  SequenceClass, SequenceMediaClass, TypeSequence
} from "@moviemasher/lib-shared"


describe(TypeSequence, () => {
  const definitionObject = {
    id: idGenerateString(),
    url: "frames/",
    type: TypeSequence,
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
