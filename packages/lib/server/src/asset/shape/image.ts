
import type {
  ValueRecord, ShapeInstance, ShapeInstanceObject, ShapeAssetObject, 
} from '@moviemasher/runtime-shared'
import type {
  CommandFile, CommandFileArgs, 
  VisibleCommandFileArgs, CommandFiles, 
  ServerShapeInstance, ServerShapeAsset,
  CommandFilter, 
  CommandFilterArgs, VisibleCommandFilterArgs, CommandFilters, Tweening, 
} from '@moviemasher/lib-shared'
import {
   isAssetObject, isBoolean, isPopulatedString, SourceShape, TypeImage 
} from '@moviemasher/runtime-shared'
import { 
  EventAsset,
  GraphFileTypeSvg, MovieMasher 
} from '@moviemasher/runtime-server'

import { 
  ServerAssetClass, ServerInstanceClass, ServerVisibleAssetMixin, 
  ServerVisibleInstanceMixin, ShapeAssetMixin, 
  ShapeInstanceMixin, VisibleAssetMixin, 
  VisibleInstanceMixin,  
  isPopulatedArray, 
  assertPopulatedString, commandFilesInput, tweenMaxSize, sizeEven, 
  idGenerate, sizesEqual, colorBlackOpaque, arrayLast, 
  rectsEqual, 
  svgTransform, NamespaceSvg, 
  colorBlack, colorWhite, POINT_ZERO, isTimeRange, assertPopulatedArray, 
  DefaultContainerId,
  isTrueValue 
} from '@moviemasher/lib-shared'

const WithAsset = VisibleAssetMixin(ServerAssetClass)
const WithServerAsset = ServerVisibleAssetMixin(WithAsset)
const WithShapeAsset = ShapeAssetMixin(WithServerAsset)

export class ServerShapeAssetClass extends WithShapeAsset implements ServerShapeAsset {
  override instanceFromObject(object?: ShapeInstanceObject): ShapeInstance {
    const args = this.instanceArgs(object)
    return new ServerShapeInstanceClass(args)
  }
  private static _defaultAsset?: ServerShapeAsset
  private static get defaultAsset(): ServerShapeAsset {
    return this._defaultAsset ||= new ServerShapeAssetClass({ 
      id: DefaultContainerId, type: TypeImage, 
      source: SourceShape, label: 'Rectangle'
    })
  }
  static handleAsset(event: EventAsset) {
    const { detail } = event
    const { assetObject, assetId } = detail
    
    const isDefault = assetId === DefaultContainerId
    if (!(isDefault || isAssetObject(assetObject, TypeImage, SourceShape))) return
      
    event.stopImmediatePropagation()
    if (isDefault) detail.asset = ServerShapeAssetClass.defaultAsset
    else detail.asset = new ServerShapeAssetClass(assetObject as ShapeAssetObject) 
  }
}

// listen for image/shape asset event
MovieMasher.eventDispatcher.addDispatchListener(
  EventAsset.Type, ServerShapeAssetClass.handleAsset
)

const WithInstance = VisibleInstanceMixin(ServerInstanceClass)
const WithServerInstance = ServerVisibleInstanceMixin(WithInstance)
const WithShapeInstance = ShapeInstanceMixin(WithServerInstance)

export class ServerShapeInstanceClass extends WithShapeInstance implements ServerShapeInstance { 
  declare asset: ServerShapeAsset

  override canColor(args: CommandFilterArgs): boolean { 
    const { isDefault } = this

    // default rect has no content to colorize, so needs color filter input
    if (isDefault) return false

    // shape files can only colorize a single color at a single size
    return !this.isTweeningColor(args)
  }
  
  override containerColorCommandFilters(args: VisibleCommandFilterArgs): CommandFilters {
    const commandFilters: CommandFilters = [] 
    // i am either default rect or a shape tweening color

    const { isDefault } = this
    const { contentColors, containerRects, videoRate, duration } = args
    assertPopulatedArray(contentColors, 'contentColors')

    const [rect, rectEnd] = containerRects
    const [color, colorEnd] = contentColors
    const maxSize = isDefault ? rect : tweenMaxSize(...containerRects)

    const endRect = isDefault ? rectEnd : maxSize

  
    commandFilters.push(...this.colorCommandFilters(duration, videoRate, maxSize, endRect, color || colorWhite, colorEnd))
    return commandFilters
  }

  override containerCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    const commandFilters: CommandFilters = [] 
    const { 
      contentColors: colors, commandFiles, filterInput: input 
    } = args

    let filterInput = input
    // console.log(this.constructor.name, 'containerCommandFilters', filterInput)


