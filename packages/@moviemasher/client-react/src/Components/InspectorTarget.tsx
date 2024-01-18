import { createComponent } from '@lit/react'
import { InspectorTargetElement, InspectorTargetTag } from '@moviemasher/client-lib/inspector/inspector-target.js'
import React from 'react'
/** @category Components */
export const InspectorTarget = createComponent({ tagName: InspectorTargetTag, elementClass: InspectorTargetElement, react: React })