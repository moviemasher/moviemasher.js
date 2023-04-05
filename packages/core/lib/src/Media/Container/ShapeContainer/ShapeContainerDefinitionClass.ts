import type {Size} from '../../../Utility/Size.js'
import type {UnknownRecord} from '../../../Types/Core.js'
import type {
  ShapeContainer, ShapeContainerDefinition,
  ShapeContainerDefinitionObject, ShapeContainerObject
} from './ShapeContainer.js'

import {ContainerDefinitionMixin} from '../ContainerDefinitionMixin.js'
import {ShapeContainerClass} from './ShapeContainerClass.js'
import {TweenableDefinitionMixin} from '../../../Mixin/Tweenable/TweenableDefinitionMixin.js'
import {isAboveZero, isPopulatedString} from '../../../Utility/Is.js'
import {svgSvgElement, svgPathElement, svgPolygonElement, svgSetTransformRects} from '../../../Helpers/Svg/SvgFunctions.js'
import {sizeAboveZero, sizeCover} from '../../../Utility/Size.js'
import {centerPoint} from '../../../Utility/Rect.js'
import {DefaultContainerId} from '../ContainerConstants.js'
import {MediaBase} from '../../MediaBase.js'
import {TypeImage} from '../../../Setup/Enums.js'

const ShapeContainerDefinitionWithTweenable = TweenableDefinitionMixin(MediaBase)
const ShapeContainerDefinitionWithContainer = ContainerDefinitionMixin(ShapeContainerDefinitionWithTweenable)
export class ShapeContainerDefinitionClass extends ShapeContainerDefinitionWithContainer implements ShapeContainerDefinition {
  constructor(...args: any[]) {
    const [object] = args
    
    super(object)
    
    const { path, pathHeight, pathWidth } = object as ShapeContainerDefinitionObject
    if (path) this.path = path
    if (isAboveZero(pathWidth)) this.pathWidth = pathWidth
    if (isAboveZero(pathHeight)) this.pathHeight = pathHeight
  }

  definitionIcon(size: Size): Promise<SVGSVGElement> | undefined {
    const { id, pathHeight: height, pathWidth: width, path } = this
    if (id === DefaultContainerId) {
      return Promise.resolve(svgSvgElement(size, svgPolygonElement(size, '', 'currentColor')))
    }
    const inSize = { width, height }
    if (!(sizeAboveZero(inSize) && isPopulatedString(path))) return

    const coverSize = sizeCover(inSize, size, true)
    const outRect = { ...coverSize, ...centerPoint(size, coverSize) }
    const pathElement = svgPathElement(path)
    svgSetTransformRects(pathElement, inSize, outRect)
    return Promise.resolve(svgSvgElement(size, pathElement))
  }

  instanceFromObject(object: ShapeContainerObject = {}): ShapeContainer {
    return new ShapeContainerClass(this.instanceArgs(object))
  }

  isVector = true

  path = ''

  pathHeight = 0

  pathWidth = 0

  toJSON(): UnknownRecord {
    const object = super.toJSON()
    if (this.path) object.path = this.path
    if (isAboveZero(this.pathHeight)) object.pathHeight = this.pathHeight
    if (isAboveZero(this.pathWidth)) object.pathWidth = this.pathWidth
    return object
  }

  type = TypeImage 
}
