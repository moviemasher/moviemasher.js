import { createComponent } from '@lit/react'
import { TimelineContentElement, TimelineContentTag } from '@moviemasher/client-lib/timeline/timeline-content.js'
import React from 'react'
/** @category Components */
export const TimelineContent = createComponent({ tagName: TimelineContentTag, elementClass: TimelineContentElement, react: React })