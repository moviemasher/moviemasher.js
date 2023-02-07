import { DefinitionType } from "../Setup/Enums";
import { Medias } from "./Media";

export const MediaDefaults: Record<DefinitionType, Medias> = {
  [DefinitionType.Audio]: [],
  [DefinitionType.Effect]: [],
  [DefinitionType.Font]: [],
  [DefinitionType.Image]: [],
  [DefinitionType.Mash]: [],
  [DefinitionType.Sequence]: [],
  [DefinitionType.Video]: [],
}
