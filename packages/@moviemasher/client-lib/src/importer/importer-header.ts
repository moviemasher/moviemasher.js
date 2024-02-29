import type { Htmls, OptionalContent } from '../client-types.js'

import { HeaderBase } from '../base/component-view.js'
import { $IMPORTER } from '@moviemasher/shared-lib/runtime.js'
import { html } from 'lit-html'
import { IMPORT_TYPES } from '@moviemasher/shared-lib/runtime.js'
import { ComponentSlotter } from '../base/component.js'

export const ImporterHeaderTag = 'movie-masher-importer-header'

/**
 * @category Elements
 */
export class ImporterHeaderElement extends HeaderBase {
  protected override leftContent(slots: Htmls): OptionalContent {
    const htmls = [...slots]
    this.loadComponent('movie-masher-picker')
    htmls.push(html`
      <movie-masher-picker 
        parts='${IMPORT_TYPES.join(ComponentSlotter.partSeparator)}' 
        picker='${$IMPORTER}'
        selected='video-raw'
        ></movie-masher-picker>
    `)
    return super.leftContent(htmls) 
  }
}

customElements.define(ImporterHeaderTag, ImporterHeaderElement)