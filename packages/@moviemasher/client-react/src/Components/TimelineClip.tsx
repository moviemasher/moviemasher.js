import { createComponent } from '@lit/react'
import { TimelineClipElement, TimelineClipTag } from '@moviemasher/client-lib/timeline/timeline-clip.js'
import React from 'react'
/** @category Components */
export const TimelineClip = createComponent({ tagName: TimelineClipTag, elementClass: TimelineClipElement, react: React })