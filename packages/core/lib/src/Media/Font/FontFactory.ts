import {TypeFont} from '../../Setup/Enums.js'
import {FontMediaClass} from './FontMediaClass.js'
import {DefaultFontId, FontMedia, FontMediaObject} from './Font.js'
import {MediaFactories} from '../MediaFactories.js'
import {MediaDefaults} from '../MediaDefaults.js'

import { ProtocolHttps } from '../../Plugin/index.js'

export const fontFind = (id: string): FontMedia | undefined => {
  const definition = MediaDefaults[TypeFont].find(object => object.id === id)
  if (definition) return definition as FontMedia
}

export const fontDefinition = (object : FontMediaObject): FontMedia => {
  const { id = DefaultFontId } = object
  const definition = fontFind(id)
  if (definition) return definition 

  const withDefaults = { ...object, type: TypeFont, id }
  return new FontMediaClass(withDefaults)
}

export const fontDefault = fontDefinition({ 
  id: DefaultFontId, 
  label: "League Spartan",
  type: TypeFont,
  request: { 
    endpoint: { 
      protocol: ProtocolHttps,
      hostname: "fonts.googleapis.com", 
      pathname: "/css2", 
      search: "?family=League+Spartan" 
    } 
  }
})

export const fontDefinitionFromId = (id: string): FontMedia => fontDefinition({id})

MediaFactories[TypeFont] = fontDefinition
MediaDefaults[TypeFont].push(fontDefault)