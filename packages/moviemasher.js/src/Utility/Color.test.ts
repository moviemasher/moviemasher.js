import { ObjectUnknown, Rgba } from "../declarations"
import { colorAlphaColor, colorRgbaToHex, colorToRgb, colorValid } from "./Color"

describe("Color", () => {
  describe("valid", () => {
    const validColors = [
      'gray', 'grey', 'red', 'green', 'rgb(0,0,0)', 'rgba(0,0,0,0.5)', '#FF00FF',
      '#fF00Ff66', 'rgba(0,0,0,0.50)',
    ]
    test.each(validColors)("%s", color => {
      expect(colorValid(color)).toBe(true)
    })
    const invalid = ['unknown', 'rbg()', 'rgba()']
    test.each(invalid)("%s", color => {
      expect(colorValid(color)).toBe(false)
    })
  })
  describe("alphaColor", () => {
    const colors: ObjectUnknown = {
      'rgb(0,0,0)': { alpha: 1.0, color: '#000000' },
    }
    test.each(Object.keys(colors))("%s", color => {
      expect(colorAlphaColor(color)).toEqual(colors[color])
    })
  })
  describe("rgbaToHex", () => {
    const colors: {[index: string] : Rgba} = {
      '#ff0000ff': { a: 1.0, r: 255, g: 0, b: 0 },
    }
    test.each(Object.keys(colors))("%s", color => {
      expect(colorRgbaToHex(colors[color])).toEqual(color)
    })
  })
  describe("toRgb", () => {
    const colors: ObjectUnknown = {
      '#000000': { r: 0, g: 0, b: 0 },
      '#FF0000': { r: 255, g: 0, b: 0 },
    }
    test.each(Object.keys(colors))("%s", color => {
      expect(colorToRgb(color)).toEqual(colors[color])
    })
  })
})
