import type { ClientImporter } from '../../types.js'
import type { CSSResultGroup } from 'lit'
import type { AssetObject, AssetObjects, DataOrError, ListenersFunction, Resource, Scanning, TextAssetObject } from '@moviemasher/shared-lib/types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { html } from 'lit-html'
import { EventImporterNodeFunction, EventImport, EventImporterAdd, EventImporterError } from '../../utility/events.js'
import { ERROR, $IMAGE, $TEXT, errorCaught, idGenerateString, isDefiniteError, namedError, pathExtension, $CSS, $SCAN } from '@moviemasher/shared-lib/runtime.js'
import { Component, ComponentLoader } from '../../base/component.js'
import { MOVIE_MASHER } from '@moviemasher/shared-lib/runtime.js'
import { svgStringElement } from '@moviemasher/shared-lib/utility/svg.js'
import { familyFromCss, urlFromCss } from '@moviemasher/shared-lib/utility/request.js'

const ClientTextUrl = 'https://fonts.googleapis.com/css2?family='

const fileMedia = (_: File): Promise<AssetObject | void> => {
  return Promise.resolve()
}

export const ClientTextTag = 'movie-masher-importer-text'
const EventClientText = 'client-text'

interface CssUrlFamily {
  clientUrl: string
  cssUrl: string
  family: string
}
export class ClientTextElement extends ComponentLoader {
  override connectedCallback(): void {
    this.listeners[EventClientText] = this.handleClientText.bind(this)
    super.connectedCallback()
  }

  private async cssUrlPromise(label: string): Promise<DataOrError<CssUrlFamily>> {
    
    const endpoint = `${ClientTextUrl}${encodeURIComponent(label)}`
    // console.log('cssUrlPromise', {endpoint})

    const response = await fetch(endpoint).catch(error => errorCaught(error))
    if (isDefiniteError(response)) return response
    const cssText = await response.text()

    if (!cssText) return namedError(ERROR.Url, endpoint)
    // console.log(cssText)

    const url = urlFromCss(cssText)
    if (!url) return namedError(ERROR.Url, cssText)

    const family = familyFromCss(cssText)
    const data = { cssUrl: endpoint, family, clientUrl: url }
    console.log('cssUrlPromise', { data })
    return { data }
  }

  private handleSubmit(event: Event): void {
    console.log('handleSubmit', event)
    // event.stopImmediatePropagation()
    event.preventDefault()
    this.handleClientText(event)
  }

  private async handleClientText(event: Event): Promise<void> {
    event.stopPropagation()
    const input = this.element<HTMLInputElement>('input')
    if (!input) return

    const { value: label } = input
    if (!label) return

    const endpointOrError = await this.cssUrlPromise(label)
    if (isDefiniteError(endpointOrError)) {
      MOVIE_MASHER.dispatch(new EventImporterError(endpointOrError))
      return 
    }

    const { data: { cssUrl, family, clientUrl} } = endpointOrError
    const scanning: Scanning = { type: $SCAN, data: { family } }

    const cssResource: Resource = { type: $CSS, request: { endpoint: cssUrl } }
    const type = pathExtension(clientUrl)
    const clientResource: Resource = { type, request: { endpoint: clientUrl } }
    const object: TextAssetObject = {
      id: idGenerateString(), 
      decodings: [scanning],
      resources: [cssResource, clientResource],
      label, type: $IMAGE, source: $TEXT,  
    }
    MOVIE_MASHER.dispatch(new EventImporterAdd(object))
  }

  protected override render(): unknown {
    this.loadComponent('movie-masher-button')
    return html`<form class='contents' @submit='${this.handleSubmit}'>
      <div>Please enter the exact name of a Google font:</div>
      <input name='text' type='search' />
      <movie-masher-button 
        string='search' icon='search'
        emit='${EventClientText}'
        ></movie-masher-button>
  </form>`
  }
  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    css`
      :host {
        --ratio-preview-selector: var(--ratio-preview, 0.25);
        --pad: var(--pad-content);
        --gap: var(--gap-content);
      }
      form.contents {
        padding: var(--pad);
      }

      form.contents > * {
        margin-right: var(--gap); 
        margin-bottom: var(--gap);
      }
    `
  ]
}

declare global {
  interface HTMLElementTagNameMap {
    [ClientTextTag]: ClientTextElement
  }
}

customElements.define(ClientTextTag, ClientTextElement)

const Icon = "<svg stroke='currentColor' fill='currentColor' stroke-width='0' role='img' viewBox='0 0 24 24' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'><title></title><path d='M4 2.8A3.6 3.6 0 1 0 4 10a3.6 3.6 0 0 0 0-7.2zm7.6 0v18.4h7.2a5.2 5.2 0 1 1 0-10.4 4 4 0 1 1 0-8zm7.2 0v8a4 4 0 1 0 0-8zm0 8v10.4A5.2 5.2 0 0 0 24 16a5.2 5.2 0 0 0-5.2-5.2zm-7.7-7.206L0 21.199h8.8l2.3-3.64Z'></path></svg>"

export class TextClientImporter implements ClientImporter {
  label = 'Text'
  id = ClientTextTag
  get canImport(): boolean {
    return true
  }

  private _icon?: Node
  get icon(): Node {
    return this._icon ||= svgStringElement(Icon)!
  }

  import(): void {}

  private _ui?: ClientTextElement
  ui(): Node {
    // console.log(this.id, 'ui')
    const { document } = MOVIE_MASHER.window
    return this._ui ||= document.createElement(ClientTextTag)
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
  
  static handleImporters(event: EventImporterNodeFunction) {
    const { detail } = event
    const { map, types, sources } = detail
    // console.log('handleImporters', { types, sources })
    if (types.length && !types.includes($IMAGE)) return
    if (sources.length && !sources.includes($TEXT)) return

    const { instance } = TextClientImporter
    map.set(instance.icon, instance.ui.bind(instance))
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
export const ClientTextImportListeners: ListenersFunction = () => ({
  [EventImporterNodeFunction.Type]: TextClientImporter.handleImporters,
  [EventImport.Type]: TextClientImporter.handleImport,
})

