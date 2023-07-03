// import type { Htmls, OptionalContent } from '../declarations.js'

import { Header } from '../Base/LeftCenterRight.js'

export class ViewerHeaderElement extends Header {
  
}

// register web component as custom element
customElements.define('movie-masher-viewer-header', ViewerHeaderElement)