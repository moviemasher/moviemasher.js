import { EffectDefinitionClass } from "../../Media/Effect/EffectDefinitionClass"
import { OverlayFilter } from "../../Media/Filter/Definitions/OverlayFilter"
import { ThemeDefinition } from "../../Media/Theme/Theme"
import { DefinitionType } from "../../Setup/Enums"
import { EditorDefinitionsClass } from "./EditorDefinitionsClass"

describe("EditorDefinitions", () => {
  const definitions = new EditorDefinitionsClass()
  describe("fromId", () => {
    test("returns OverlayFilter", () => {
      const definition = definitions.fromId('com.moviemasher.filter.overlay')
      expect(definition).toBeDefined()
      expect(definition).toBeInstanceOf(OverlayFilter)
    })
    test("returns EffectDefinition", () => {
      const definition = definitions.fromId('com.moviemasher.effect.chromakey')
      expect(definition).toBeDefined()
      // console.log(definition.constructor.name, definition)
      expect(definition).toBeInstanceOf(EffectDefinitionClass)
    })
    test("returns FontDefinition", () => {
      const definition = definitions.fromId('com.moviemasher.font.default')
      expect(definition).toBeDefined()
    })
    test("returns MergerDefinition", () => {
      const definition = definitions.fromId('com.moviemasher.merger.default')
      expect(definition).toBeDefined()
    })
    test("returns ScalerDefinition", () => {
      const definition = definitions.fromId('com.moviemasher.scaler.default')
      expect(definition).toBeDefined()
    })
    test("returns ThemeDefinition", () => {
      const definition = definitions.fromId('com.moviemasher.theme.text')
      expect(definition).toBeDefined()
      const themeDefinition = definition as ThemeDefinition
      expect(themeDefinition.filters.length).toBe(3)
    })
    test("returns ImageDefinition", () => {
      const imageDefinitionObject = {
        id: 'globe', type: DefinitionType.Image, source: '../shared/image/globe.jpg'
      }
      definitions.define(imageDefinitionObject)
      const definition = definitions.fromId(imageDefinitionObject.id)
      expect(definition).toBeDefined()
    })

  })
})
