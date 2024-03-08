import type { PropertyDeclarations, PropertyValues } from 'lit'
import type { Htmls, OptionalContent, TemplateContent, TemplateContents } from '../client-types.js'

import { $ICON, $STRING, MOVIE_MASHER, arraySet } from '@moviemasher/shared-lib/runtime.js'
import { isDefined } from '@moviemasher/shared-lib/utility/guard.js'
import { html } from 'lit-html'
import { ButtonElement } from '../component/button.js'
import { EventChangedServerAction, EventDoServerAction, EventEnabledServerAction, EventProgress, StringEvent } from '../module/event.js'

export const ServerActionTag = 'movie-masher-action-server'

/**
 * @category Elements
 */
export class ServerActionElement extends ButtonElement {
  override connectedCallback(): void {
    this.listeners[EventChangedServerAction.Type] = this.handleChangedAction.bind(this)
    this.listeners[EventProgress.Type] = this.handleProgress.bind(this)
    super.connectedCallback() 
  }

  protected override templateContent(contents: TemplateContents): TemplateContent {
    const { currentProgress, progressInserting } = this
    if (progressInserting && isDefined<number>(currentProgress)) {
      switch(progressInserting) {
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
          return html`${super.templateContent(contents)}${this.partProgress}`
        }
        case 'prepend': {
          return html`${this.partProgress}${super.templateContent(contents)}`
        }
      }
    }
    return super.templateContent(contents)
  }

  protected currentProgress?: number

  private get enabledEvent() {
    const { detail } = this
    return detail ? new EventEnabledServerAction(detail) : undefined
  }
  
  private handleChangedAction(event: StringEvent): void {
    console.log(this.tagName, 'handleChangedAction', this.detail, event.detail)
    if (this.detail === event.detail) this.handleChanged()
  }

  private handleChanged() {
    const { enabledEvent } = this
    // console.log(this.tagName, this.detail, 'handleChanged', enabledEvent)
    if (!enabledEvent) return
    
    MOVIE_MASHER.dispatchCustom(enabledEvent)
    this.disabled = !enabledEvent.detail.enabled
  } 

  protected override handleClick(clickEvent: PointerEvent): void {
    const { detail, progressInserting: progress } = this
    if (detail) {
      clickEvent.stopPropagation()
      const event = new EventDoServerAction(detail, progress ? detail : undefined)
      MOVIE_MASHER.dispatchCustom(event)
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

  progressSizing?: string = $STRING

  protected override partContent(part: string, slots: Htmls): OptionalContent { 
    const { currentProgress, progressInserting } = this
    if (progressInserting && isDefined<number>(currentProgress)) {
      switch (part) {
        case $STRING: {
          if (progressInserting === 'replace-string') return this.partProgress
          break
        }
        case $ICON: {
          if (progressInserting === 'replace-icon') return this.partProgress
          break
        }
      }   
    }
    return super.partContent(part, slots)
  }

  private get partProgress(): TemplateContent {
    const { currentProgress = 0 } = this
    return html`
      <progress 
        style='${this.progressStyle || ''}' 
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

    return this._iconWidth = this.elementWidth('movie-masher-icon')
  }

  protected override render(): unknown {
    const { detail } = this
    if (MOVIE_MASHER.imports[detail]) return super.render()

    return
  }

  private _stringWidth?: string
  private get stringWidth(): string | undefined {
    const { string, _stringWidth } = this
    if (_stringWidth) return _stringWidth

    if (!string) return

    return this._stringWidth = this.elementWidth('movie-masher-word')
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

customElements.define(ServerActionTag, ServerActionElement)

declare global {
  interface HTMLElementTagNameMap {
    [ServerActionTag]: ServerActionElement
  }
}
