import { SelectType } from "../Setup/Enums"
import { Mash } from "../Edited/Mash/Mash"
import { Cast } from "../Edited/Cast/Cast"
import { Effect } from "../Media/Effect/Effect"
import { Track } from "../Edited/Mash/Track/Track"
import { Layer } from "../Edited/Cast/Layer/Layer"
import { Clip } from "../Media/Clip/Clip"
import { Content } from "../Content/Content"
import { Container } from "../Container/Container"


export type Selectable = Cast | Mash | Track | Layer | Clip 
export type Selectables = Selectable[]

export interface SelectableRecord extends Record<SelectType, Selectable> { }
export interface EditorSelection extends Partial<SelectableRecord> {
  [SelectType.Cast]?: Cast
  [SelectType.Mash]?: Mash
  [SelectType.Layer]?: Layer
  [SelectType.Track]?: Track
  [SelectType.Clip]?: Clip
  // [SelectType.Effect]?: Effect
}

export interface SelectTypesObject extends Record<string, SelectType[]> {}
