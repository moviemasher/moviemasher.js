import { createComponent } from '@lit/react'
import { InspectorPickerElement, InspectorPickerTag } from '@moviemasher/client-lib/inspector/inspector-picker.js'
import React from 'react'
/** @category Components */
export const InspectorPicker = createComponent({ tagName: InspectorPickerTag, elementClass: InspectorPickerElement, react: React })