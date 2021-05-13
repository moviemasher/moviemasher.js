import { ThemeClip } from "../Clip"
import { Default } from "../Default"
import { Errors } from "../Errors"
import { TimeFactory } from "../Factory/TimeFactory"
import { Module } from "../Module"
import { Masher } from "./Masher"

const { toMatchImageSnapshot } = require('jest-image-snapshot')
expect.extend({ toMatchImageSnapshot })

describe("Masher", () => {
  describe("constructor", () => {
    test("returns Masher instance", () => {
      expect(new Masher).toBeInstanceOf(Masher)
    })
  })
  const values = Object.entries({
    loop: false,
    fps: 10,
    precision: 4,
    autoplay: true,
    volume: 0.4,
    buffer: 3,
  })
  describe.each(Masher.properties)("%s getter", key => {
    const masher = new Masher
    test("returns default", () => {
      expect(masher[key]).toEqual(Default[key])
    })
  })
  describe.each(values)("%s setter", (key, value) => {
    const masher = new Masher
    test("updates value", () => {
      masher[key] = value
      expect(masher[key]).toEqual(value)
    })
  })
  describe("canvas", () => {
    test("returns HTMLCanvasElement instance", () => {
      const masher = new Masher
      const canvas = masher.canvas
      expect(canvas).toBeInstanceOf(HTMLCanvasElement)
    })
  })
  
   
  describe("change", () => {
    test("throws when property blank", () => {
      const masher = new Masher
      expect(() => masher.change("")).toThrowError(Errors.unknownMash)
    })
  })
  describe("changeEffect", () => {
    test("throws when there's no selected effect", () => {
      const masher = new Masher
      expect(() => masher.changeEffect("a")).toThrowError(Errors.selection)
    })
  })
  describe("add", () => {
    const media_config = Module.themeById('com.moviemasher.theme.text')
     
    test("returns promise that resolves to clip after loading", async () => {
      const masher = new Masher
      const clip = await masher.add(media_config)
      expect(clip).toBeInstanceOf(ThemeClip)
      masher.draw()
      const canvas = masher.canvas
      const dataUrl = canvas.toDataURL()
      const image = dataUrl.substring('data:image/png;base64,'.length)
      expect(image).toMatchImageSnapshot()
    })
    describe("currentTime", () => {
      test("returns", () => {
        const masher = new Masher
        masher.add(media_config)
        expect(masher.currentTime).toEqual(0)  
        masher.frame = 3
        expect(masher.frame).toEqual(3)  
        expect(masher.currentTime).toEqual(0.1)  
        
      })
    })
    describe("frame", () => {
      test("returns what is set", () => {
        const masher = new Masher
        masher.add(media_config)
        expect(masher.currentTime).toEqual(0)  
        masher.frame = 3
        expect(masher.frame).toEqual(3)  
      })
    })
    describe("time", () => {
      test("returns what is set", () => {
        const masher = new Masher
        masher.add(media_config)
        expect(masher.currentTime).toEqual(0)  
        const time = TimeFactory.create(3, 30)
        masher.time = time
        expect(masher.time.equalsTime(time)).toBeTruthy()
      })
    })
    
  })  
})