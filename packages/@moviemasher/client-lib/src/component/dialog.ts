import type { CSSResultGroup, PropertyDeclarations } from 'lit'
import type { TemplateContent, TemplateContents, Htmls, OptionalContent } from '../client-types.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { EventDialog } from '../module/event.js'
import { html } from 'lit-html'
import { ComponentSlotter } from '../base/component.js'

const PartImporter = 'importer'
const PartExporter = 'exporter'

export const DialogTag = 'movie-masher-dialog'

/**
 * @category Elements
 */
export class DialogElement extends ComponentSlotter {
  constructor() {
    super()
    this.listeners[EventDialog.Type] = this.handleDialog.bind(this)
    // this.handleClose = this.handleClose.bind(this)
    // this.handleDialog = this.handleDialog.bind(this)
  }

  protected override templateContent(contents: TemplateContents): TemplateContent {
    return html`
      <dialog 
        @export-parts='${this.handleExportParts}'
        @close='${this.handleClose}'
      >${contents}</dialog>
    `
  }

  private get dialog(): HTMLDialogElement {
    return this.element('dialog') as HTMLDialogElement
  }

  protected dialogClose(): void {
    this.dialog.close()
  }

  protected dialogOpen(): void {
    this.dialogOpened = true
    this.dialog.showModal()
  }

  private dialogOpened = false

  private dialogOpening = false

  protected override get exportElements(): Element[] {
    return this.section ? super.exportElements : []
  }

  protected handleClose(): void {
    // console.log(this.tagName, 'handleClose', this.dialogOpened)
    if (!this.dialogOpened) return

    this.dialogOpened = false
    this.handleDialog(new EventDialog())//'close'
  }

  protected handleDialog(event: EventDialog): void {
    
    const { detail: newSection = '' } = event
    const { section } = this
    // console.log(this.tagName, 'handleDialog', section, '->', newSection)
    if (newSection === section) return

    const { dialogOpened } = this
    if (dialogOpened) this.dialogClose()
    if (newSection) this.dialogOpening = true
    this.section = newSection
    this.handleExportParts()
    this.dispatchExportParts()
  }

  protected override partContent(part: string, slots: Htmls): OptionalContent {
    const { dialogOpening } = this
    if (dialogOpening) {
      this.dialogOpening = false
      this.loadComponent(`movie-masher-${part}`)
      this.dialogOpen()
    }
    switch (part) {
      case PartImporter: {
        return html`
          <movie-masher-importer 
            part='${PartImporter}' 
          >${slots}</movie-masher-importer>`
      }  
      case PartExporter: {
        return html`
          <movie-masher-exporter 
            part='${PartExporter}' 
          >${slots}</movie-masher-exporter>`
      } 
    }
    return super.partContent(part, slots)
  }

  section = ''

  override parts = [PartImporter].join(ComponentSlotter.partSeparator)

  static override properties: PropertyDeclarations = {
    ...ComponentSlotter.properties,
    section: { type: String },
  }

  static override styles: CSSResultGroup = [
    css`
      :host {
        position: absolute;
      }

      form {
        display: flex;
        flex-grow: 1;
      }

      dialog[open] {
        background: none;
        border: none;
        padding: 0;
        display: flex;
        height: var(--height-dialog, 90vh);
        width: var(--width-dialog, 90vw);
      }

      dialog::backdrop {
        background-color: black;
        opacity: 0.25;
      }

      @media(prefers-color-scheme: dark) {
        dialog::backdrop {
          background-color: white;
        }
      }
    `
  ]
}


customElements.define(DialogTag, DialogElement)

declare global {
  interface HTMLElementTagNameMap {
    [DialogTag]: DialogElement
  }
}