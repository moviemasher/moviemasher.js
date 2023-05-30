import type { ClientAsset, AssetObject, AssetPromiseEventDetail } from '@moviemasher/lib-core'
import type { PropertyValues } from 'lit'

import type { Htmls, AssetObjectEventDetail } from '../declarations.js'
import { isClientAsset } from '@moviemasher/lib-core'

import { nothing } from 'lit'
import { css, html } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
import { property } from 'lit/decorators/property.js'


import { Component } from '../Base/Component.js'

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
  
  @property({ attribute: 'media-id' }) 
  mediaId = ''

  // @property({ attribute: false })
  icon?: SVGSVGElement | undefined
  
  private clientAsset?: ClientAsset | undefined

  private _clientAssetPromise?: Promise<ClientAsset | undefined>
  private get clientAssetPromise() {
    return this._clientAssetPromise ||= this.clientAssetPromiseInitialize
  }
  private get clientAssetPromiseInitialize(): Promise<ClientAsset | undefined> {
    const { mediaObject: assetObject } = this
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
    this.clientAssetPromise
  }
  // private mediaRefresh(assetObject: AssetObject) {
  //   console.log('mediaRefresh', assetObject)
  //   const detail: AssetPromiseEventDetail = { assetObject }
  //   const init: CustomEventInit<AssetPromiseEventDetail> = { 
  //     detail, composed: true, bubbles: true, cancelable: true
  //   }
  //   this.dispatchEvent(new CustomEvent('asset-promise', init))
  //   const { assetPromise } = detail
  //   if (!assetPromise) return console.log('mediaRefresh NO PROMISE', assetObject)
    
  //   assetPromise.then(asset => { 
  //     if (!isClientAsset(asset)) return console.log('mediaRefresh NO ASSET', assetObject)

  //     this.clientAsset = asset 
  //     const iconPromise = asset.definitionIcon({ width: 120, height: 66 })
  //     if (!iconPromise) return console.log('mediaRefresh NO ICON PROMISE', assetObject)
      
  //     iconPromise.then(icon => { 
  //       console.log('mediaRefresh iconPromise', !!icon)
  //       this.icon = icon 
  //       this.requestUpdate()
  //     })
  //   })
  // }


  private _mediaObject?: AssetObject
  protected get mediaObject() {
    return this._mediaObject ||= this.mediaObjectInitialize
  }
  private get mediaObjectInitialize() {
    const detail: AssetObjectEventDetail = { id: this.mediaId }
    const init: CustomEventInit<AssetObjectEventDetail> = { 
      detail, composed: true, bubbles: true, cancelable: true
    }
    this.dispatchEvent(new CustomEvent('mediaobject', init))
    const { mediaObject } = detail
    if (mediaObject) {
      // console.log(this.tagName, 'mediaObjectInitialize MEDIA OBJECT', this.mediaId)
      // this.mediaRefresh(mediaObject)
    }
    else {
      // console.log(this.tagName, 'mediaObjectInitialize NO MEDIA OBJECT', this.mediaId)
    }
    return mediaObject
  }

  override render() { 
    const { mediaObject, icon } = this
    if (!mediaObject) return nothing

    const htmls: Htmls = []
    const { label } = mediaObject
    if (label) htmls.push(html`<label>${label}</label>`)
    if (icon) htmls.push(html`${icon}`)

    return html`<div>${htmls}</div>`
  }

  override willUpdate(changedProperties: PropertyValues<this>) {
    // console.log(this.tagName, 'willUpdate', changedProperties, this._mediaObject)
    if (changedProperties.has('mediaId')) {
      delete this._clientAssetPromise
      delete this.clientAsset
      delete this._mediaObject
      delete this.icon
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

