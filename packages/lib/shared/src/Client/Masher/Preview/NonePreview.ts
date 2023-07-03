import { ClientClips } from '@moviemasher/runtime-client'
import {PreviewClass} from './PreviewClass.js'

export class NonePreview extends PreviewClass {
  protected get clips(): ClientClips { return [] }
}