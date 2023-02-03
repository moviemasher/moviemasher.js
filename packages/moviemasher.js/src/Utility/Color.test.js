import { describe, test } from 'node:test'
import assert from 'assert'

import { colorAlphaColor, colorRgbaToHex, colorToRgb, colorValid } from "@moviemasher/moviemasher.js"

describe("Color", () => {
  describe("valid", () => {
    const validColors = [
      // 'gray', 'grey', 'red', 'green', 
      'rgb(0,0,0)', 'rgba(0,0,0,0.5)', '#FF00FF',
      '#fF00Ff66', 'rgba(0,0,0,0.50)',
    ]
    validColors.forEach(color => {
      test(`colorValid('${color}') true`, () => {
        assert(colorValid(color))
      })
    })
    const invalid = ['unknown', 'rbg()', 'rgba()']
    invalid.forEach(color => {
      test(`colorValid('${color}') false`, () => {
        assert(!colorValid(color))
      })
    }) 
  })

  describe("alphaColor", () => {
    const colors = {
      'rgb(0,0,0)': { alpha: 1.0, color: '#000000' },
    }
    Object.keys(colors).forEach(color => {
      test(`colorAlphaColor('${color}')`, () => {
        assert.deepStrictEqual(colorAlphaColor(color), colors[color])
      })
    })
  })

  describe("rgbaToHex", () => {
    const colors = {
      '#ff0000ff': { a: 1.0, r: 255, g: 0, b: 0 },
    }
    Object.keys(colors).forEach(color => {
      test(`rgbaToHex('${color}')`, () => {
        assert.deepStrictEqual(colorRgbaToHex(colors[color]), color)
      })
    })
  })

  describe("toRgb", () => {
    const colors = {
      '#000000': { r: 0, g: 0, b: 0 },
      '#FF0000': { r: 255, g: 0, b: 0 },
    }

    Object.keys(colors).forEach(color => {
      test(`toRgb('${color}')`, () => {
        assert.deepStrictEqual(colorToRgb(color), colors[color])
      })
    })
  })
})
