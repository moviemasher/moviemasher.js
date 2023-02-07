import { DefinitionType } from "../../Setup/Enums"
import { FontMediaClass } from "./FontMediaClass"
import { DefaultFontId, FontDefinition, FontObject } from "./Font"


import fontButchermanJson from "../../MediaObjects/font/butcherman.json"
import fontCroissantOneJson from "../../MediaObjects/font/croissant-one.json"
import fontDefaultJson from "../../MediaObjects/font/default.json"
import fontGermaniaOneJson from "../../MediaObjects/font/germania-one.json"
import fontKeniaJson from "../../MediaObjects/font/kenia.json"
import fontLuckiestGuyJson from "../../MediaObjects/font/luckiest-guy.json"
import fontMonotonJson from "../../MediaObjects/font/monoton.json"
import fontOleoScriptJson from "../../MediaObjects/font/oleo-script.json"
import fontShojumaruJson from "../../MediaObjects/font/shojumaru.json"
import fontRubikDirtJson from "../../MediaObjects/font/rubik-dirt.json"
import { MediaFactories } from "../MediaFactories"
import { MediaDefaults } from "../MediaDefaults"

export const fontFind = (id: string): FontDefinition | undefined => {
  const definition = MediaDefaults[DefinitionType.Font].find(definition => (
    definition.id === id
  ))
  if (definition) return definition as FontDefinition
}

export const fontDefinition = (object : FontObject): FontDefinition => {
  const { id = DefaultFontId } = object
  const definition = fontFind(id)
  if (definition) return definition 

  const withDefaults = { ...object, type: DefinitionType.Font, id }
  return new FontMediaClass(withDefaults)
}

export const fontDefault = fontDefinition(fontDefaultJson)

export const fontDefinitionFromId = (id: string): FontDefinition => fontDefinition({id})

MediaFactories[DefinitionType.Font] = fontDefinition
MediaDefaults[DefinitionType.Font].push(
  fontDefault,
  fontDefinition(fontButchermanJson),
  fontDefinition(fontCroissantOneJson),
  fontDefinition(fontKeniaJson),
  fontDefinition(fontGermaniaOneJson),
  fontDefinition(fontLuckiestGuyJson),
  fontDefinition(fontMonotonJson),
  fontDefinition(fontOleoScriptJson),
  fontDefinition(fontShojumaruJson),
  fontDefinition(fontRubikDirtJson),
)