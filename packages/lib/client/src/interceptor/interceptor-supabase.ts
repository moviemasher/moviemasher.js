import type { Content, Contents, AssetObjectsEvent } from '../declarations.js'

import { html } from 'lit'
import { customElement } from 'lit/decorators/custom-element.js'

import { property } from 'lit/decorators/property.js'

import { Interceptor } from './interceptor.js'
import { SourceRaw } from '@moviemasher/runtime-shared'

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
  protected mediaObjectsHandler(event: AssetObjectsEvent) {
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
      detail.promise = Promise.resolve([{ id: 'audio', type, label: 'Audio', source: SourceRaw }])
      event.preventDefault()
      event.stopPropagation()
    }
  }

  @property()
  video = 'database'

}