import type {Clip, ClipArgs} from './Clip.js'

import {SizingContainer, SizingContent, SizingPreview, TimingContainer, TimingContent, TimingCustom} from '../../../../Setup/Enums.js'
import {isUndefined} from '../../../../Utility/Is.js'
import {ClipClass} from './ClipClass.js'
import {DefaultContentId} from '../../../Content/ContentConstants.js'
import {DefaultContainerId} from '../../../Container/ContainerConstants.js'

export const clipInstance = (object: ClipArgs): Clip => {
  const { containerId, contentId } = object
  const defaultContent = isUndefined(contentId) || contentId === DefaultContentId
  const defaultContainer = isUndefined(containerId) || containerId === DefaultContainerId
  if (object.sizing === SizingContent && defaultContent) {
    // console.log('instanceArgs setting sizing to container', object)
    object.sizing = SizingContainer
  }
  if (object.sizing === SizingContainer && defaultContainer) {
    // console.log('instanceArgs setting sizing to preview', object)
    object.sizing = SizingPreview
  }
  if (object.timing === TimingContent && defaultContent) {
    object.timing = TimingContainer
  }
  if (object.timing === TimingContainer && defaultContainer) {
    object.timing = TimingCustom
  }
  
  return new ClipClass(object)
}
