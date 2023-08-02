import type { Labeled } from './Base.js'
import type { InstanceObject } from './InstanceTypes.js'

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
