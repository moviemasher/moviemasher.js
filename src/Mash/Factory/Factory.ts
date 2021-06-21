import { DefinitionType } from "../../Setup/Enums"
import { Factories, FactoryObject } from "../Factories/Factories"
import { Errors } from "../../Setup/Errors"
import { AudioFactory } from "../Audio/Audio"
import { EffectFactory } from "../Effect/Effect"
import { FilterFactory } from "../Filter/Filter"
import { FontFactory } from "../Font/Font"
import { ImageFactory } from "../Image/Image"
import { MergerFactory } from "../Merger/Merger"
import { ScalerFactory } from "../Scaler/Scaler"
import { ThemeFactory } from "../Theme/Theme"
import { TransitionFactory } from "../Transition/Transition"
import { VideoFactory } from "../Video/Video"
import { MashFactory } from "../Mash/Mash"


class FactoryClass implements Readonly <Required <FactoryObject>> {
  get [DefinitionType.Audio]() : AudioFactory {
    const factory = Factories[DefinitionType.Audio]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Audio

    return factory
  }

  get [DefinitionType.Effect]() : EffectFactory {
    const factory = Factories[DefinitionType.Effect]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Effect

    return factory
  }

  get [DefinitionType.Filter]() : FilterFactory {
    const factory = Factories[DefinitionType.Filter]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Filter

    return factory
  }

  get [DefinitionType.Font]() : FontFactory {
    const factory = Factories[DefinitionType.Font]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Font

    return factory
  }

  get [DefinitionType.Image]() : ImageFactory {
    const factory = Factories[DefinitionType.Image]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Image

    return factory
  }

  get [DefinitionType.Mash]() : MashFactory {
    const factory = Factories[DefinitionType.Mash]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Mash

    return factory
  }

  get [DefinitionType.Merger]() : MergerFactory {
    const factory = Factories[DefinitionType.Merger]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Merger

    return factory
  }

  get [DefinitionType.Scaler]() : ScalerFactory {
    const factory = Factories[DefinitionType.Scaler]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Scaler

    return factory
  }

  get [DefinitionType.Theme]() : ThemeFactory {
    const factory = Factories[DefinitionType.Theme]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Theme

    return factory
  }

  get [DefinitionType.Transition]() : TransitionFactory {
    const factory = Factories[DefinitionType.Transition]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Transition

    return factory
  }

  get [DefinitionType.Video]() : VideoFactory {
    const factory = Factories[DefinitionType.Video]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Video

    return factory
  }
}

const Factory = new FactoryClass()

export { Factory }
