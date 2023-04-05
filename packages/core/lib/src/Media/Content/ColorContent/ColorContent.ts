import type { Time, TimeRange } from '../../../Helpers/Time/Time.js'
import type { ColorTuple } from '../../../Base/Code.js'
import type {
  Content, ContentDefinition, ContentDefinitionObject, ContentObject
} from '../Content.js'

export interface ColorContentObject extends ContentObject {
  color?: string
}

export interface ColorContentDefinitionObject extends ContentDefinitionObject {
  color?: string
}

export interface ColorContent extends Content {
  color: string
  contentColors(time: Time, range: TimeRange): ColorTuple
  definition: ColorContentDefinition
}

export interface ColorContentDefinition extends ContentDefinition {
  color: string
  instanceFromObject(object?: ColorContentObject): ColorContent
}

