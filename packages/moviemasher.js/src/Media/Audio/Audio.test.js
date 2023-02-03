import { describe, test } from 'node:test'
import assert from 'assert'

import { 
  DefinitionType, AudioClass, audioDefinition
  } from "@moviemasher/moviemasher.js"

describe("audio", () => {
  const quantize = 10
  const duration = 10 // frames
  const seconds = duration * quantize
  const mediaObject = { 
    id: 'audio-blah', 
    url: "audio.mp3", 
    duration: seconds, 
    type: DefinitionType.Audio
  }
  // const audioDefinitionObject = { id: 'audio-id-1', url: "audio.mp3", duration: 1 , type: DefinitionType.Audio}
  const definition = () => audioDefinition(mediaObject)
  const defaults = { startTrim: 0, gain: 1.0 } //frame: 0, frames: -1, 

  describe("instance", () => {
    test("returns audio clip for valid clipObject", () => {
      assert(definition().instanceFromObject() instanceof AudioClass)
    })
  })

  describe.each(Object.entries(defaults))("%s", (key, value) => {
    const instance = definition().instanceFromObject()
    test(`returns ${value} by default`, () => {
      assert.equal(instance.value(key), value)
    })
  })
})

