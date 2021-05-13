import { Id } from "../Utilities/Id"
import { MediaType } from '../Types'
import { TimeFactory } from '../Factory/TimeFactory'
import { Mash } from '../Mash'
import { AudioClip } from "./AudioClip"
import { Is } from '../Is'

const quantize = 10
const duration = 10 // frames
const seconds = duration * quantize
const media_config = { id: Id(), duration: seconds, type: MediaType.audio }
const mash = new Mash({ quantize: quantize, media: [media_config] })

const media = mash.findMedia(media_config.id)
const times = (new Array(2 * seconds).fill(true)).map((_, i) => { 
  return TimeFactory.create(i, quantize) 
})

describe("AudioClip", () => {
  const defaults = { frame: 0, frames: 0, trim: 0, gain: 1.0 }
  const clip = new AudioClip({media})
      
  describe("constructor", () => {
    test("returns instance of AudioClip", () => {
      expect(Is.instance(clip, AudioClip)).toBeTruthy()
    }) 
  })
  describe.each(Object.entries(defaults))("%s", (key, value) => {
    test(`returns ${value} by default`, () => {
      expect(clip[key]).toEqual(value)
    })
  })
  
  
  
})
