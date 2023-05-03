import type { Content, Contents, MediaObjectsEvent } from '../declarations.js'

import { html } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'
// import { eventOptions } from '@lit/reactive-element/decorators/event-options.js'
import { property } from 'lit/decorators/property.js'

import { Interceptor } from './interceptor.js'

@customElement('movie-masher-interceptor-supabase')
export class InterceptorSupabaseElement extends Interceptor {
  @property()
  audio = 'database'

  protected override content(contents: Contents): Content { 
    return html`<div @mediaobjects='${this.mediaObjectsHandler}'>${contents}</div>` 
  }
  @property()
  effect = 'database'

  @property()
  font = 'database'

  @property()
  image = 'database'

  @property()
  mash = 'database'

  // @eventOptions({ capture: true })
  protected mediaObjectsHandler(event: MediaObjectsEvent) {
    const { detail } = event
    const { type } = detail
    const { [type]: databaseOrStorage } = this
    if (!databaseOrStorage) return

    switch(databaseOrStorage) {
      case 'database': {
        break
      }
      case 'storage': {
        break
      }
    }
    if (type === 'audio') {
      console.debug(this.tagName, 'mediaObjectsHandler', type)
      detail.promise = Promise.resolve([{ id: 'audio', type, label: 'Audio' }])
      event.preventDefault()
      event.stopPropagation()
    }
  }

  @property()
  video = 'database'

}