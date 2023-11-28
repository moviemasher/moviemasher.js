import type { AssetType, MashSource, ShapeSource, TextSource } from '@moviemasher/runtime-shared'
import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit'
import type { Content, Contents, Htmls, OptionalContent } from '../Types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { EventBrowserPick, EventBrowserPicked, MOVIEMASHER, SELECTED } from '@moviemasher/runtime-client'
import { ASSET_TYPES, DASH, IMAGE, MASH, RAW, SHAPE, TEXT } from '@moviemasher/runtime-shared'
import { html, nothing } from 'lit-html'
import { Component } from '../base/Component.js'
import { Slotted } from '../base/Component.js'

const BrowserPickerTag = 'movie-masher-browser-picker'

type Part = AssetType | MashSource | ShapeSource | TextSource 

/**
 * @category Component
 */
export class BrowserPickerElement extends Slotted {
  constructor() {
    super()
    this.listeners[EventBrowserPick.Type] = this.handleBrowserPick.bind(this)
    this.listeners[EventBrowserPicked.Type] = this.handleBrowserPicked.bind(this)
  }

  audio = RAW

  override connectedCallback(): void {
    super.connectedCallback()
    this.dispatch()
  }

  protected override content(contents: Contents): Content {
    return html`
      <div @export-parts='${this.handleExportParts}'>${contents}</div>
    `
  }
  private dispatch() {
    const { selected } = this
    if (!selected) return

    const event = new EventBrowserPick(selected)
    MOVIEMASHER.eventDispatcher.dispatch(event)
  }

  private handleBrowserPick(event: EventBrowserPick) {
    this.selected = event.detail
  }

  private handleBrowserPicked(event: EventBrowserPicked) {
    event.stopImmediatePropagation()
    event.detail.picked = this.selected
    // console.log(this.tagName, 'handleBrowserPicked', event.detail)
  }

  image = RAW

  protected override partContent(part: Part, slots: Htmls): OptionalContent {
    const { [part]: filter, selected } = this
    const detail = filter ? [part, filter].join(DASH) : part
    this.importTags('movie-masher-component-a')
    return html`<movie-masher-component-a 
      selected='${selected === detail || nothing}' 
      icon='${part}' 
      emit='${EventBrowserPick.Type}' 
      detail='${detail}'
    >${slots}</movie-masher-component-a>`
  }

  selected: string = [SHAPE, IMAGE].join(DASH)

  override parts = [MASH, ...ASSET_TYPES, TEXT, SHAPE].join(Slotted.partSeparator)

  mash = ASSET_TYPES.join(DASH)

  shape = IMAGE

  text = IMAGE

  video = RAW

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties)
    if (changedProperties.has(SELECTED)) this.dispatch()
  }
  static override properties: PropertyDeclarations = {
    ...Slotted.properties,
    audio: { type: String },
    image: { type: String },
    mash: { type: String },
    selected: { type: String },
    shape: { type: String },
    text: { type: String },
    video: { type: String },
  }

  static override styles: CSSResultGroup = [
    Component.cssHostFlex,
    Component.cssBorderBoxSizing,
    css`
      div {
        flex-grow: 1;
        display: flex;
        gap: var(--gap);
      }
    `
  ]
}

customElements.define(BrowserPickerTag, BrowserPickerElement)

declare global {
  interface HTMLElementTagNameMap {
    [BrowserPickerTag]: BrowserPickerElement
  }
}
