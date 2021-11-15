import { DefinitionType } from "../../Setup/Enums"
import { AudioFactory } from "../Audio/Audio"
import { EffectFactory } from "../Effect/Effect"
import { FilterFactory } from "../Filter/Filter"
import { FontFactory } from "../Font/Font"
import { ImageFactory } from "../Image/Image"
import { MashFactory } from "../Mash/Mash"
import { MergerFactory } from "../Merger/Merger"
import { ScalerFactory } from "../Scaler/Scaler"
import { ThemeFactory } from "../Theme/Theme"
import { TransitionFactory } from "../Transition/Transition"
import { VideoFactory } from "../Video/Video"
import { MasherFactory } from "../Masher/Masher"
import { VideoStreamFactory } from "../VideoStream/VideoStream"
import { VideoSequenceFactory } from "../VideoSequence/VideoSequence"

type FactoryObject = {
  [DefinitionType.Filter]?: FilterFactory
  [DefinitionType.Audio]?: AudioFactory
  [DefinitionType.Effect]?: EffectFactory
  [DefinitionType.Font]?: FontFactory
  [DefinitionType.Image]?: ImageFactory
  [DefinitionType.Mash]?: MashFactory
  [DefinitionType.Masher]?: MasherFactory
  [DefinitionType.Merger]?: MergerFactory
  [DefinitionType.Scaler]?: ScalerFactory
  [DefinitionType.Theme]?: ThemeFactory
  [DefinitionType.Transition]?: TransitionFactory
  [DefinitionType.Video]?: VideoFactory
  [DefinitionType.VideoSequence]?: VideoSequenceFactory
  [DefinitionType.VideoStream]?: VideoStreamFactory
}

const Factories : FactoryObject = {}

export { Factories, FactoryObject }
