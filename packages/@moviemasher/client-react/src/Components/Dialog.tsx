import { createComponent } from '@lit/react'
import { DialogElement, DialogTag } from '@moviemasher/client-lib/component/dialog.js'
import React from 'react'
/** @category Components */
export const Dialog = createComponent({ tagName: DialogTag, elementClass: DialogElement, react: React })