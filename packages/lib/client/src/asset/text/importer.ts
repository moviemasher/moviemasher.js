import type { ClientImporter } from '@moviemasher/runtime-client'
import type { CSSResultGroup } from 'lit'

import { css } from '@lit/reactive-element/css-tag.js'
import { EventImporters, EventImport } from '@moviemasher/runtime-client'
import { AssetObject, AssetObjects } from '@moviemasher/runtime-shared'

const fileMedia = (_: File): Promise<AssetObject | void> => {
  return Promise.resolve()
}

export class TextClientImporter implements ClientImporter {
  label = 'Text'
  id = 'importer-text'
  get canImport(): boolean {
    return true
  }
  get icon(): Node {
    const cleaned = "<svg version='1.1' stroke='currentColor' fill='currentColor' stroke-width='0' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'><path fill='none' d='M0 0h24v24H0z'></path><path d='M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z'></path></svg>"
    const parser = new DOMParser()
    const document = parser.parseFromString(cleaned, 'image/svg+xml')
    const [firstChild] = document.children
    return firstChild
  }

  import(): void {}

  private _ui?: Node
  get ui(): Node {
    // console.log(this.id, 'ui')
    return this._ui ||= globalThis.document.createTextNode('Text UI')
  }


  static handleImport (event: EventImport) {
    const { detail } = event
    const { fileList } = detail
    const objects: AssetObjects = []

    const [file, ...rest] = Array.from(fileList)
    let promise = fileMedia(file)
    rest.forEach(file => {
      promise = promise.then(object => {
        if (object) objects.push(object)
        return fileMedia(file)
      })
    })
    detail.promise = promise.then(object => {
      if (object) objects.push(object)

      return objects
    })
    event.stopPropagation()
  }
  
  static handleImporters(event: EventImporters) {
    const { detail } = event
    const { importers } = detail
    importers.push(TextClientImporter.instance)
  }

  private static _instance?: TextClientImporter
  static get instance(): TextClientImporter {
    return this._instance ||= new TextClientImporter()
  }

  static styles: CSSResultGroup = [
    // Component.cssBorderBoxSizing,
    css`
    :host {
      padding: var(--pad);
    }
  `]
}

// listen for import related events
export const ClientTextImportListeners = () => ({
  [EventImporters.Type]: TextClientImporter.handleImporters,
  [EventImport.Type]: TextClientImporter.handleImport,
})

