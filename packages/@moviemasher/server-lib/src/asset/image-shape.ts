import type { InstanceArgs, ListenersFunction, RectTuple, ShapeAssetObject, ShapeInstanceObject, Strings } from '@moviemasher/shared-lib/types.js'
import type { ServerShapeAsset, ServerShapeInstance, Tweening } from '../type/ServerTypes.js'
import type { CommandFilters, VisibleCommandFileArgs, VisibleCommandFilterArgs } from '../types.js'

import { ShapeAssetMixin, ShapeInstanceMixin } from '@moviemasher/shared-lib/mixin/shape.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'
import { DEFAULT_CONTAINER_ID, ERROR, IMAGE, SHAPE, errorThrow, isAssetObject } from '@moviemasher/shared-lib/runtime.js'
import { assertPopulatedArray, isPopulatedArray } from '@moviemasher/shared-lib/utility/guards.js'
import { rectsEqual } from '@moviemasher/shared-lib/utility/rect.js'
import { ServerAssetClass } from '../base/asset.js'
import { ServerInstanceClass } from '../base/instance.js'
import { ServerVisibleAssetMixin, ServerVisibleInstanceMixin } from '../mixin/visible.js'
import { EventServerAsset } from '../runtime.js'

const WithAsset = VisibleAssetMixin(ServerAssetClass)
const WithServerAsset = ServerVisibleAssetMixin(WithAsset)
const WithShapeAsset = ShapeAssetMixin(WithServerAsset)
export class ServerShapeAssetClass extends WithShapeAsset implements ServerShapeAsset {
  constructor(args: ShapeAssetObject) {
    super(args)
    this.initializeProperties(args)
  }
  
  override instanceFromObject(object?: ShapeInstanceObject): ServerShapeInstance {
    const args = this.instanceArgs(object)
    return new ServerShapeInstanceClass(args)
  }

  private static _defaultAsset?: ServerShapeAsset

  private static get defaultAsset(): ServerShapeAsset {
    return this._defaultAsset ||= new ServerShapeAssetClass({ 
      id: DEFAULT_CONTAINER_ID, type: IMAGE, 
      source: SHAPE, label: 'Rectangle'
    })
  }
  
  static handleAsset(event: EventServerAsset) {
    const { detail } = event
    const { assetObject, assetId } = detail
    
    const isDefault = assetId === DEFAULT_CONTAINER_ID
    if (!(isDefault || isAssetObject(assetObject, IMAGE, SHAPE))) return
      
    event.stopImmediatePropagation()
    if (isDefault) detail.asset = ServerShapeAssetClass.defaultAsset
    else detail.asset = new ServerShapeAssetClass(assetObject as ShapeAssetObject) 
  }

}

// listen for image/shape asset event
export const ServerShapeImageListeners: ListenersFunction = () => ({
  [EventServerAsset.Type]: ServerShapeAssetClass.handleAsset
})

const WithInstance = VisibleInstanceMixin(ServerInstanceClass)
const WithServerInstance = ServerVisibleInstanceMixin(WithInstance)
const WithShapeInstance = ShapeInstanceMixin(WithServerInstance)
export class ServerShapeInstanceClass extends WithShapeInstance implements ServerShapeInstance { 
  constructor(args: ShapeInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }
  
  declare asset: ServerShapeAsset

  override canColor(args: VisibleCommandFilterArgs): boolean { 
    return false
    // const { isDefault } = this

    // // default rect has no content to colorize, so needs color filter input
    // // shape files can only colorize a single color at a single size
    // const can = isDefault ? false : !this.isTweeningColor(args.contentColors)
    // // console.log(this.constructor.name, 'canColor', can, args)
    // return can
  }
  
  override containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters {
    // i am either default rect or a shape tweening color
    const commandFilters: CommandFilters = [] 
    // const { isDefault } = this
    // const { containerRects, videoRate, duration } = args
    // const [rect, rectEnd] = containerRects
    // const [color, colorEnd] = contentColors
    // const maxSize = sizeEven(isDefault ? rect : tweenMaxSize(rect, rectEnd))
    // const endRect = isDefault ? rectEnd : maxSize
    // commandFilters.push(
    //   ...this.colorCommandFilters(
    //     duration, videoRate, maxSize, endRect, color || RGB_WHITE, colorEnd
    //   )
    // )
    return commandFilters
  }

  override containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    const commandFilters: CommandFilters = [] 
    // const { 
    //   contentColors: colors, filterInput: input 
    // } = args

    // let filterInput = input
  

    // const noContentFilters = isPopulatedArray(colors)
    // const alpha = this.requiresAlpha(args, !!tweening.size)

    // // console.log(this.constructor.name, 'containerCommandFilters',{filterInput, alpha, noContentFilters})

