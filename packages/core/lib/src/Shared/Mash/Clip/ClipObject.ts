import { InstanceObject } from '../../Instance/Instance.js'

export interface ClipObject  {//extends UnknownRecord
  containerId?: string
  contentId?: string
  content?: InstanceObject
  container?: InstanceObject
  frame?: number
  timing?: string
  sizing?: string
  frames?: number
  label?: string
}
