import type { Panel, RawType, KnownSource, Strings } from '@moviemasher/shared-lib/types.js'
import type { CSSResultGroup, PropertyDeclarations, PropertyValues } from 'lit'
import type { TemplateContent, TemplateContents, Htmls, OptionalContent } from '../client-types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { SELECTED } from '../runtime.js'
import { EventPick, EventPicked, StringEvent } from '../utility/events.js'
import { $BROWSER, RAW_TYPES,MOVIE_MASHER,  $AUDIO, DASH, $IMAGE, $MASH, $RAW, $SHAPE, $TEXT, $VIDEO, VISIBLE_TYPES } from '@moviemasher/shared-lib/runtime.js'
import { html, nothing } from 'lit-html'
import { Component } from '../base/component.js'
import { ComponentSlotter } from '../base/component.js'

export const PickerTag = 'movie-masher-picker'

const PickerEventType = 'picker'

type Part = RawType | KnownSource

/**
 * @category Elements
 */
export class PickerElement extends ComponentSlotter {
  audio = $RAW

  color = $IMAGE

  override connectedCallback(): void {
    this.listeners[PickerEventType] = this.handlePicker.bind(this)
    this.listeners[EventPick.Type] = this.handlePick.bind(this)
    this.listeners[EventPicked.Type] = this.handlePicked.bind(this)
    this.dispatch()
    super.connectedCallback()
  }
 
  protected override templateContent(contents: TemplateContents): TemplateContent {
    return html`
      <div @export-parts='${this.handleExportParts}'>${contents}</div>
    `
  }

  private dispatch() {
    const { selected, picker } = this
    if (!selected) return

    const event = new EventPick(picker, selected)
    MOVIE_MASHER.dispatch(event)
  }

  private handlePick(event: EventPick) {
    const { picked, picker } = event.detail
    if (picker !== this.picker) return

    // console.log(this.tagName, 'handlePick', this.picker, picked)

    this.selected = picked
  }

  private handlePicked(event: EventPicked) {
    const { picker } = event.detail
    if (picker !== this.picker) return

    // console.log(this.tagName, 'handlePicked', this.picker, this.selected)

    event.stopImmediatePropagation()
    event.detail.picked = this.selected
  }

  private handlePicker(event: StringEvent) {
    const bits = event.detail.split(DASH)
    const [picker, ...rest] = bits
    if (picker !== this.picker) return


    const part = rest.join(DASH) 
    // console.log(this.tagName, 'handlePicker', this.picker, part)

    MOVIE_MASHER.dispatch(new EventPick(picker, part))
    event.stopImmediatePropagation()
  }

  image = $RAW

  protected override partContent(part: Part, slots: Htmls): OptionalContent {
    const { [part]: filter, selected, picker } = this
    const bits: Strings = [part]
    if (filter) bits.push(filter)
    const selectedPart = bits.join(DASH)
    bits.unshift(picker)
    const detail = bits.join(DASH)
    this.loadComponent('movie-masher-link')
    return html`<movie-masher-link 
      selected='${selected === selectedPart || nothing}' 
      icon='${part}' 
      emit='${PickerEventType}' 
      detail='${detail}'
    >${slots}</movie-masher-link>`
  }

  mash = RAW_TYPES.join(DASH)

  override parts = [$MASH, $VIDEO, $IMAGE, $AUDIO, $TEXT, $SHAPE].join(ComponentSlotter.partSeparator)

  picker: Panel = $BROWSER

  prompt = $IMAGE
  
  raw = RAW_TYPES.join(DASH)

  selected: string = [$SHAPE, $IMAGE].join(DASH)

  shape = $IMAGE

  container = VISIBLE_TYPES.join(DASH)

  content = VISIBLE_TYPES.join(DASH)

  text = $IMAGE

  module = VISIBLE_TYPES.join(DASH)

  video = $RAW

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties)
    if (changedProperties.has(SELECTED)) this.dispatch()
  }
  static override properties: PropertyDeclarations = {
    ...ComponentSlotter.properties,
    audio: { type: String },
    color: { type: String },
    image: { type: String },
    mash: { type: String },
    picker: { type: String },
    prompt: { type: String },
    raw: { type: String },
    selected: { type: String },
    module: { type: String },
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

customElements.define(PickerTag, PickerElement)

declare global {
  interface HTMLElementTagNameMap {
    [PickerTag]: PickerElement
  }
}
