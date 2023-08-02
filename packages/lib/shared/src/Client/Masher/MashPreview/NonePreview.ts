import { ClientClips } from '@moviemasher/runtime-client'
import {MashPreviewClass} from './MashPreviewClass.js'

export class NonePreview extends MashPreviewClass {
  protected get clips(): ClientClips { return [] }
}