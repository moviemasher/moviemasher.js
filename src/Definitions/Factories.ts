import { DefinitionType } from "../Setup/Enums"
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
import { VideoStreamFactory } from "../Mash/VideoStream/VideoStream"
import { VideoSequenceFactory } from "../Mash/VideoSequence/VideoSequence"

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
