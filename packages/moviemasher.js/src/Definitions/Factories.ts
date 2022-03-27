import { DefinitionType } from "../Setup/Enums"
import { AudioFactory } from "../Media/Audio/Audio"
import { EffectFactory } from "../Media/Effect/Effect"
import { FilterFactory } from "../Media/Filter/Filter"
import { FontFactory } from "../Media/Font/Font"
import { ImageFactory } from "../Media/Image/Image"
import { MergerFactory } from "../Media/Merger/Merger"
import { ScalerFactory } from "../Media/Scaler/Scaler"
import { ThemeFactory } from "../Media/Theme/Theme"
import { TransitionFactory } from "../Media/Transition/Transition"
import { VideoFactory } from "../Media/Video/Video"
import { VideoStreamFactory } from "../Media/VideoStream/VideoStream"
import { VideoSequenceFactory } from "../Media/VideoSequence/VideoSequence"

type FactoryObject = {
  [DefinitionType.Filter]?: FilterFactory
  [DefinitionType.Audio]?: AudioFactory
  [DefinitionType.Effect]?: EffectFactory
  [DefinitionType.Font]?: FontFactory
  [DefinitionType.Image]?: ImageFactory
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
