import { ThemeDefinitionClass } from "./ThemeDefinitionClass"
import { ThemeClass } from "./ThemeClass"
import { Errors } from "../../Setup/Errors"
import { themeDefinitionFromId, themeInstance } from "./ThemeFactory"
import { Factory } from "../../Definitions/Factory"
import themeColorJson from "../../Definitions/DefinitionObjects/theme/color.json"

describe("Theme", () => {
  const colorId = "com.moviemasher.theme.color"
  describe("ThemeFactory", () => {
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
        expect(colorThemeInstance.definition.id).toEqual(colorId)
        expect(colorThemeInstance.frame).toEqual(10)
      })
    })
  })

  describe("ThemeDefinition", () => {
    const colorThemeDefinition = () => Factory.theme.definition(themeColorJson)
    describe("constructor", () => {
      test("returns expected instance", () => {
        expect(colorThemeDefinition()).toBeInstanceOf(ThemeDefinitionClass)
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
        const labelProperty = colorProperties.find(property => property.name === 'label')
        const colorProperty = colorProperties.find(property => property.name === 'color')
        // const [labelProperty, colorProperty] = colorProperties
        expect(colorProperty).toBeDefined()
        expect(labelProperty).toBeDefined()
        expect(labelProperty).toBeInstanceOf(Object)
        expect(colorProperty).toBeInstanceOf(Object)
        if (!(labelProperty && colorProperty)) throw Errors.internal + 'labelProperty'

        expect(colorProperty.name).toEqual("color")
        expect(labelProperty.name).toEqual("label")
      })
    })
  })

})
