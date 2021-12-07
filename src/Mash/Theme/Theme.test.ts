import { ThemeDefinitionClass } from "./ThemeDefinition"
import { ThemeClass } from "./ThemeInstance"
import { DefinitionType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Property } from "../../Setup/Property"
import { themeDefinitionFromId, themeFromId, themeInstance } from "./ThemeFactory"
import themeColorJson from "../../Definitions/DefinitionObjects/theme/color.json"
import { Factory } from "../../Definitions/Factory"
import { Time } from "../../Utilities/Time"
import { Size } from "../.."


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
    const colorThemeDefinition = () => Factory.theme.definition(themeColorJson)
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
        const labelProperty = colorProperties.find(property => property.name === 'label')
        const colorProperty = colorProperties.find(property => property.name === 'color')
        // const [labelProperty, colorProperty] = colorProperties
        expect(colorProperty).toBeDefined()
        expect(labelProperty).toBeDefined()
        expect(labelProperty).toBeInstanceOf(Property)
        expect(colorProperty).toBeInstanceOf(Property)
        if (!(labelProperty && colorProperty)) throw Errors.internal

        expect(colorProperty.name).toEqual("color")
        expect(labelProperty.name).toEqual("label")
      })
    })
  })

  describe("ThemeInstance", () => {
    // describe("inputCommandAtTimeToSize", () => {
    //   test("returns expected command", () => {
    //     const instance = themeFromId(colorId)
    //     instance.frames = 10
    //     const time = Time.fromArgs(0, 30)
    //     const quantize = 10
    //     const dimensions:Size = { width: 640, height: 480 }

    //     const inputCommand = instance.inputCommandAtTimeToSize(time, quantize, dimensions)
    //     expect(inputCommand).toBeDefined()
    //     if (!inputCommand) throw Errors.internal

    //     const { sources, filters, merger } = inputCommand
    //     expect(sources).toEqual([''])
    //     expect(filters.length).toEqual(1)
    //     const [filter] = filters
    //     expect(filter.filter).toEqual('color')
    //     const { options } = filter
    //     expect(options.length).toEqual(4)
    //     expect(options.map(p => p.key)).toEqual(['color', 'size', 'duration', 'rate'])
    //     expect(merger).toBeDefined()
    //     expect(merger?.filter).toEqual('overlay')
    //     expect(merger?.options.length).toEqual(2) // x, y
    //   })
    // })
  })
})
