import { DefinitionType } from "../Setup/Enums"
import { Factories } from "../Mash/Factories/Factories"
import { Errors } from "../Setup/Errors"
import { AudioFactory } from "../Mash/Audio/Audio"
import { EffectFactory } from "../Mash/Effect/Effect"
import { FilterFactory } from "../Mash/Filter/Filter"
import { FontFactory } from "../Mash/Font/Font"
import { ImageFactory } from "../Mash/Image/Image"
import { MergerFactory } from "../Mash/Merger/Merger"
import { ScalerFactory } from "../Mash/Scaler/Scaler"
import { ThemeFactory } from "../Mash/Theme/Theme"
import { TransitionFactory } from "../Mash/Transition/Transition"
import { VideoFactory } from "../Mash/Video/Video"
import { MashFactory } from "../Mash/Mash/Mash"
import { MasherFactory } from "../Mash/Masher/Masher"

/**
 * Provides access to factory objects that create all other object definitions and instances.
 *
 * @example Create {@link Masher} instance and bind to a CANVAS element
 * ```ts
 * const canvas : ContextElement = document.getElementById('moviemasher-canvas')
 * const masher : Masher = MovieMasher.masher.instance({ canvas })
 * ```
 * @sealed
 */
class MovieMasher {
  /**
   * Object with methods to create audio definitions and instances
   */
  static get [DefinitionType.Audio]() : AudioFactory {
    const factory = Factories[DefinitionType.Audio]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Audio

    return factory
  }

  /**
   * Object with methods to create effect definitions and instances
   */
  static get [DefinitionType.Effect]() : EffectFactory {
    const factory = Factories[DefinitionType.Effect]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Effect

    return factory
  }

  /**
   * Object with methods to create audio definitions and instances
   */
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

  static get [DefinitionType.Mash]() : MashFactory {
    const factory = Factories[DefinitionType.Mash]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Mash

    return factory
  }

  static get [DefinitionType.Masher]() : MasherFactory {
    const factory = Factories[DefinitionType.Masher]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Masher

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

  static get [DefinitionType.Video]() : VideoFactory {
    const factory = Factories[DefinitionType.Video]
    if (!factory) throw Errors.invalid.factory + DefinitionType.Video

    return factory
  }

  private constructor() {}
}



export { MovieMasher }
