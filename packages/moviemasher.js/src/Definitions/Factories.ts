import { DefinitionType } from "../Setup/Enums"
import { AudioFactory } from "../Media/Audio/Audio"
import { EffectFactory } from "../Media/Effect/Effect"
import { FilterFactory } from "../Filter/Filter"
import { FontFactory } from "../Media/Font/Font"
import { ImageFactory } from "../Media/Image/Image"
import { VideoFactory } from "../Media/Video/Video"
import { VideoSequenceFactory } from "../Media/VideoSequence/VideoSequence"
import { ClipFactory } from "../Edited/Mash/Track/Clip/Clip"
import { ContentFactory } from "../Content/Content"
import { ContainerFactory } from "../Container/Container"

export type FactoryObject = {
  [DefinitionType.Audio]?: AudioFactory
  [DefinitionType.Content]?: ContentFactory
  [DefinitionType.Effect]?: EffectFactory
  [DefinitionType.Filter]?: FilterFactory
  [DefinitionType.Font]?: FontFactory
  [DefinitionType.Image]?: ImageFactory
  [DefinitionType.Container]?: ContainerFactory
  [DefinitionType.Video]?: VideoFactory
  [DefinitionType.VideoSequence]?: VideoSequenceFactory
  [DefinitionType.Clip]?: ClipFactory
}

export const Factories : FactoryObject = {}
