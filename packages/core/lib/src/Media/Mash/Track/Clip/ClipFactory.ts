import {Sizing, Timing} from '../../../../Setup/Enums.js'
import {isUndefined} from '../../../../Utility/Is.js'
import {Clip, ClipArgs} from './Clip.js'
import {ClipClass} from './ClipClass.js'
import {DefaultContentId} from '../../../Content/ContentConstants.js'
import {DefaultContainerId} from '../../../Container/ContainerConstants.js'

export const clipInstance = (object: ClipArgs): Clip => {
  const { containerId, contentId } = object
  const defaultContent = isUndefined(contentId) || contentId === DefaultContentId
  const defaultContainer = isUndefined(containerId) || containerId === DefaultContainerId
  if (object.sizing === Sizing.Content && defaultContent) {
    // console.log('instanceArgs setting sizing to container', object)
    object.sizing = Sizing.Container
  }
  if (object.sizing === Sizing.Container && defaultContainer) {
    // console.log('instanceArgs setting sizing to preview', object)
    object.sizing = Sizing.Preview
  }
  if (object.timing === Timing.Content && defaultContent) {
    object.timing = Timing.Container
  }
  if (object.timing === Timing.Container && defaultContainer) {
    object.timing = Timing.Custom
  }
  
  return new ClipClass(object)
}
