import { createComponent } from '@lit/react'
import { TimelineHeaderElement, TimelineHeaderTag } from '@moviemasher/client-lib/timeline/timeline-header.js'
import React from 'react'
/** @category Components */
export const TimelineHeader = createComponent({ tagName: TimelineHeaderTag, elementClass: TimelineHeaderElement, react: React })