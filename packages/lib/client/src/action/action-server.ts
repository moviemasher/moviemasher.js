import type { PropertyValues } from 'lit'
import type { PropertyDeclarations } from 'lit'

import { html } from 'lit-html/lit-html.js'
import { EventChangedServerAction, EventDoServerAction, EventEnabledServerAction, EventProgress, MovieMasher, StringEvent } from '@moviemasher/runtime-client'
import { ButtonElement } from '../component/component-button.js'
import { isDefined } from '@moviemasher/runtime-shared'
import { Content, Contents, Htmls, OptionalContent } from '../declarations.js'
import { IconSlot, StringSlot } from '../Base/IconString.js'
import { ifDefined } from 'lit-html/directives/if-defined.js'
import { arraySet } from '@moviemasher/lib-shared'

export const ServerActionName = 'movie-masher-action-server'

export class ServerActionElement extends ButtonElement {
  override connectedCallback(): void {
    this.listeners[EventChangedServerAction.Type] = this.handleChangedAction.bind(this)
    this.listeners[EventProgress.Type] = this.handleProgress.bind(this)
    super.connectedCallback() 
  }

  protected override content(contents: Contents): Content {
    const { currentProgress, progressInserting: progress } = this
    if (progress && isDefined<number>(currentProgress)) {
      switch(progress) {
        case 'prepend-content': {
          contents.unshift(this.partProgress)
          break
        }
        case 'append-content': {
          contents.push(this.partProgress)
          break
        }
        case 'replace-content': {
          arraySet(contents, [this.partProgress])
          break
        }
        case 'append': {
          return html`${super.content(contents)}${this.partProgress}`
        }
        case 'prepend': {
          return html`${this.partProgress}${super.content(contents)}`
        }
      }
    }
    return super.content(contents)
  }

  protected currentProgress?: number

  private get enabledEvent() {
    const { detail } = this
    return detail ? new EventEnabledServerAction(detail) : undefined
  }
  
  private handleChangedAction(event: StringEvent): void {
    if (this.detail === event.detail) this.handleChanged()
  }

  private handleChanged() {
    const { enabledEvent } = this
    if (!enabledEvent) return
    
    MovieMasher.eventDispatcher.dispatch(enabledEvent)
    this.disabled = !enabledEvent.detail.enabled
  } 

  protected override handleClick(clickEvent: PointerEvent): void {
    const { detail, progressInserting: progress } = this
    if (detail) {
      clickEvent.stopPropagation()
      const event = new EventDoServerAction(detail, progress ? detail : undefined)
      MovieMasher.eventDispatcher.dispatch(event)
      const { promise } = event.detail
      if (promise && progress) this.currentProgress = 0
    }
  }

  private handleProgress(event: EventProgress): void {
    const { progress, id } = event.detail
    // console.debug(this.tagName, this.detail, 'handleProgress', progress, id)
    if (!this.progressInserting || id != this.detail) return

    this.currentProgress = progress === 1 ? undefined : progress
  }

  progressInserting?: string = 'replace-string'

  progressSizing?: string = 'string'

  protected override partContent(part: string, slots: Htmls): OptionalContent { 
    const { currentProgress, progressInserting: progress } = this
    if (progress && isDefined<number>(currentProgress)) {
      switch (part) {
        case StringSlot: {
          if (progress === 'replace-string') return this.partProgress
          break
        }
        case IconSlot: {
          if (progress === 'replace-icon') return this.partProgress
          break
        }
      }   
    }
    return super.partContent(part, slots)
  }

  private get partProgress(): Content {
    const { currentProgress = 0 } = this
    return html`
      <progress 
        style='${ifDefined(this.progressStyle)}' 
        value='${currentProgress}' 
        max='1.0'
      ></progress>
    `
  }

  private _iconWidth?: string
  private get iconWidth(): string | undefined {
    const { icon, _iconWidth } = this
    if (_iconWidth) return _iconWidth
    if (!icon) return

    return this._iconWidth = this.elementWidth('movie-masher-component-icon')
  }

  private _stringWidth?: string
  private get stringWidth(): string | undefined {
    const { string, _stringWidth } = this
    if (_stringWidth) return _stringWidth

    if (!string) return

    return this._stringWidth = this.elementWidth('movie-masher-component-string')
  }

  private elementWidth(selector: string): string | undefined {
    const element = this.shadowRoot?.querySelector(selector)
    if (!element) return

    const rect = element.getBoundingClientRect()
    return `width:${rect.width}px;`
  }
 
  private get progressStyle(): string | undefined {
    switch(this.progressSizing) {
      case 'em': return `width:${this.string.length}em;`
      case 'string': return this.stringWidth 
      case 'icon': return this.iconWidth
    }
    return 
  }

  protected override willUpdate(changedProperties: PropertyValues<this>): void {
    super.willUpdate(changedProperties)
    if (changedProperties.has('detail')) { this.handleChanged() }
    if (changedProperties.has('icon')) { delete this._iconWidth }
    if (changedProperties.has('string')) { delete this._stringWidth }
  }


  static override properties: PropertyDeclarations = {
    ...ButtonElement.properties,
    currentProgress: { type: Number, attribute: false },
    progressInserting: { type: String, attribute: 'progress-inserting' },
    progressSizing: { type: String, attribute: 'progress-sizing' },
  }
}

// register web component as custom element
customElements.define(ServerActionName, ServerActionElement)

declare global {
  interface HTMLElementTagNameMap {
    [ServerActionName]: ServerActionElement
  }
}
