import {UnknownRecord} from '../../Types/Core.js'
import {TypeMash} from '../../Setup/Enums.js'
import {idTemporary} from '../../Utility/Id.js'
import {Size} from '../../Utility/Size.js'
import {MediaFactories} from '../MediaFactories.js'
import {MashMasherArgs, MashMedia, MashMediaArgs, MashMediaContent, MashMediaObject} from './Mash.js'
import {MashMediaClass} from './MashMediaClass.js'

export const mashDefault: MashMediaObject = { type: TypeMash, id: '', request: { response: {} } }


export const mashMedia = (object: MashMediaObject, args?: MashMasherArgs | Size): MashMedia => {
  const mashArgs: MashMediaArgs = { 
    request: { response: {} }, type: TypeMash, ...object 
  }
  return new MashMediaClass(mashArgs, args)
}

export const mashInstance = (object: MashMediaObject): MashMedia => {
  return new MashMediaClass(object)
}

MediaFactories[TypeMash] = mashInstance