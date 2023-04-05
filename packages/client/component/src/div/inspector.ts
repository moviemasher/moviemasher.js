
import { customElement } from '@lit/reactive-element/decorators/custom-element.js'

import { css } from '@lit/reactive-element/css-tag.js'
import { Div } from '../Base/LeftCenterRight.js'


@customElement('moviemasher-inspector-div')
export class InspectorDivElement extends Div {
  static override styles = [css``]
}
