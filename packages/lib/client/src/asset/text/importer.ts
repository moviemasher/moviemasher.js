import type { ClientImporter } from '@moviemasher/runtime-client'
import type { ImportersEventDetail } from '../../declarations.js'

import { EventTypeImporters } from '@moviemasher/runtime-shared'
import { MovieMasher } from '@moviemasher/runtime-client'

class ClientTextImporter implements ClientImporter {
  label = 'Text'
  id = 'importer-text'
  get canImport(): boolean {
    return true
  }
  import(): void {
  }
  get icon(): Node {
    const cleaned = "<svg version='1.1' stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'><path fill='none' d='M0 0h24v24H0z'></path><path d='M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z'></path></svg>"

    const parser = new DOMParser()
    const document = parser.parseFromString(cleaned, 'image/svg+xml')
    const [firstChild] = document.children
    return firstChild
  }

  private _ui?: Node
  get ui(): Node {
    console.log(this.id, 'ui')
    return this._ui ||= globalThis.document.createTextNode('Text UI')
  }
}
const clientTextImporter = new ClientTextImporter()
// listen for importers event
MovieMasher.eventDispatcher.addDispatchListener<ImportersEventDetail>(EventTypeImporters, event => {
  const { detail } = event
  const { importers } = detail
  importers.push(clientTextImporter)
})

export {}