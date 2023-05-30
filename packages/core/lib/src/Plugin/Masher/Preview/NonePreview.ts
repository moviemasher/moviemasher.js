import { ClientClips } from '../../../Client/Mash/MashClientTypes.js'
import {PreviewClass} from './PreviewClass.js'

export class NonePreview extends PreviewClass {
  protected get clips(): ClientClips { return [] }
}