import { createComponent } from '@lit/react'
import { TimelineTrackElement, TimelineTrackTag } from '@moviemasher/client-lib/timeline/timeline-track.js'
import React from 'react'
/** @category Components */
export const TimelineTrack = createComponent({ tagName: TimelineTrackTag, elementClass: TimelineTrackElement, react: React })