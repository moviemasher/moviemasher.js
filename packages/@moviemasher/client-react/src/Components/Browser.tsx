import { createComponent } from '@lit/react'
import { BrowserElement, BrowserTag } from '@moviemasher/client-lib/browser/browser.js'
import React from 'react'
/** @category Components */
export const Browser = createComponent({ tagName: BrowserTag, elementClass: BrowserElement, react: React })