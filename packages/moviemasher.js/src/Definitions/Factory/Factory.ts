import { DefinitionType, DefinitionTypes } from "../../Setup/Enums"
import { Factories } from "../../Definitions/Factories"
import { Errors } from "../../Setup/Errors"
import { AudioFactory } from "../../Media/Audio/Audio"
import { EffectFactory } from "../../Media/Effect/Effect"
import { FilterFactory } from "../../Media/Filter/Filter"
import { FontFactory } from "../../Media/Font/Font"
import { ImageFactory } from "../../Media/Image/Image"
import { MergerFactory } from "../../Media/Merger/Merger"
import { ScalerFactory } from "../../Media/Scaler/Scaler"
import { ThemeFactory } from "../../Media/Theme/Theme"
import { TransitionFactory } from "../../Media/Transition/Transition"
import { VideoFactory } from "../../Media/Video/Video"
import { VideoStreamFactory } from "../../Media/VideoStream/VideoStream"
import { VideoSequenceFactory } from "../../Media/VideoSequence/VideoSequence"
import { ContextFactory } from "../../Context/ContextFactory"
import { TrackFactory } from "../../Media/Track/TrackFactory"
import { Definition, DefinitionObject } from "../../Base/Definition"
import { isPopulatedString } from "../../Utilities/Is"

class Factory {
  static get [DefinitionType.Audio]() : AudioFactory {
    const factory = Factories[DefinitionType.Audio]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Audio

    return factory
  }

  static get context(): typeof ContextFactory { return ContextFactory }

  static definitionFromObject(object: DefinitionObject): Definition {
    const { id: definitionId, type } = object
    if (!(type && isPopulatedString(type))) throw Errors.type + definitionId

    const definitionType = <DefinitionType>type
    if (!DefinitionTypes.includes(definitionType)) throw Errors.type + definitionType

    if (!(definitionId && isPopulatedString(definitionId))) {
      throw Errors.invalid.definition.id + JSON.stringify(object)
    }
    return this[definitionType].definition(object)
  }

  static definitionsFromObjects(objects: DefinitionObject[]): Definition[] {
    return objects.map(object => this.definitionFromObject(object))
  }


  static get [DefinitionType.Effect]() : EffectFactory {
    const factory = Factories[DefinitionType.Effect]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Effect

    return factory
  }

  static get [DefinitionType.Filter]() : FilterFactory {
    const factory = Factories[DefinitionType.Filter]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Filter

    return factory
  }

  static get [DefinitionType.Font]() : FontFactory {
    const factory = Factories[DefinitionType.Font]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Font

    return factory
  }

  static get [DefinitionType.Image]() : ImageFactory {
    const factory = Factories[DefinitionType.Image]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Image

    return factory
  }

  static get [DefinitionType.Merger]() : MergerFactory {
    const factory = Factories[DefinitionType.Merger]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Merger

    return factory
  }

  static get [DefinitionType.Scaler]() : ScalerFactory {
    const factory = Factories[DefinitionType.Scaler]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Scaler

    return factory
  }

  static get [DefinitionType.Theme]() : ThemeFactory {
    const factory = Factories[DefinitionType.Theme]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Theme

    return factory
  }

  static get [DefinitionType.Transition]() : TransitionFactory {
    const factory = Factories[DefinitionType.Transition]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Transition

    return factory
  }

  static get track(): typeof TrackFactory { return TrackFactory }

  static get [DefinitionType.Video]() : VideoFactory {
    const factory = Factories[DefinitionType.Video]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Video

    return factory
  }

  static get [DefinitionType.VideoSequence]() : VideoSequenceFactory {
    const factory = Factories[DefinitionType.VideoSequence]
    if (!factory) throw Errors.invalid.factory + DefinitionType.VideoSequence

    return factory
  }

  static get [DefinitionType.VideoStream]() : VideoStreamFactory {
    const factory = Factories[DefinitionType.VideoStream]
    if (!factory) throw Errors.invalid.factory + DefinitionType.VideoStream

    return factory
  }
  private constructor() {}
}

export { Factory }
