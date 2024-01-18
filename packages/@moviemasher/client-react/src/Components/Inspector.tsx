import { createComponent } from '@lit/react'
import { InspectorElement, InspectorTag } from '@moviemasher/client-lib/inspector/inspector.js'
import React from 'react'
/** @category Components */
export const Inspector = createComponent({ tagName: InspectorTag, elementClass: InspectorElement, react: React })