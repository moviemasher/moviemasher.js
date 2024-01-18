import { createComponent } from '@lit/react'
import { ImporterElement, ImporterTag } from '@moviemasher/client-lib/importer/importer.js'
import React from 'react'
/** @category Components */
export const Importer = createComponent({ tagName: ImporterTag, elementClass: ImporterElement, react: React })