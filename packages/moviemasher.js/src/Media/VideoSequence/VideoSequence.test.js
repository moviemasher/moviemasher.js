import { describe, test } from 'node:test'
import assert from 'assert'

import { 
  DefinitionType, videoSequenceDefinition, idGenerateString, 
  VideoSequenceClass, VideoSequenceDefinitionClass 
} from "@moviemasher/moviemasher.js"


describe(DefinitionType.VideoSequence, () => {
  const definitionObject = {
    id: idGenerateString(),
    url: "frames/",
    type: DefinitionType.VideoSequence,
    fps: 30, duration: 10
  }

  const definition = () => videoSequenceDefinition(definitionObject)

  describe("definition", () => {
      test("returns VideoSequenceDefinitionClass instance", () => {
      assert(definition() instanceof VideoSequenceDefinitionClass)
    })
  })

  describe("instance", () => {
    test("returns VideoClass instance", () => {
      assert(definition().instanceFromObject() instanceof VideoSequenceClass)
    })
  })
})
