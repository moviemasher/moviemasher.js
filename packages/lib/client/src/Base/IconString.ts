import type { StringEvent } from '@moviemasher/runtime-client'
import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { Htmls, OptionalContent } from '../declarations.js'
import type { Contents, Content } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { ClassSelected, MovieMasher } from '@moviemasher/runtime-client'
import { html } from 'lit-html/lit-html.js'
import { Component } from './Component.js'
import { Slotted } from './Slotted.js'
import { ifDefined } from 'lit-html/directives/if-defined.js'

export const StringSlot = 'string'
export const IconSlot = 'icon'

export class IconString extends Slotted {
  protected override content(contents: Contents): Content {
    const { selected } = this

    return html`<a 
      class='${ifDefined(selected ? ClassSelected : undefined)}' 
      @click='${this.handleClick}'
      @export-parts='${this.handleExportParts}'
    >${contents}</a>`
  }

  detail = ''

  emit = ''

  protected handleClick(event: PointerEvent): void {
    const { emit, detail } = this
    if (emit) {
      event.stopPropagation()
      const stringEvent: StringEvent = new CustomEvent(emit, { detail })
      MovieMasher.eventDispatcher.dispatch(stringEvent)
    }
  }

  icon = ''

  private iconContent(_htmls: Htmls): OptionalContent { 
    const { icon } = this
    if (!icon) return 

    this.importTags('movie-masher-component-icon')
    return html`<movie-masher-component-icon 
      part='${IconSlot}' icon='${icon}'
    ></movie-masher-component-icon>` 
  }

  protected override partContent(part: string, slots: Htmls): OptionalContent { 
    switch (part) {
      case StringSlot: return this.stringContent(slots)
      case IconSlot: return this.iconContent(slots)
    }
    return super.partContent(part, slots)
  }

  override parts = [IconSlot, StringSlot].join(Slotted.partSeparator)

  selected = false

  string = ''

  private stringContent(_htmls: Htmls): OptionalContent { 
    const { string } = this
    if (!string) return 

    this.importTags('movie-masher-component-string')
    return html`<movie-masher-component-string 
      part='${StringSlot}' string='${string}'
    ></movie-masher-component-string>` 
  }

  static override properties: PropertyDeclarations = {
    ...Slotted.properties,
    detail: { type: String },
    emit: { type: String },
    string: { type: String },
    icon: { type: String },
    selected: { type: Boolean, reflect: true },
  }

      
  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    css`
      :host {
        --padding: var(--pad-control);
        --size: var(--height-control);
        --gap: var(--gap-control);
        --cursor: pointer;
        display: inline-block;
        height: var(--size);
      }

      a {
        color: var(--fore);
        cursor: var(--cursor);
        display: inline-flex;
        gap: var(--gap);
        transition: color var(--color-transition);
        font-size: var(--size);
        line-height: var(--size);
      }

      a.selected {
        color: var(--on);
      }

      a:hover {
        color: var(--over);
      }
    `
  ]
}
