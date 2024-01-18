import { createComponent } from '@lit/react'
import { WordElement, WordTag } from '@moviemasher/client-lib/component/word.js'
import React from 'react'
/** @category Components */
export const Word = createComponent({ tagName: WordTag, elementClass: WordElement, react: React })