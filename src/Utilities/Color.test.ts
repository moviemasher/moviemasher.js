import { colorValid } from "."

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
})
