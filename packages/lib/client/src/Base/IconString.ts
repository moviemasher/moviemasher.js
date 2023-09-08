import type { StringEvent } from '@moviemasher/runtime-client'
import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { Htmls, OptionalContent } from '../declarations.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { MovieMasher } from '@moviemasher/runtime-client'
import { html } from 'lit-html/lit-html.js'
import { Component } from './Component'
import { Slotted } from './Slotted.js'

export const StringSlot = 'string'
export const IconSlot = 'icon'

export class IconString extends Slotted {
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

  string = ''

  private stringContent(_htmls: Htmls): OptionalContent { 
    const { string } = this
    if (!string) return 

    this.importTags('movie-masher-component-string')
    return html`<movie-masher-component-string 
      part='${StringSlot}' string='${string}'
    ></movie-masher-component-string>` 
  }

  static cssControl = css`
    :hover {
      --back: var(--back-hover);
      --fore: var(--fore-hover);
    }

    :host(.disabled), :host(.disabled):hover,
    button:disabled, button:disabled:hover {
      --back: var(--back-disabled);
      --cursor: default;
      --fore: var(--fore-disabled);
    }
    
    :host(.selected){
      --back: var(--back-selected);
      --fore: var(--fore-selected);
    }

    :host(.selected):hover {
      --fore: var(--back-selected);
      --back: var(--fore-selected);
    }
  `

  static cssControls = css`
    a, button {
      color: var(--fore);
      cursor: var(--cursor);
      display: inline-flex;
      gap: var(--spacing);
      height: var(--size);
      transition: 
        background-color var(--color-transition),
        border-color var(--color-transition),
        color var(--color-transition);
    }

    a {
      font-size: var(--size);
      line-height: var(--size);
    }

    button {
      --pad-height: calc(var(--size) - ((2 * var(--padding)) + (2 * var(--border-size))));
      align-items: center;
      appearance: none;
      background-color: var(--back);
      border-color: var(--fore);
      border-radius: var(--border-radius);
      border: var(--border);
      font-size: var(--pad-height);
      font-weight: 500;
      line-height: var(--pad-height);
      min-width: var(--size);
      outline: none;
      padding: var(--padding);
    }

    progress {
      width: var(--progress-width);
    }
  `

  static cssHost = css`
    :host {
      --back-disabled: var(--control-back-disabled);
      --back-hover: var(--control-back-hover);
      --back-selected: var(--control-back-selected);
      --back: var(--control-back);
      --cursor: pointer;
      --fore-disabled: var(--control-fore-disabled);
      --fore-hover: var(--control-fore-hover);
      --fore-selected: var(--control-fore-selected);
      --fore: var(--control-fore);
      --padding: 4px;
      --size: var(--control-size);
      --spacing: var(--control-spacing);
      display: inline-block;
    }
  `
  
  static override styles: CSSResultGroup = [
    Component.cssBorderBoxSizing,
    IconString.cssHost,
    IconString.cssControl,
    IconString.cssControls,
  ]

  static override properties: PropertyDeclarations = {
    ...Slotted.properties,
    detail: { type: String },
    emit: { type: String },
    string: { type: String },
    icon: { type: String },
  }
}
