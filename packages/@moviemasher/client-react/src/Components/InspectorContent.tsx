import { createComponent } from '@lit/react'
import { InspectorContentElement, InspectorContentTag } from '@moviemasher/client-lib/inspector/inspector-content.js'
import React from 'react'
/** @category Components */
export const InspectorContent = createComponent({ tagName: InspectorContentTag, elementClass: InspectorContentElement, react: React })