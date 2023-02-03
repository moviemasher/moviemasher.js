import { DefinitionType, MediaDefinitionType } from "../Setup/Enums";
import { Medias } from "./Media";

export const MediaDefaults: Record<MediaDefinitionType, Medias> = {
  [DefinitionType.Audio]: [],
  [DefinitionType.Font]: [],
  [DefinitionType.Image]: [],
  [DefinitionType.Video]: [],
  [DefinitionType.VideoSequence]: []
}
