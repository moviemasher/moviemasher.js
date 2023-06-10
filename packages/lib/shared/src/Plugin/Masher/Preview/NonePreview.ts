import { ClientClips } from '../../../Client/Mash/ClientMashTypes.js'
import {PreviewClass} from './PreviewClass.js'

export class NonePreview extends PreviewClass {
  protected get clips(): ClientClips { return [] }
}