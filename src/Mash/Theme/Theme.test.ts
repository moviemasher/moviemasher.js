import { ThemeDefinitionClass } from "./ThemeDefinition"
import { ThemeClass } from "./ThemeInstance"
import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Property } from "../../Setup/Property"
import { themeDefinitionFromId, themeInstance } from "./ThemeFactory"
import themeColorJson from "./DefinitionObjects/color.json"
import { MovieMasher } from "../../MovieMasher"


describe("Theme", () => {
  describe("ThemeFactory", () => {
    const colorId = "com.moviemasher.theme.color"
    describe("definitionFromId", () => {
      test("returns expected instance", () => {
        const definition = themeDefinitionFromId(colorId)
        expect(definition).toBeInstanceOf(ThemeDefinitionClass)
        expect(definition.id).toEqual(colorId)
      })
    })
    describe("instance", () => {
      test("returns expected instance", () => {
        const colorThemeObject = { frame: 10, id: colorId }
        const colorThemeInstance = themeInstance(colorThemeObject)
        expect(colorThemeInstance.id).toEqual(colorId)
        expect(colorThemeInstance.frame).toEqual(10)
      })
    })
  })

  describe("ThemeDefinition", () => {
    const id = "id"
    const type = DefinitionType.Theme
    const themeDefinitionObject = { id, type }
    const invalidThemeDefinitionObject = {
      ...themeDefinitionObject,
      properties: { foo: "bar" }
    }
    const colorId = "com.moviemasher.theme.color"
    const colorThemeDefinition = () => MovieMasher.theme.definition(themeColorJson)
    describe("constructor", () => {
      test("returns expected instance", () => {
        expect(colorThemeDefinition()).toBeInstanceOf(ThemeDefinitionClass)
      })
      test("throws when properties contains invalid value", () => {
        expect(() => {
          new ThemeDefinitionClass(invalidThemeDefinitionObject)
        }).toThrow(Errors.invalid.property)
      })
    })
    describe("id", () => {
      test("returns expected string", () => {
        expect(colorThemeDefinition().id).toEqual(colorId)
      })
    })
    describe("instanceObject", () => {
      test("returns expected object", () => {
        const colorInstanceObject = colorThemeDefinition().instanceObject
        expect(colorInstanceObject.definition).toEqual(colorThemeDefinition())
      })
    })
    describe("instance", () => {
      test("returns expected instance", () => {
        const colorInstance = colorThemeDefinition().instance
        expect(colorInstance).toBeInstanceOf(ThemeClass)
        expect(colorInstance.frame).toEqual(0)
      })
    })
    describe("properties", () => {
      test("returns expected array of property instances", () => {
        const colorProperties = colorThemeDefinition().properties
        expect(colorProperties).toBeInstanceOf(Array)
        expect(colorProperties.length).toBeGreaterThan(0)
        const [labelProperty, colorProperty] = colorProperties
        expect(labelProperty).toBeInstanceOf(Property)
        expect(colorProperty).toBeInstanceOf(Property)
        expect(colorProperty.name).toEqual("color")
        expect(labelProperty.name).toEqual("label")
      })
    })
  })
})
