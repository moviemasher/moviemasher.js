import { Labeled } from '@moviemasher/runtime-shared'
import { InstanceObject } from '../../Instance/Instance.js'

export interface ClipObject extends Labeled {
  containerId?: string
  contentId?: string
  content?: InstanceObject
  container?: InstanceObject
  frame?: number
  timing?: string
  sizing?: string
  frames?: number
}
