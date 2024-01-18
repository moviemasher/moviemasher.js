import { createComponent } from '@lit/react'
import { TimelineElement, TimelineTag } from '@moviemasher/client-lib/timeline/timeline.js'
import React from 'react'
/** @category Components */
export const Timeline = createComponent({ tagName: TimelineTag, elementClass: TimelineElement, react: React })