import { MediaType } from "../Types"
import { Module } from "../Module"
import { ThemeMedia } from "./ThemeMedia"

describe("ThemeMedia", () => {
  const media = new ThemeMedia
  const theme_text = new ThemeMedia(Module.themeById("com.moviemasher.theme.text"))
  const theme_color = new ThemeMedia(Module.themeById("com.moviemasher.theme.color"))

  test("constructor", () => {
    expect(media.type).toEqual(MediaType.theme)
  })

  test("something", () => {
    const filters = theme_color.filters
    expect(filters).toBeInstanceOf(Array)
  })
  test("toJSON", () => {
    expect(() => JSON.stringify(theme_text)).not.toThrow()
    const json = JSON.stringify(theme_text)
    const object = JSON.parse(json)
    // console.log('JSON', object)
    expect(json).not.toEqual("{}")
  })
  test("filters", () => {
    expect(media.filters).toBeInstanceOf(Array)
    expect(theme_text.filters).toBeInstanceOf(Array)
  })

  test("properties", () => {
    const properties = theme_text.properties
    expect(properties).toBeInstanceOf(Object)
    //console.log('properties', properties)
  })
  test("modularPropertiesByType", () => {
    const properties = theme_text.modularPropertiesByType
    expect(properties).toBeInstanceOf(Object)
    expect(properties).toEqual({font: ['fontface']})
  })

})