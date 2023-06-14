import type { AssetPromiseEventDetail } from '@moviemasher/runtime-shared'
import type { PropertyValues } from 'lit'
import type { ClientAsset } from '@moviemasher/runtime-client'

import type { Htmls, AssetObjectEventDetail } from '../declarations.js'
import { isClientAsset } from '@moviemasher/lib-shared'

import { nothing } from 'lit'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'


import { Component } from '../Base/Component.js'
import { AssetObject } from '@moviemasher/runtime-shared'

@customElement('movie-masher-selector-span')
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
  
  @property({ attribute: 'asset-id' }) 
  assetId = ''

  // @property({ attribute: false })
  icon?: SVGSVGElement | undefined
  
  private clientAsset?: ClientAsset | undefined

  private _clientAssetPromise?: Promise<ClientAsset | undefined>
  private get clientAssetPromise() {
    return this._clientAssetPromise ||= this.clientAssetPromiseInitialize
  }
  private get clientAssetPromiseInitialize(): Promise<ClientAsset | undefined> {
    const { assetObject } = this
    if (!assetObject) return Promise.resolve(undefined)

    const detail: AssetPromiseEventDetail = { assetObject }
    const init: CustomEventInit<AssetPromiseEventDetail> = { 
      detail, composed: true, bubbles: true, cancelable: true
    }
    this.dispatchEvent(new CustomEvent('asset-promise', init))
    const { assetPromise } = detail
    if (!assetPromise) return Promise.resolve(undefined)
    
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

    const detail: AssetObjectEventDetail = { id: this.assetId }
    const init: CustomEventInit<AssetObjectEventDetail> = { 
      detail, composed: true, bubbles: true, cancelable: true
    }
    this.dispatchEvent(new CustomEvent('asset-object', init))
    const { mediaObject } = detail
    if (mediaObject) {
      console.log(this.tagName, 'mediaObjectInitialize MEDIA OBJECT', this.assetId)
      // this.mediaRefresh(mediaObject)
    }
    else {
      console.log(this.tagName, 'mediaObjectInitialize NO MEDIA OBJECT', this.assetId)
    }
    return mediaObject
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

    return html`<div>${htmls}</div>`
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    if (changedProperties.has('assetId')) {


      console.log(this.tagName, 'willUpdate assetId', this.assetId)


      delete this.clientAsset
      delete this.icon
      delete this._assetObject
      delete this._clientAssetPromise
      
      this.clientAssetPromise
      // this._assetObject = this.assetObjectInitialize
      // this._clientAssetPromise = this.clientAssetPromiseInitialize

    }
  }


  static override styles = [css`
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

