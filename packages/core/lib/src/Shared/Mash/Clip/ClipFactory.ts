import type {Clip} from './Clip.js'
import type { ClipObject } from "./ClipObject.js"

import { SizingContainer, SizingContent, SizingPreview, TimingContainer, TimingContent, TimingCustom } from "../../../Setup/EnumConstantsAndFunctions.js"
import {isUndefined} from '../../SharedGuards.js'
import {ClipClass} from './ClipClass.js'
import {DefaultContentId} from '../../../Helpers/Content/ContentConstants.js'
import {DefaultContainerId} from '../../../Helpers/Container/ContainerConstants.js'

export const clipInstance = (object: ClipObject): Clip => {
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