    // if (alpha) {
    //   assertPopulatedString(filterInput, 'container input')
    //   const { contentColors: _, ...argsWithoutColors } = args
    //   const superArgs: VisibleCommandFilterArgs = { 
    //     ...argsWithoutColors, filterInput
    //   }
    //   commandFilters.push(...this.instanceCommandFilters(superArgs, tweening))

    // } else if (this.isDefault || noContentFilters) {
    //   const { id } = this
      
    //   filterInput ||= [id, 'v'].join(COLON)
    //   assertPopulatedString(filterInput, 'final input')
      
    //   commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput}))
    // }
    return commandFilters
  }

  override initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    errorThrow(ERROR.Unimplemented, 'initialCommandFilters')
    // const commandFilters: CommandFilters = [] 
    // const { contentColors, ...argsWithoutColors } = args
    // const { track, filterInput: input, containerRects } = argsWithoutColors
    // let filterInput = input 
    // const alpha = this.requiresAlpha(args, !!tweening.size)
    // const { isDefault } = this
    // const maxSize = sizeEven(tweenMaxSize(...containerRects))
    // const contentInput = `content-${track}`
    // const containerInput = `container-${track}`
    // if (!tweening.canColor) {
    //   if (isPopulatedString(filterInput) && !isDefault) {
    //     if (alpha) {
    //       const formatFilter = 'format'
    //       const formatFilterId = idGenerate(formatFilter)
    //       const formatCommandFilter: CommandFilter = {
    //         inputs: [filterInput], ffmpegFilter: formatFilter, 
    //         options: { pix_fmts: 'yuv420p' },
    //         outputs: [formatFilterId]
    //       }
    //       commandFilters.push(formatCommandFilter)
    //       filterInput = formatFilterId
    //     }
    //   }   
    // }
    // if (commandFilters.length) arrayLast(commandFilters).outputs = [contentInput]
    // else if (isPopulatedString(filterInput) && contentInput !== filterInput) {
    //   commandFilters.push(this.copyCommandFilter(filterInput, track))
    //   filterInput = arrayLast(arrayLast(commandFilters).outputs)  
    // }
    // if (alpha) {
    //   const { id } = this
    //   const fileInput = [id, 'v'].join(COLON)
    //   assertPopulatedString(fileInput, 'scale input')

    //   const colorArgs: VisibleCommandFilterArgs = { 
    //     ...args, outputSize: maxSize, contentColors: [RGB_BLACK, RGB_BLACK]
    //   }
    //   commandFilters.push(...this.colorBackCommandFilters(colorArgs, `${containerInput}-back`))
    //   const colorInput = arrayLast(arrayLast(commandFilters).outputs) 

    //   commandFilters.push(...this.scaleCommandFilters({ ...args, filterInput: fileInput }))
    //   filterInput = arrayLast(arrayLast(commandFilters).outputs) 

    //   assertPopulatedString(filterInput, 'overlay input')
    
    //   commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput))
    //   filterInput = arrayLast(arrayLast(commandFilters).outputs)         
    //   assertPopulatedString(filterInput, 'crop input')

    //   const options: ValueRecord = { ...POINT_ZERO }//exact: 1, 
    //   const cropOutput = idGenerate('crop')
    //   const { width, height } = maxSize
    //   if (isTrueValue(width)) options.w = width
    //   if (isTrueValue(height)) options.h = height
    //   const commandFilter: CommandFilter = {
    //     ffmpegFilter: 'crop', 
    //     inputs: [filterInput], 
    //     options, 
    //     outputs: [cropOutput]
    //   }
    //   commandFilters.push(commandFilter)
    //   filterInput = cropOutput
 
    //   const formatCommandFilter: CommandFilter = {
    //     inputs: [filterInput], ffmpegFilter: 'format', 
    //     options: { pix_fmts: alpha ? 'yuv420p' : 'yuva420p' },
    //     outputs: [containerInput]
    //   }
    //   commandFilters.push(formatCommandFilter)
    // } 
    // return commandFilters
  }

  private isTweeningColor(contentColors?: Strings): boolean {
    if (!isPopulatedArray(contentColors)) return false

    const [forecolor, forecolorEnd] = contentColors
    return contentColors.length === 2 && forecolor !== forecolorEnd
  }

  private isTweeningSize(containerRects: RectTuple): boolean {
    assertPopulatedArray(containerRects, 'containerRects')

    const [containerRect, containerRectEnd] = containerRects
    return containerRects.length === 2 && !rectsEqual(containerRect, containerRectEnd)
  }

  private requiresAlpha(args: VisibleCommandFileArgs, tweeningSize?: boolean): boolean {
    return false
    
    // const { contentColors, containerRects } = args
    // const colorContent = isPopulatedArray(contentColors)
    // if (this.isDefault) {
    //   if (colorContent) return false // can always make colored boxes

    //   if (isBoolean(tweeningSize)) return tweeningSize

    //   return this.isTweeningSize(containerRects) // need mask to dynamically crop content
    // }
    // if (!colorContent) return true // always need to mask content

    // return this.isTweeningColor(contentColors)
  }
}

