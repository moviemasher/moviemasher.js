import type { AssetObject } from '@moviemasher/runtime-shared'
import type { ClientAsset } from '@moviemasher/runtime-client'
import type { CSSResultGroup, PropertyValues } from 'lit'

import type { AssetObjectFromIdEventDetail, Htmls } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'

import { html } from 'lit-html/lit-html.js'
import { nothing } from 'lit-html/lit-html.js'

import { MovieMasher, EventTypeSelectAssetObject, isClientAsset, EventTypeAssetObjectFromId } from '@moviemasher/runtime-client'

import { Component } from '../Base/Component.js'

export class SelectorSpanElement extends Component {
  // override async getUpdateComplete(): Promise<boolean> {
  //   return super.getUpdateComplete().then(complete => {
  //     if (!complete) {
  //       console.log(this.constructor.name, 'getUpdateComplete SUPER', complete)
  //       return false
  //     }
  //     const { iconPromise } = this
  //     if (iconPromise) return iconPromise.then(() => {
  //       console.log(this.constructor.name, 'getUpdateComplete iconPromise', complete)

  //       return true
  //     })
  //   console.log(this.constructor.name, 'getUpdateComplete NO iconPromise')

  //     return true
  //     // const { clientAssetPromise } = this
  //     // if (!clientAssetPromise) return false

  //     // return clientAssetPromise.then(() => true)
  //   })
  // }
  assetId = ''

  icon?: SVGSVGElement | undefined
  
  private clientAsset?: ClientAsset | undefined

  private _clientAssetPromise?: Promise<ClientAsset | undefined>
  private get clientAssetPromise() {
    return this._clientAssetPromise ||= this.clientAssetPromiseInitialize
  }
  private get clientAssetPromiseInitialize(): Promise<ClientAsset | undefined> {
    const { assetObject } = this
    if (!assetObject) return Promise.resolve(undefined)

    const assetPromise = MovieMasher.assetManager.assetPromise(assetObject)
    
    return assetPromise.then(asset => { 
      if (!isClientAsset(asset)) return Promise.resolve(undefined)
      
      this.clientAsset = asset
      const iconPromise = asset.definitionIcon({ width: 120, height: 66 })  
      if (iconPromise) return iconPromise.then(icon => {
        this.requestUpdate()
        this.icon = icon
        return asset
      })

      this.requestUpdate()
      return asset
    })
  }

  override connectedCallback(): void {
    super.connectedCallback()
    // this.clientAssetPromise
  }

  private _assetObject?: AssetObject
  protected get assetObject() {
    return this._assetObject ||= this.assetObjectInitialize
  }
  private get assetObjectInitialize() {
    if (!this.assetId) {
      console.log(this.tagName, 'assetObjectInitialize NO ASSET ID')
      return undefined
    }

    const detail: AssetObjectFromIdEventDetail = { id: this.assetId }
    const init: CustomEventInit<AssetObjectFromIdEventDetail> = { 
      detail, composed: true, bubbles: true, cancelable: true
    }
    const event = new CustomEvent(EventTypeAssetObjectFromId, init)
    MovieMasher.eventDispatcher.dispatch(event)
    const { assetObject } = detail
    if (assetObject) {
      // console.log(this.tagName, 'assetObjectInitialize OBJECT', this.assetId)
      // this.mediaRefresh(mediaObject)
    }
    else {
      console.log(this.tagName, 'assetObjectInitialize NO OBJECT', this.assetId)
    }
    return assetObject
  }

  private handleClick() {
    const detail = this.assetObject
    const event = new CustomEvent(EventTypeSelectAssetObject, { detail })
    MovieMasher.eventDispatcher.dispatch(event)
  }

  override render() { 
    if (!this.assetId) {
      console.log(this.tagName, 'render NO ASSET ID')
      return nothing
    }

    const { clientAsset, assetObject, icon } = this
    if (!(clientAsset && assetObject)) return nothing

    const htmls: Htmls = []
    const { label } = assetObject
    if (label) htmls.push(html`<label>${label}</label>`)
    if (icon) htmls.push(html`${icon}`)

    return html`<div @click='${this.handleClick}'>${htmls}</div>`
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('assetId')) {


      // console.log(this.tagName, 'willUpdate assetId', this.assetId)


      delete this.clientAsset
      delete this.icon
      delete this._assetObject
      delete this._clientAssetPromise
      
      this.clientAssetPromise
      // this._assetObject = this.assetObjectInitialize
      // this._clientAssetPromise = this.clientAssetPromiseInitialize

    }
  }

  static override properties = {
    ...Component.properties,
    assetId: { attribute: 'asset-id' }
  }

  static override styles: CSSResultGroup = [css`
    :host {
      display: inline-block;
      position: relative;
      overflow: hidden;
      border: var(--border);
      border-radius: var(--border-radius);
      border-color: var(--item-fore);
      color: var(--item-fore);
      background-color: var(--item-back);
    }
    label {
      height: var(--icon-size);
      --padding: 5px;
      position: absolute;
      display: inline-block;
      overflow: hidden;
      white-space: nowrap;
      width: 100%;
      opacity: 0.5;
      padding: var(--padding);
    }

  `]
}

// register web component as custom element
customElements.define('movie-masher-selector-span', SelectorSpanElement)