import { FontType, MediaType } from "../../Setup/Enums"
import { FontMediaClass } from "./FontMediaClass"
import { DefaultFontId, FontMedia, FontMediaObject, FontObject } from "./Font"
import { MediaFactories } from "../MediaFactories"
import { MediaDefaults } from "../MediaDefaults"


import fontDefaultJson from "../../MediaObjects/font/default.json"
import fontButchermanJson from "../../MediaObjects/font/butcherman.json"
import fontCroissantOneJson from "../../MediaObjects/font/croissant-one.json"
import fontGermaniaOneJson from "../../MediaObjects/font/germania-one.json"
import fontKeniaJson from "../../MediaObjects/font/kenia.json"
import fontLuckiestGuyJson from "../../MediaObjects/font/luckiest-guy.json"
import fontMonotonJson from "../../MediaObjects/font/monoton.json"
import fontOleoScriptJson from "../../MediaObjects/font/oleo-script.json"
import fontShojumaruJson from "../../MediaObjects/font/shojumaru.json"
import fontRubikDirtJson from "../../MediaObjects/font/rubik-dirt.json"

export const fontFind = (id: string): FontMedia | undefined => {
  const definition = MediaDefaults[FontType].find(object => object.id === id)
  if (definition) return definition as FontMedia
}

export const fontDefinition = (object : FontMediaObject): FontMedia => {
  const { id = DefaultFontId } = object
  const definition = fontFind(id)
  if (definition) return definition 

  const withDefaults = { ...object, type: FontType, id }
  return new FontMediaClass(withDefaults)
}

export const fontDefault = fontDefinition({ id: DefaultFontId, ...fontDefaultJson })

export const fontDefinitionFromId = (id: string): FontMedia => fontDefinition({id})

MediaFactories[FontType] = fontDefinition
MediaDefaults[FontType].push(
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