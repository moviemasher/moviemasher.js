import { ThemeDefinitionClass } from "./ThemeDefinition"
import { ThemeClass } from "./ThemeInstance"
import { DefinitionType, RenderType } from "../../Setup/Enums"
import { Errors } from "../../Setup/Errors"
import { Property } from "../../Setup/Property"
import { themeDefinitionFromId, themeFromId, themeInstance } from "./ThemeFactory"
import themeColorJson from "../../Definitions/DefinitionObjects/theme/color.json"
import { Factory } from "../../Definitions/Factory"
import { TimeRange } from "../../Helpers/TimeRange"
import { Size } from "../../declarations"
import { Default } from "../../Setup/Default"


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
    describe("layer", () => {
      test("returns expected command", () => {
        const instance = themeFromId(colorId)
        instance.frames = 10
        const timeRange = TimeRange.fromArgs(0, 30)
        const quantize = 10
        const size:Size = { width: 640, height: 480 }
        const rate = Default.mash.output.fps
        const type = RenderType.Stream
        const layer = instance.layerOrThrow({ type, quantize, timeRange, size, rate })

        const { inputs, filters, merger } = layer
        expect(inputs).toBeUndefined()
        expect(filters.length).toBeGreaterThan(0)
        const [filter] = filters
        expect(filter.filter).toEqual('color')
        const { options } = filter
        const keys = Object.keys(options).sort()
        expect(keys).toEqual(['color', 'rate', 'size'])//'duration',
        expect(merger).toBeDefined()
        if (!merger) throw 'merger'

        expect(merger.filter).toEqual('overlay')
        expect(Object.keys(merger.options).length).toEqual(2) // x, y
      })
    })
  })
})
