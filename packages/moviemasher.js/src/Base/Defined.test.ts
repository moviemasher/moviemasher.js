import { EffectDefinitionClass } from "../Media/Effect/EffectDefinitionClass"
import { OverlayFilter } from "../Filter/Definitions/OverlayFilter"
import { DefinitionType } from "../Setup/Enums"
import { Defined } from "./Defined"

describe("Defined.fromId", () => {
  test("returns OverlayFilter", () => {
    const definition = Defined.fromId('com.moviemasher.filter.overlay')
    expect(definition).toBeDefined()
    expect(definition).toBeInstanceOf(OverlayFilter)
  })
  
  test("returns EffectDefinition", () => {
    const definition = Defined.fromId('com.moviemasher.effect.chromakey')
    expect(definition).toBeDefined()
    // console.log(definition.constructor.name, definition)
    expect(definition).toBeInstanceOf(EffectDefinitionClass)
  })

  test("returns FontDefinition", () => {
    const definition = Defined.fromId('com.moviemasher.font.default')
    expect(definition).toBeDefined()
  })

  test("returns ImageDefinition", () => {
    const imageDefinitionObject = {
      id: 'globe', type: DefinitionType.Image, source: '../shared/image/globe.jpg'
    }
    Defined.define(imageDefinitionObject)
    const definition = Defined.fromId(imageDefinitionObject.id)
    expect(definition).toBeDefined()
  })
})
