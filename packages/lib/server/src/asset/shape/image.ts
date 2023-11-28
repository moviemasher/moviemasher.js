import type { CommandFile, CommandFileArgs, CommandFiles, CommandFilter, CommandFilterArgs, CommandFilters, ServerPromiseArgs, VisibleCommandFileArgs, VisibleCommandFilterArgs } from '@moviemasher/runtime-server'
import type { DataOrError, InstanceArgs, ListenersFunction, ShapeAssetObject, ShapeInstanceObject, Size, ValueRecord } from '@moviemasher/runtime-shared'
import type { ServerShapeAsset, ServerShapeInstance, Tweening } from '../../Types/ServerTypes.js'

import { EventServerAsset } from '@moviemasher/runtime-server'
import { DEFAULT_CONTAINER_ID, DOT, IMAGE, NAMESPACE_SVG, NONE, POINT_ZERO, RGBA_BLACK, RGB_BLACK, RGB_WHITE, SHAPE, SVG, arrayLast, idGenerate, isAssetObject, isBoolean, isDefiniteError, isPopulatedString } from '@moviemasher/runtime-shared'
import path from 'path'
import { ServerAssetClass } from '../../Base/ServerAssetClass.js'
import { ServerInstanceClass } from '../../Base/ServerInstanceClass.js'
import { ServerVisibleAssetMixin } from '../../Base/ServerVisibleAssetMixin.js'
import { ServerVisibleInstanceMixin } from '../../Base/ServerVisibleInstanceMixin.js'
import { ENV_KEY, ENV } from '../../Environment/EnvironmentConstants.js'
import { tweenMaxSize } from '../../Utility/Command.js'
import { commandFilesInput } from '../../Utility/CommandFilesFunctions.js'
import { fileWritePromise } from '../../Utility/File.js'
import { fileNameFromContent } from '../../Utility/File.js'
import { ShapeAssetMixin, VisibleAssetMixin } from '@moviemasher/lib-shared/asset/mixins.js'
import { ShapeInstanceMixin, VisibleInstanceMixin } from '@moviemasher/lib-shared/instance/mixins.js'
import { assertPopulatedArray, isPopulatedArray, assertPopulatedString, isTrueValue } from '@moviemasher/lib-shared/utility/guards.js'
import { rectTransformAttribute, rectsEqual, sizeEven } from '@moviemasher/lib-shared/utility/rect.js'
import { isTimeRange } from '@moviemasher/lib-shared/utility/time.js'

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

  serverPromise(args: ServerPromiseArgs, commandFile: CommandFile): Promise<DataOrError<number>> {
    const { visible } = args
    const { content, type, file } = commandFile
    if (!(content && visible && type === SVG)) {
      return Promise.resolve({ data: 0 })
    }

    return fileWritePromise(file, content, true).then(orError => {
      if (isDefiniteError(orError)) return orError

      return { data: 1 }
    })
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

  override canColor(args: CommandFilterArgs): boolean { 
    const { isDefault } = this

    // default rect has no content to colorize, so needs color filter input
    // shape files can only colorize a single color at a single size
    const can = isDefault ? false : !this.isTweeningColor(args)
    // console.log(this.constructor.name, 'canColor', can, args)
    return can
  }
  
  override containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters {



    const commandFilters: CommandFilters = [] 
    // i am either default rect or a shape tweening color

    const { isDefault } = this
    const { contentColors, containerRects, videoRate, duration } = args
    assertPopulatedArray(contentColors, 'contentColors')

    const [rect, rectEnd] = containerRects
    const [color, colorEnd] = contentColors
    

    const maxSize = sizeEven(isDefault ? rect : tweenMaxSize(rect, rectEnd))

    const endRect = isDefault ? rectEnd : maxSize

    // console.log(this.constructor.name, this.assetId, 'containerColorCommandFilters', {color, maxSize})

    commandFilters.push(...this.colorCommandFilters(duration, videoRate, maxSize, endRect, color || RGB_WHITE, colorEnd))
    return commandFilters
  }

  override containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    const commandFilters: CommandFilters = [] 
    const { 
      contentColors: colors, commandFiles, filterInput: input 
    } = args

    let filterInput = input
  

    const noContentFilters = isPopulatedArray(colors)
    const alpha = this.requiresAlpha(args, !!tweening.size)

    // console.log(this.constructor.name, 'containerCommandFilters',{filterInput, alpha, noContentFilters})

    if (alpha) {
      assertPopulatedString(filterInput, 'container input')
      const { contentColors: _, ...argsWithoutColors } = args
      const superArgs: VisibleCommandFilterArgs = { 
        ...argsWithoutColors, filterInput
      }
      commandFilters.push(...this.instanceCommandFilters(superArgs, tweening))

    } else if (this.isDefault || noContentFilters) {
      const { id } = this
      // if (!filterInput) console.log(this.constructor.name, 'containerCommandFilters calling commandFilesInput', id)
      
      filterInput ||= commandFilesInput(commandFiles, id, true)
      assertPopulatedString(filterInput, 'final input')
      
      commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput}))
    }
    return commandFilters
  }

  override initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    const commandFilters: CommandFilters = [] 
    const { contentColors, ...argsWithoutColors } = args
    const { 
      commandFiles, track, filterInput: input, containerRects,
    } = argsWithoutColors
    let filterInput = input 
    const alpha = this.requiresAlpha(args, !!tweening.size)
    const { isDefault } = this
    const maxSize = sizeEven(tweenMaxSize(...containerRects))
    const contentInput = `content-${track}`
    const containerInput = `container-${track}`
    if (!tweening.canColor) {
      if (isPopulatedString(filterInput) && !isDefault) {
        if (alpha) {
          const formatFilter = 'format'
          const formatFilterId = idGenerate(formatFilter)
          const formatCommandFilter: CommandFilter = {
            inputs: [filterInput], ffmpegFilter: formatFilter, 
            options: { pix_fmts: 'yuv420p' },
            outputs: [formatFilterId]
          }
          commandFilters.push(formatCommandFilter)
          filterInput = formatFilterId
        }
      }   
    }
    if (commandFilters.length) arrayLast(commandFilters).outputs = [contentInput]
    else if (isPopulatedString(filterInput) && contentInput !== filterInput) {
      commandFilters.push(this.copyCommandFilter(filterInput, track))
      filterInput = arrayLast(arrayLast(commandFilters).outputs)  
    }
    if (alpha) {
      const { id } = this
      const fileInput = commandFilesInput(commandFiles, id, true)   
      assertPopulatedString(fileInput, 'scale input')

      const colorArgs: VisibleCommandFilterArgs = { 
        ...args, 
        contentColors: [RGB_BLACK, RGB_BLACK], 
        outputSize: maxSize
      }
      commandFilters.push(...this.colorBackCommandFilters(colorArgs, `${containerInput}-back`))
      const colorInput = arrayLast(arrayLast(commandFilters).outputs) 

      commandFilters.push(...this.scaleCommandFilters({ ...args, filterInput: fileInput }))
      filterInput = arrayLast(arrayLast(commandFilters).outputs) 

      assertPopulatedString(filterInput, 'overlay input')
    
      commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput))
      filterInput = arrayLast(arrayLast(commandFilters).outputs)         
      assertPopulatedString(filterInput, 'crop input')

      const options: ValueRecord = { ...POINT_ZERO }//exact: 1, 
      const cropOutput = idGenerate('crop')
      const { width, height } = maxSize
      if (isTrueValue(width)) options.w = width
      if (isTrueValue(height)) options.h = height
      const commandFilter: CommandFilter = {
        ffmpegFilter: 'crop', 
        inputs: [filterInput], 
        options, 
        outputs: [cropOutput]
      }
      commandFilters.push(commandFilter)
      filterInput = cropOutput
 
      const formatCommandFilter: CommandFilter = {
        inputs: [filterInput], ffmpegFilter: 'format', 
        options: { pix_fmts: alpha ? 'yuv420p' : 'yuva420p' },
        outputs: [containerInput]
      }
      commandFilters.push(formatCommandFilter)
    } 
    return commandFilters
  }

  private isTweeningColor(args: CommandFileArgs): boolean {
    const { contentColors } = args
    // assertPopulatedArray(contentColors, 'contentColors')
    if (!isPopulatedArray(contentColors)) return false

    const [forecolor, forecolorEnd] = contentColors
    return contentColors.length === 2 && forecolor !== forecolorEnd
  }

  private isTweeningSize(args: CommandFileArgs): boolean {
    const { containerRects } = args
    assertPopulatedArray(containerRects, 'containerRects')
    // if (!isPopulatedArray(containerRects)) {
    //   // console.log(this.constructor.name, 'isTweeningSize FALSE BECAUSE containerRects NOT ARRAY', args)
    //   return false
    // }
    const [containerRect, containerRectEnd] = containerRects
    return containerRects.length === 2 && !rectsEqual(containerRect, containerRectEnd)
    
  }

  private requiresAlpha(args: CommandFileArgs, tweeningSize?: boolean): boolean {
    const { contentColors } = args
    const colorContent = isPopulatedArray(contentColors)
    if (this.isDefault) {
      if (colorContent) return false // can always make colored boxes

      if (isBoolean(tweeningSize)) return tweeningSize

      return this.isTweeningSize(args) // need mask to dynamically crop content
    }
    if (!colorContent) return true // always need to mask content

    return this.isTweeningColor(args)//tweeningSize || 
  }

  override visibleCommandFiles(args: VisibleCommandFileArgs): CommandFiles {
    const { isDefault, id } = this
    const alpha = this.requiresAlpha(args)
    const tweeningColor = this.isTweeningColor(args)
    if (isDefault && !alpha) return []
    
    const { asset } = this
    const { path: assetPath } = asset
    const { contentColors: colors = [], containerRects, time, videoRate } = args
    assertPopulatedArray(containerRects, 'containerRects')

    const duration = isTimeRange(time) ? time.lengthSeconds : 0

    const maxSize: Size = sizeEven(tweenMaxSize(...containerRects))
    const { width: maxWidth, height: maxHeight} = maxSize

    let [forecolor] = colors
    if (alpha) forecolor = RGB_WHITE
    else if (tweeningColor) forecolor = RGB_BLACK
   
    let fill = NONE
    if (isDefault) fill = RGB_WHITE
    else if (alpha) fill = RGBA_BLACK

    const intrinsicRect = isDefault ? maxSize : this.intrinsicRect()
    const { width: inWidth, height: inHeight } = intrinsicRect
    const dimensionsString = `width='${inWidth}' height='${inHeight}'`

    const transformAttribute = rectTransformAttribute(intrinsicRect, { ...POINT_ZERO, ...maxSize })
    const tags: string[] = []
    tags.push(`<svg viewBox='0 0 ${maxWidth} ${maxHeight}' xmlns='${NAMESPACE_SVG}'>`)
    tags.push(`<g ${dimensionsString} transform='${transformAttribute}' >`)
    tags.push(`<rect ${dimensionsString} fill='${fill}'/>`)
    if (!isDefault) tags.push(`<path d='${assetPath}' fill='${forecolor}'/>`)
    tags.push('</g>')
    tags.push('</svg>')
    const content = tags.join('')
    const type = SVG
    const fileName = fileNameFromContent(content)
    const directory = ENV.get(ENV_KEY.ApiDirCache)
    const name = [fileName, DOT, type].join('')
    const file = path.resolve(directory, name)

    const options: ValueRecord = {}
    if (duration) {
      options.loop = 1
      options.framerate = videoRate
      options.t = duration
      // options.re = ''
    }
    const commandFile: CommandFile = { 
      type, file, content, 
      input: true, inputId: id, definition: asset, options
    }
  
    return [commandFile]
  }

}

