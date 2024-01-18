import { createComponent } from '@lit/react'
import { BrowserContentElement, BrowserContentTag } from '@moviemasher/client-lib/browser/browser-content.js'
import React from 'react'
/** @category Components */
export const BrowserContent = createComponent({ tagName: BrowserContentTag, elementClass: BrowserContentElement, react: React })