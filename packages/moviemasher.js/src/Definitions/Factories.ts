import { DefinitionType } from "../Setup/Enums"
import { AudioFactory } from "../Media/Audio/Audio"
import { EffectFactory } from "../Media/Effect/Effect"
import { FilterFactory } from "../Filter/Filter"
import { FontFactory } from "../Media/Font/Font"
import { ImageFactory } from "../Media/Image/Image"
import { VideoFactory } from "../Media/Video/Video"
import { VideoSequenceFactory } from "../Media/VideoSequence/VideoSequence"
import { VisibleClipFactory } from "../Media/VisibleClip/VisibleClip"
import { ShapeContainerFactory } from "../Container/ShapeContainer/ShapeContainer"
import { ColorContentFactory } from "../Content/ColorContent/ColorContent"
import { TextContainerFactory } from "../Container/TextContainer/TextContainer"
import { ContentFactory } from "../Content/Content"
import { ContainerFactory } from "../Container/Container"

export type FactoryObject = {
  [DefinitionType.Audio]?: AudioFactory
  [DefinitionType.ColorContent]?: ColorContentFactory
  [DefinitionType.Content]?: ContentFactory
  [DefinitionType.Effect]?: EffectFactory
  [DefinitionType.Filter]?: FilterFactory
  [DefinitionType.Font]?: FontFactory
  [DefinitionType.Image]?: ImageFactory
  [DefinitionType.Container]?: ContainerFactory
  [DefinitionType.ShapeContainer]?: ShapeContainerFactory
  [DefinitionType.TextContainer]?: TextContainerFactory
  [DefinitionType.Video]?: VideoFactory
  [DefinitionType.VideoSequence]?: VideoSequenceFactory
  [DefinitionType.Visible]?: VisibleClipFactory
  [DefinitionType.Clip]?: VisibleClipFactory
}

export const Factories : FactoryObject = {}