    const noContentFilters = isPopulatedArray(colors)
    const alpha = this.requiresAlpha(args, !!tweening.size)
    if (alpha) {
      assertPopulatedString(filterInput, 'container input')
      const { contentColors: _, ...argsWithoutColors } = args
      const superArgs: VisibleCommandFilterArgs = { 
        ...argsWithoutColors, filterInput
      }

      commandFilters.push(...super.containerCommandFilters(superArgs, tweening))
    } else if (this.isDefault || noContentFilters) {
      const { id } = this
      // if (!filterInput) console.log(this.constructor.name, 'containerCommandFilters calling commandFilesInput', id)
      
      filterInput ||= commandFilesInput(commandFiles, id, true)
      assertPopulatedString(filterInput, 'final input')
      
      commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput}))
    }
    return commandFilters
  }

  override initialCommandFilters(args: VisibleCommandFilterArgs, tweening: Tweening, _container = false): CommandFilters {
    const commandFilters: CommandFilters = [] 
    const { contentColors, ...argsWithoutColors } = args

    const { 
      commandFiles, track, filterInput: input, containerRects,
    } = argsWithoutColors

    let filterInput = input 
    const alpha = this.requiresAlpha(args, !!tweening.size)
    const { isDefault } = this
    const tweeningSize = tweening.size // !(isDefault ? rectsEqual(...containerRects) : sizesEqual(...containerRects))
    const maxSize = tweeningSize ? tweenMaxSize(...containerRects) : containerRects[0]
    const evenSize = sizeEven(maxSize)
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
        } else if (!sizesEqual(evenSize, maxSize)) {
          const colorArgs: VisibleCommandFilterArgs = { 
            ...args, 
            contentColors: [colorBlackOpaque, colorBlackOpaque], 
            outputSize: evenSize
          }
          commandFilters.push(...this.colorBackCommandFilters(colorArgs, `${contentInput}-back`))
          const colorInput = arrayLast(arrayLast(commandFilters).outputs) 
          assertPopulatedString(filterInput, 'overlay input')
      
          commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput))
          filterInput = arrayLast(arrayLast(commandFilters).outputs)  
        }
      }   
    }
    
    if (commandFilters.length) arrayLast(commandFilters).outputs = [contentInput]
    else if (isPopulatedString(filterInput) && contentInput !== filterInput) {
      commandFilters.push(this.copyCommandFilter(filterInput, track))
    }

    if (alpha) {
      const { id } = this
      // console.log(this.constructor.name, 'initialCommandFilters ALPHA calling commandFilesInput', id)
      const fileInput = commandFilesInput(commandFiles, id, true)   
      assertPopulatedString(fileInput, 'scale input')

      const colorArgs: VisibleCommandFilterArgs = { 
        ...args, 
        contentColors: [colorBlackOpaque, colorBlackOpaque], 
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

      const options: ValueRecord = { exact: 1, ...POINT_ZERO }
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
 
      const formatFilter = 'format'
      const formatCommandFilter: CommandFilter = {
        inputs: [filterInput], ffmpegFilter: formatFilter, 
        options: { pix_fmts: alpha ? 'yuv420p' : 'yuva420p' },
        outputs: [containerInput]
      }
      commandFilters.push(formatCommandFilter)
    } 
    return commandFilters
  }

  private isTweeningColor(args: CommandFileArgs): boolean {
    const { contentColors } = args
    if (!isPopulatedArray(contentColors)) return false

    const [forecolor, forecolorEnd] = contentColors
    return forecolor !== forecolorEnd
  }

  private isTweeningSize(args: CommandFileArgs): boolean {
    const { containerRects } = args
    if (!isPopulatedArray(containerRects)) {
      // console.log(this.constructor.name, 'isTweeningSize FALSE BECAUSE containerRects NOT ARRAY', args)
      return false
    }

    const equal = rectsEqual(...containerRects)
    // if (equal) {
    //   // console.log(this.constructor.name, 'isTweeningSize FALSE BECAUSE containerRects EQUAL', args)
    // }
    return !equal
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
    if (isDefault && !alpha) {
      // console.log(this.constructor.name, 'commandFiles NONE', id, isDefault, alpha, tweeningColor)
      return []
    }
    const { asset: definition } = this
    const { path } = definition
    const { contentColors: colors = [], containerRects, time, videoRate } = args
    assertPopulatedArray(containerRects, 'containerRects')

    const duration = isTimeRange(time) ? time.lengthSeconds : 0
    const [rect, rectEnd] = containerRects
    const maxSize = { ...POINT_ZERO, ...tweenMaxSize(rect, rectEnd)}
    const { width: maxWidth, height: maxHeight} = maxSize

    let [forecolor] = colors
    if (alpha) forecolor = colorWhite
    else if (tweeningColor) forecolor = colorBlack
   
    let fill = 'none'
    if (isDefault) fill = colorWhite
    else if (alpha) fill = colorBlack

    const intrinsicRect = isDefault ? maxSize : this.intrinsicRect()
    const { width: inWidth, height: inHeight } = intrinsicRect
    const dimensionsString = `width='${inWidth}' height='${inHeight}'`

    const transformAttribute = svgTransform(intrinsicRect, maxSize)
    const tags: string[] = []
    tags.push(`<svg viewBox='0 0 ${maxWidth} ${maxHeight}' xmlns='${NamespaceSvg}'>`)
    tags.push(`<g ${dimensionsString} transform='${transformAttribute}' >`)
    tags.push(`<rect ${dimensionsString} fill='${fill}'/>`)
    if (!isDefault) tags.push(`<path d='${path}' fill='${forecolor}'/>`)
    tags.push('</g>')
    tags.push('</svg>')
    const svgTag = tags.join('')
  
    const options: ValueRecord = {}
    if (duration) {
      options.loop = 1
      options.framerate = videoRate
      options.t = duration
      // options.re = ''
    }
    const commandFile: CommandFile = { 
      type: GraphFileTypeSvg, file: id, content: svgTag, 
      input: true, inputId: id, definition, options
    }
  
    return [commandFile]
  }

}

