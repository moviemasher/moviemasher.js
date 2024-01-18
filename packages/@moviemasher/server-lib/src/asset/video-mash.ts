import type { AVType, AbsolutePath, ArrayOf2, Asset, AssetObject, CacheArgs, ClipObject, ContainerRectArgs, ContentRectArgs, DataOrError, InstanceArgs, ListenersFunction, MashInstanceObject, MashVideoAssetObject, Point, Rect, RectTuple, Rounding, Size, SizeTuple, Strings, SvgItemArgs, SvgItems, Time, TrackArgs, Transparency, Value, ValueRecord, Values, VisibleInstance } from '@moviemasher/shared-lib/types.js'
import type { ServerClip, ServerClips, ServerMashAsset, ServerMashVideoAsset, ServerMashVideoInstance, ServerTrack } from '../type/ServerMashTypes.js'
import type { Tweening } from '../type/ServerTypes.js'
import type { AudibleCommandFilterArgs, AudioCommandFileArgs, CommandFile, CommandFiles, CommandFilter, CommandFilters, AssetFiles, ServerAudioInstance, ServerContainerInstance, ServerContentInstance, ServerMashDescription, ServerMashDescriptionOptions, ServerVisibleInstance, VideoCommandFileOptions, VideoCommandFilterArgs, VisibleCommandFileArgs, VisibleCommandFilterArgs } from '../types.js'

import { ClipClass } from '@moviemasher/shared-lib/base/clip.js'
import { TrackClass } from '@moviemasher/shared-lib/base/track.js'
import { AudibleAssetMixin, AudibleInstanceMixin } from '@moviemasher/shared-lib/mixin/audible.js'
import { MashAssetMixin } from '@moviemasher/shared-lib/mixin/mash.js'
import { VideoAssetMixin, VideoInstanceMixin } from '@moviemasher/shared-lib/mixin/video.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'
import { $POINT, $SIZE, ALPHA, AUDIO, CEIL, COLON, CONTAINER, CONTENT, DASH, DOT, ERROR, FLIP, FLOOR, FRAME, HEIGHT, MASH, MOVIEMASHER, POINT_ZERO, RGBA_BLACK_ZERO, RGB_BLACK, RGB_WHITE, ROUND, SVG, SVGS, VIDEO, WIDTH, arrayLast, assertAsset, errorThrow, idGenerate, isAssetObject, isDefiniteError, isNumber, namedError } from '@moviemasher/shared-lib/runtime.js'
import { assertCanBeContainerInstance, assertDefined, assertPopulatedString, isComplexSvgItem } from '@moviemasher/shared-lib/utility/guards.js'
import { assertSizeAboveZero, pointCopy, pointRound, pointTranslate, pointsEqual, sizeEven, sizesEqual, sizeCopy, rectsEqual, sizeLock, MIN_DIMENSION, sideDirectionRecordFlip } from '@moviemasher/shared-lib/utility/rect.js'
import { ServerAssetClass } from '../base/asset.js'
import { ServerInstanceClass } from '../base/instance.js'
import { ServerMashDescriptionClass } from '../encode/ServerMashDescriptionClass.js'
import { assertServerAudibleInstance, assertServerContainerInstance, assertServerContentInstance, assertServerVisibleInstance, isServerAudibleInstance } from '../guard/assets.js'
import { ServerAudibleAssetMixin, ServerAudibleInstanceMixin } from '../mixin/audible.js'
import { ServerVisibleAssetMixin, ServerVisibleInstanceMixin } from '../mixin/visible.js'
import { EventServerAsset, EventServerManagedAsset, } from '../runtime.js'
import path from 'path'
import { assertTimeRange, isTimeRange } from '@moviemasher/shared-lib/utility/time.js'
import { $ADD, $DIVIDE, $GT, $IF, $MAX, $MULTIPLY, $SUBTRACT, operate, sizeValueString, tweenOption, tweenPosition } from '../utility/Command.js'
import { svgAppend, svgDefsElement, svgGroupElement, svgPolygonElement, svgSvgElement, svgClipPathElement, svgMaskElement, svgSet, svgText, svgSetDimensions } from '@moviemasher/shared-lib/utility/svg.js'

const WithMashAsset = MashAssetMixin(ServerAssetClass)
export class ServerMashAssetClass extends WithMashAsset implements ServerMashAsset {
  override get clips(): ServerClips { return super.clips as ServerClips }

  clipsInTimeOfType(time: Time, avType?: AVType): ServerClips {
    return super.clipsInTimeOfType(time, avType) as ServerClips
  }

  clipInstance(object: ClipObject): ServerClip {
    return new ServerClipClass(object)
  } 

  assetFiles(args: CacheArgs): AssetFiles {
    return errorThrow(ERROR.Unimplemented)
  }
  
  override mashDescription(options: ServerMashDescriptionOptions): ServerMashDescription {
    return new ServerMashDescriptionClass({ ...options, mash: this })
  }

  override trackInstance(args: TrackArgs): ServerTrack {
    return new ServerTrackClass(args)
  }
}

export class ServerClipClass extends ClipClass implements ServerClip {
  override asset(assetIdOrObject: string | AssetObject): Asset {
    const event = new EventServerManagedAsset(assetIdOrObject)
    MOVIEMASHER.eventDispatcher.dispatch(event)
    const { asset } = event.detail
    assertAsset(asset)
    
    return asset
  }

  audioCommandFiles(args: AudioCommandFileArgs): CommandFiles {
    const { content } = this
    assertServerAudibleInstance(content)

    const commandFiles: CommandFiles = []
    const clipTime = this.timeRange
    const contentArgs: AudioCommandFileArgs = { ...args, clipTime }
    commandFiles.push(...content.audibleCommandFiles(contentArgs)) 
    return commandFiles
  }

  audioCommandFilters(args: AudibleCommandFilterArgs): CommandFilters {
    const clipTime = this.timeRange
    const contentArgs: AudibleCommandFilterArgs = { ...args, clipTime }
    const { content } = this
    assertServerAudibleInstance(content, 'ServerAudibleInstance')
    return audibleCommandFilters(contentArgs, content)
  }

  override get container(): ServerContainerInstance { return super.container as ServerContainerInstance}

  override get content(): ServerContentInstance | ServerAudioInstance { 
    return super.content as ServerContentInstance | ServerAudioInstance 
  }

  precoding?: AbsolutePath
  
  get requiresPrecoding(): boolean {
    const { container, content } = this
    assertServerContentInstance(content, 'content')
    if (content.asset.canBeFill) return false

    if (container.tweens($SIZE) && container.tweens($POINT)) return true
    if (content.tweens($SIZE) && content.tweens($POINT)) return true
  
    return false
  }

  private svgFilesForTime(encodePath: AbsolutePath, timeOrRange: Time, outputSize: Size, videoRate: number, debug?: boolean): DataOrError<CommandFiles>{
    const svgFiles: CommandFiles = []
    const result = { data: svgFiles }
    const base_uri = `file://${path.dirname(encodePath)}`
    const shortest = outputSize.width < outputSize.height ? WIDTH : HEIGHT
    
    const { content, container, timeRange, transparency, precoding, clipIndex } = this
    assertCanBeContainerInstance(container, 'container')
    assertServerVisibleInstance(content, 'content')

    const { asset: contentAsset } = content
    const { canBeFill: contentCanBeFill } = contentAsset

    const isRange = isTimeRange(timeOrRange)
    if (isRange) assertTimeRange(timeOrRange, 'timeOrRange')
    
    const intersection = timeRange.intersection(timeOrRange)
    if (!intersection) return result

    const tweening = contentCanBeFill ? this.tweening : container.tweening
    const times = isRange && tweening ? intersection.scale(videoRate).frameTimes : [intersection]

    const { asset: containerAsset, id: containerId } = container
    const { isVector, canBeFill: containerCanBeFill, id: containerAssetId } = containerAsset
    if (!(isVector || containerCanBeFill)) return namedError(ERROR.Unavailable, 'container svg')
    
    const id = ['matte', containerAssetId].join(DASH)
    const containerRectArgs: ContainerRectArgs = {
      size: outputSize, time: intersection, timeRange
    }
    const containerRects = this.clipRects(containerRectArgs)
    const contentRectArgs: ContentRectArgs = {
      containerRects, time: intersection, timeRange, shortest
    }
    const contentRects = content.contentRects(contentRectArgs)
    const frameRect = offsetRect(precoding ? containerRects : contentRects, outputSize)
    // console.log(this.constructor.name, 'svgFilesForTime', { frameRect, precoding })
    const offsetPoint = contentCanBeFill ? POINT_ZERO : pointTranslate(POINT_ZERO, frameRect, true) 
    const svgSize = contentCanBeFill ? outputSize : frameRect

    const { length } = times
    const pad = String(length).length
    const multipleTimes = length > 1
    const color = contentCanBeFill ? RGB_BLACK : RGB_WHITE
    const backColor = contentCanBeFill ? RGBA_BLACK_ZERO : (transparency === ALPHA ? RGBA_BLACK_ZERO : RGB_BLACK)
    const [firstTime] = times
    const lastTime = arrayLast(times) 
    const inputOptions: ValueRecord = { framerate: videoRate, base_uri }//, loop: 0
      
    // const start = intersection.seconds
    // if (start) options.itsoffset = start
    if (isRange) inputOptions.t = timeOrRange.lengthSeconds
      
    for (const [index, time] of times.entries()) {
      const items: SvgItems = []
      const defs: SvgItems = []
      const styles: SvgItems = []

      const timeContainerRects = index ? this.clipRects({ ...containerRectArgs, time }) : containerRects
      const [containerRect] = timeContainerRects
      
      const rect = { ...containerRect, ...pointTranslate(containerRect, offsetPoint) }
      const args: SvgItemArgs = { rect, time, color, timeRange, size: outputSize }
      const containerOrError = container.containerSvgItem(args)
      if (isDefiniteError(containerOrError)) return containerOrError
    
      const { data: item } = containerOrError
      const complexContainer = isComplexSvgItem(item) ? item : { svgItem: item }
      const { svgItem: containerSvg, defs: containerDefs = [], style: containerStyle } = complexContainer
      if (containerStyle) styles.push(containerStyle)
      if (containerDefs?.length) defs.push(...containerDefs)
      if (contentCanBeFill) {
        const contentOrError = content.contentSvgItem(args)
        if (isDefiniteError(contentOrError)) return contentOrError

        const { data: item } = contentOrError
        const complexContent = isComplexSvgItem(item) ? item : { svgItem: item }
        const { svgItem: contentSvg, defs: contentDefs = [], style: contentStyle } = complexContent
        if (contentStyle) styles.push(contentStyle)
        if (contentDefs?.length) defs.push(...contentDefs)
        const group = svgGroupElement()
        svgAppend(group, contentSvg)
        const maskElement = containerAsset.isVector ? svgClipPathElement(group, id) : svgMaskElement(group, transparency, id)
        svgAppend(maskElement, containerSvg)
        defs.push(maskElement)
        items.push(group)
      } else items.push(containerSvg)
      const children: SvgItems = [...styles]
      if (defs.length) children.push(svgDefsElement(defs))
      children.push(svgPolygonElement(svgSize, '', backColor), ...items)

      // debug
      if (debug) {
        const color = RGB_BLACK
        const [contentRect] = index ? content.contentRects({ ...contentRectArgs, time, even: false, containerRects: timeContainerRects }) : contentRects
        const translatedRect = { ...contentRect, ...pointTranslate(contentRect, offsetPoint) }
        const debugElement = svgPolygonElement(translatedRect, '', RGBA_BLACK_ZERO)
        svgSet(debugElement, color, 'stroke')
        svgSet(debugElement, '1', 'stroke-width')
        children.push(debugElement)
        const textElement = svgText(time.frame, color, 12)
        // svgSet(textElement, 'hanging', 'dominant-baseline')
        svgSetDimensions(textElement, pointTranslate(translatedRect, { x: 0, y: 12 }))
        children.push(textElement)
      }

      const svg = svgSvgElement(svgSize, children, true)
      const { outerHTML: text } = svg
      const nameBits: Values = [firstTime.frame, lastTime.frame]
      if (multipleTimes) {
        nameBits.push(FRAME, String(1 + time.frame - firstTime.frame).padStart(pad, '0'))
      }
      const file = path.join(encodePath, SVGS, clipIndex.join(DASH), [nameBits.join(DASH), SVG].join(DOT))
   
      const svgFile: CommandFile = { 
        inputId: containerId, content: text, inputOptions, avType: VIDEO,
        type: SVGS, asset: containerAsset, file,
        path: file.replace(/-frame-([0-9]+).svg/, (_, p1) => (
          `-frame-%0${p1.length}d.svg`
        )),
      }  
      svgFiles.push(svgFile)
    }
    return result
  }
  
  videoCommandFiles(args: VideoCommandFileOptions): CommandFiles {
    const debug = true
    const files: CommandFiles = []
    const { content, container, timeRange, precoding, timeRange: clipTime } = this
    assertServerVisibleInstance(content, 'content')

    const { outputSize, time, videoRate, encodePath,  } = args
    assertSizeAboveZero(outputSize, 'outputSize')

    const containerRectArgs: ContainerRectArgs = {
      size: outputSize, time, timeRange
    }
    const containerRects = this.clipRects(containerRectArgs)
    const fileArgs: VisibleCommandFileArgs = { 
      ...args, clipTime: timeRange, outputSize, containerRects
    }
    if (precoding) {
      const intersection = clipTime.intersection(time)
      assertDefined(intersection, 'intersection')
   
      const { seconds: startSeconds } = content.assetTime(intersection)
      // const duration = endAssetTime ? endAssetTime.seconds - startSeconds : 0


      const inputOptions: ValueRecord = { }
      if (startSeconds) inputOptions.ss = startSeconds
   
      const file: CommandFile = {
        type: VIDEO, asset: content.asset, file: precoding, 
        inputId: content.id, avType: VIDEO, inputOptions
      }
      // console.log(this.constructor.name, 'videoCommandFiles ADDING', file)
      files.push(file)
    }
    const contentOrNot = precoding ? undefined : content
    const containerFiles = container.visibleCommandFiles(fileArgs, contentOrNot)
    files.push(...containerFiles)
    const svgFilesOrError = this.svgFilesForTime(encodePath, time, outputSize, videoRate, debug)
    if (!isDefiniteError(svgFilesOrError)) files.push(...svgFilesOrError.data)
    return files
  }

  videoCommandFilters(args: VideoCommandFilterArgs): CommandFilters {
    const debug = true
    const filters: CommandFilters = []
    const { outputSize, time: outputTime, commandFiles, track, chainInput, clipTime } = args
    assertSizeAboveZero(outputSize, 'outputSize')

    const outputRect = { ...POINT_ZERO, ...outputSize }
    const shortest = outputSize.width < outputSize.height ? WIDTH : HEIGHT

    let { filterInput } = args

    const { content, container, transparency, precoding } = this
    const time = clipTime.intersection(outputTime)
    assertTimeRange(time)

    assertCanBeContainerInstance(container, 'container')
    assertServerVisibleInstance(content, 'content')

    const containerRectArgs: ContainerRectArgs = { 
      size: outputSize, time, timeRange: clipTime 
    }
    const containerRects = this.clipRects(containerRectArgs)    

    const visibleArgs: VisibleCommandFilterArgs = { ...args, containerRects }
    
    const tweening: Tweening = { point: false, size: false }
    if (containerRects.length > 1) {
      tweening.point = !pointsEqual(containerRects[0], containerRects[1])
      tweening.size = !sizesEqual(containerRects[0], containerRects[1])
    }
    const svgCommandFiles = commandFiles.filter(file => file.asset === container.asset && SVGS == file.type)
    if (svgCommandFiles.length) {
      const { canBeFill } = content.asset
      filters.push(copyFilter(container, track)) 
      const containerInputId = arrayLast(arrayLast(filters).outputs)
      if (!canBeFill) {
        const contentArgs: ContentRectArgs = {
          containerRects, time, timeRange: clipTime, shortest
        }
        const contentRects = content.contentRects(contentArgs)
        const frameRect = offsetRect(precoding ? containerRects : contentRects, outputSize)
        // console.log(this.constructor.name, 'videoCommandFilters', { frameRect, precoding })

        if (precoding) {  
          filters.push(...precodeCommandFilters(frameRect, content, visibleArgs))   
          
        } else {
          if (contentRects.length > 1) {
            tweening.point ||= !pointsEqual(contentRects[0], contentRects[1])
            tweening.size ||= !sizesEqual(contentRects[0], contentRects[1])
          }
          filters.push(...contentCommandFilters(this, frameRect, contentRects, container, content, visibleArgs, tweening, debug))   
        }
        filterInput = arrayLast(arrayLast(filters).outputs)

        const alphaId = idGenerate('alpha')
        filters.push(...alphamergeCommandFilters(containerInputId, filterInput, alphaId, transparency, debug))  

        // TODO: only crop if needed 
        const cropRect = { ...outputSize, ...pointTranslate(POINT_ZERO, frameRect, true)}
        if (!rectsEqual(cropRect, outputRect)) {
          const cropId = idGenerate('crop')
          filters.push(cropFilter(alphaId, cropId, cropRect))
          filterInput = cropId
        }
      }        
    } else {
      // this should only happen for raw video containers
      const initialFilters = container.initialCommandFilters(visibleArgs, tweening, !!content)
      if (initialFilters.length) {
        filters.push(...initialFilters)
        filterInput = arrayLast(arrayLast(initialFilters).outputs)
      }        

      if (content) {
        filters.push(...container.containerCommandFilters({ ...visibleArgs, filterInput }, tweening))
      } else {
        // filters.push(...container.contentCommandFilters(inputArgs, tweening))
      }
    }
    filterInput = arrayLast(arrayLast(filters).outputs)
    filters.push(overlayCommandFilter(chainInput, filterInput, '', container.asset.alpha))
    return filters
  }
}

const contentCommandFilters = (clip: ServerClip, frameRect: Rect, contentRects: RectTuple, container: ServerVisibleInstance, content: ServerVisibleInstance, args: VisibleCommandFilterArgs, tweening: Tweening, debug?: boolean): CommandFilters => {
  const filters: CommandFilters = []
  const { videoRate, duration, time, clipTime, containerRects, outputSize, commandFiles } = args

  // console.log('contentCommandFilters', { containerRects, contentRects, frameRect })
 
  const [contentRectStart, contentRectEnd] = contentRects
  const { id, asset } = content
  const commandFile = commandFiles.find(file => file.asset === asset && VIDEO === file.avType)

  const { size, point } = tweening
  const { alpha } = asset
  let colorId = idGenerate('color')
  const scaleId = idGenerate('scale')
  const setsarId = idGenerate('setsar') 
  const outputId = idGenerate('overlay')
  const options: ValueRecord = { ...POINT_ZERO }
  const sizePosition = tweenPosition(videoRate, duration) 
  const pointPosition = tweenPosition(videoRate, duration, 1) // overlay bug

  const contentId = commandFile ? commandFile.inputId : id
  let filterInput = [contentId, 'v'].join(COLON)
  
  // debug - ignore content input and instead work with colorspectrum
  if (debug) {
    const spectrumId = idGenerate('spectrum')
    filters.push(spectrumFilter(videoRate, spectrumId))
    filterInput = spectrumId
  }
  // other filters are overlain atop this color (which shouldn't be visible)
  filters.push(colorFilter('#FFFFFF', frameRect, videoRate, colorId))
  

  if (debug) {
    filters.push(...debugFilters(colorId, clip, args, frameRect))
    colorId = arrayLast(arrayLast(filters).outputs)
  }

  if (isServerAudibleInstance(content)) {
    const setptsId = idGenerate('setpts')
    filters.push(...setPtsSpeedFilters(filterInput, setptsId, content))
    filterInput = setptsId
  } 

  if (size && point) {
    const contentPoint = contentValuePoint(pointPosition, clip, args)

    // now we just offset by the frame rect
    options.x = operate($SUBTRACT, [contentPoint.x, frameRect.x])
    options.y = operate($SUBTRACT, [contentPoint.y, frameRect.y])

    filters.push(...dynamicScaleFilter(filterInput, scaleId, sizePosition, args, content))
    filterInput = scaleId
  } else {
    // scale our input file to the content rect linearly over time
    filters.push(scaleFilter(filterInput, scaleId, contentRectStart, contentRectEnd, sizePosition))
    filterInput = scaleId

    // reset sample aspect ratio 
    filters.push(setsarCommandFilter(filterInput, setsarId))
    filterInput = setsarId

    // scale our input file to the content rect
    const translatedRects = contentRects.map(rect => {
      return { ...rect, ...pointTranslate(rect, frameRect, true) }
    }) as RectTuple
    const [translatedRectStart, translatedRectEnd] = translatedRects
    const endX = duration ? translatedRectEnd.x : 0.5
    const endY = duration ? translatedRectEnd.y : 0.5
    options.x = tweenOption(translatedRectStart.x, endX, pointPosition)
    options.y = tweenOption(translatedRectStart.y, endY, pointPosition)
  }
  console.log('options', options)
  filters.push(overlayCommandFilter(colorId, filterInput, outputId, alpha, options))
  return filters
}

const contentValuePoint = (position: string, clip: ServerClip, args: VisibleCommandFilterArgs): ValuePoint => {
  const { outputSize, containerRects, time, clipTime } = args
  const { container, content } = clip
  assertServerContainerInstance(container, 'container')

  const containerScalingRects = container.scaleRects(time, clipTime)

  const { pointAspect, sizeAspect, sideDirectionRecord: sideDirections, propertySize } = container 
  const intrinsicSize = clip.sizingRect(outputSize)

  // determine if point and/or size needs flipping
  const outputtingPortrait = outputSize.width < outputSize.height
  const pointFlipping = outputtingPortrait && pointAspect === FLIP 
  const directions = pointFlipping ? sideDirectionRecordFlip(sideDirections) : sideDirections
  const containerValueSize = tweenValueSize(containerRects, position)
  const containerScalingValuePoint = tweenValuePoint(containerScalingRects, position)
  const { left, right, top, bottom } = directions
  const containerValuePoint: ValuePoint = {
    x: padValuePoint(outputSize.width, containerValueSize.width, containerScalingValuePoint.x, left, right), 
    y: padValuePoint(outputSize.height, containerValueSize.height, containerScalingValuePoint.y, top, bottom)
  }
  console.log('contentValuePoint', { containerValuePoint, containerValueSize, containerScalingValuePoint })
  const contentSize = { width: 'w', height: 'h' }

  // determine content size
  const contentScalingRects = content.scaleRects(time, clipTime)
  const containerSize = valueSizeEven(containerValueSize, CEIL) 
  const contentScalingPoint = tweenValuePoint(contentScalingRects, position)

  // determine content point based on scaled content size and container size
  const contentPoint = scaledContentValuePoint(contentSize, containerSize, contentScalingPoint)

  return valuePointTranslate(containerValuePoint, contentPoint)
}


  // const containerValueRect = { ...containerValuePoint, ...containerValueSize }

  

  // const containerRects = containerScalingRects.map((scalingRect, index) => {
  //   const containerScalingPoint = pointFlipping ? pointFlip(scalingRect) : pointCopy(scalingRect)
  //   const containerSize = originalContainerRects[index]
  //   const { left, right, top, bottom } = directions
  //   const containerPoint = {
  //     x: padValuePoint(outputSize.width, containerSize.width, containerScalingPoint.x, left, right), 
  //     y: padValuePoint(outputSize.height, containerSize.height, containerScalingPoint.y, top, bottom)
  //   }
  //   const rect: ValueRect = { ...containerSize, ...containerPoint }
  //   return rect
  // }) 

  // flip sideDirection if needed
  // not sure why we don't do this for content??  
  // const containerValueRects: ValueRect[] = containerScalingRects.map(rect => {
  //   const containerScalingPoint: Point = pointFlipping ? pointFlip(rect) : pointCopy(rect)
  //   const containerScalingSize: Size = sizeFlipping ? sizeFlip(rect) : sizeCopy(rect)
  //   if (propertySize) {
  //     // lock other side to same aspect ratio as intrinsic
  //     const other = propertySize === WIDTH ? HEIGHT : WIDTH
  //     const ratio = intrinsicSize[other] / intrinsicSize[propertySize]
  //     containerScalingSize[other] = ((outputSize[propertySize] * containerScalingSize[propertySize]) * ratio) / outputSize[other]
  //   }
  //   const containerScaledSize = valueSizeScale(outputSize, containerScalingSize.width, containerScalingSize.height)
  //   const containerSize = valueSizeEven(containerScaledSize, CEIL) 
  //   const { left, right, top, bottom } = directions
  //   const containerPoint = {
  //     x: padValuePoint(outputSize.width, containerSize.width, containerScalingPoint.x, left, right), 
  //     y: padValuePoint(outputSize.height, containerSize.height, containerScalingPoint.y, top, bottom)
  //   }
  //   return { ...containerSize, ...containerPoint }
      
  //   // const scalingRect = { ...scalingPoint, ...containerScalingSize }
    
  //   // return scalingRect
  // })


  // const containerScalingPoint = tweenPointExpression(scalingRects, position)

  
  // const containerPoint = {
  //   x: padValuePoint(outputSize.width, containerSize.width, containerScalingPoint.x, left, right), 
  //   y: padValuePoint(outputSize.height, containerSize.height, containerScalingPoint.y, top, bottom),
  // }

  // content size is from dynamic variables



  // return contentPointExpressions(ctainerScaleSize, containerRect, propertySize)

  
  // return containerScalingRects.map((tweenRect, index) => {
  //   const containerRect = containerRects[index]
  //   const contentScalingRect = contentScalingRects[index]

  //   // flip point and size if needed
  //   const point = pointFlipping ? pointFlip(tweenRect) : tweenRect
  //   const size = sizeFlipping ? sizeFlip(tweenRect) : sizeCopy(tweenRect)
  //   if (propertySize) {
  //     // lock other side to same aspect ratio as intrinsic
  //     const other = propertySize === WIDTH ? HEIGHT : WIDTH
  //     const ratio = clipIntrinsicRect[other] / clipIntrinsicRect[propertySize]
  //     size[other] = ((outputSize[propertySize] * size[propertySize]) * ratio) / outputSize[other]
  //   }
  //   const scaleRect = { ...point, ...size }
  //   const { width: outWidth, height: outHeight } = outputSize
  //   const { x, y, width: scaleWidth, height: scaleHeight } = scaleRect
  //   const scaledSize = sizeScale(outputSize, scaleWidth, scaleHeight)
  //   const evenSize = valueRecordEven(scaledSize, CEIL) 
  //   const { left, right, top, bottom } = directions
  //   const { width, height } = evenSize
  //   const evenPoint = {
  //     x: pointPad(outWidth, width, x, left, right), 
  //     y: pointPad(outHeight, height, y, top, bottom)
  //   }
  //   const containerRectExpression = { ...evenSize, ...evenPoint }   


  //   return contentPointExpressions(clipIntrinsicRect, contentScalingRect, containerRect, propertySize)

  //   // return containerRectExpression
  // }) as ValueRectTuple

interface ValueSizeTuple extends ArrayOf2<ValueSize> {}
interface ValuePointTuple extends ArrayOf2<ValuePoint> {}

const tweenValueOption = (optionStart: Value, optionEnd: Value, pos: Value): Value => {
  const start = operate(ROUND, optionStart) 
  const end = operate(ROUND, optionEnd) 
  if (start === end) return start
 
  const duration = operate($SUBTRACT, [end, start])
  const positionDuration = operate($MULTIPLY, [duration, pos])
  return operate($ADD, [start, positionDuration])
}

const tweenValueSize = (sizes: ValueSizeTuple | SizeTuple, position: Value): ValueSize => {
  const [startSize, endSize] = sizes 
  return valueSizeEven({
    width: tweenValueOption(startSize.width, endSize.width, position),
    height: tweenValueOption(startSize.height, endSize.height, position),
  })
}

const tweenValuePoint = (points: ValuePointTuple, position: Value): ValuePoint => {
  const [startPoint, endPoint] = points
  return {
    x: tweenValueOption(startPoint.x, endPoint.x, position),
    y: tweenValueOption(startPoint.y, endPoint.y, position),
  }
}
/** make sure size is integer, and at least 2x2 */ 
const valueSizeCeil = (size: Size | ValueSize): ValueSize => {
  const { width, height } = size
  const ceiled = { width: operate(CEIL, width), height: operate(CEIL, height) }
  return valueSizeMin(ceiled)
}

/** make sure size is at least 2x2 */ 
const valueSizeMin = (size: Size | ValueSize): ValueSize => {
  const { width, height } = size
  return {
    width: operate($MAX, [MIN_DIMENSION, width]),
    height: operate($MAX, [MIN_DIMENSION, height]),
  }
}

const valueSizeCover = (inSize: Size, outSize: Size | ValueSize): ValueSize => {
  assertSizeAboveZero(inSize, 'sizeCover.inSize')
  
  const { width: inWidth, height: inHeight } = inSize
  const { width: outWidth, height: outHeight } = outSize
  const scaleWidth = operate($DIVIDE, [outWidth, inWidth])
  const scaleHeight = operate($DIVIDE, [outHeight, inHeight])
  const scaledWidth = operate($MULTIPLY, [inWidth, scaleHeight])
  const scaledHeight = operate($MULTIPLY, [inHeight, scaleWidth])
  const gt = operate($GT, [scaleWidth, scaleHeight])
  const size = {
    width: operate($IF, [gt, outSize.width, scaledWidth]),
    height: operate($IF, [gt, scaledHeight, outSize.height]),
  }
  return valueSizeCeil(size)
}

const valueSizeScale = (size: Size | ValueSize, h: Value, v: Value): ValueSize => {
  console.log('valueSizeScale', { size, h, v })
  return { 
    width: operate($MULTIPLY, [size.width, h]), 
    height: operate($MULTIPLY, [size.height, v]) 
  }
}

const scaledContentValuePoint = (contentSize: Size | ValueSize, containerSize: Size | ValueSize, scalingPoint: Point | ValuePoint): ValuePoint => {
  const invertedScalingPoint = {
    x: operate($SUBTRACT, [1.0, scalingPoint.x]),
    y: operate($SUBTRACT, [1.0, scalingPoint.y]),
  }
  const availableSize = {
    width: operate($SUBTRACT, [containerSize.width, contentSize.width]),
    height: operate($SUBTRACT, [containerSize.height, contentSize.height]),
  }
  return {
    x: operate($MULTIPLY, [invertedScalingPoint.x, availableSize.width]),
    y: operate($MULTIPLY, [invertedScalingPoint.y,  availableSize.height]),
  }


  // const translated = sizeTranslateExpression(contentSize, containerSize, true)
  // return { 
  //   x: operate($MULTIPLY, scalingSize.width, translated.width),
  //   y: operate($MULTIPLY, scalingSize.height, translated.height), 
  // }
}

// const containerSizeExpression = (containerRects: RectTuple, position: string): ValueSize => {
//   const [containerRectStart, containerRectEnd] = containerRects
//   const options: ValueSize = {
//     width: tweenOption(containerRectStart.width, containerRectEnd.width, position),
//     height: tweenOption(containerRectStart.height, containerRectEnd.height, position),
//   }
//   return options
// }

// const contentPointExpressions = (containerScaleSize: Size | ValueSize, containerRect: Rect | ValueRect, propertySize?: PropertySize): ValuePoint => {
//   const containerSize = sizeCopy(containerRect)
//   const containerPoint = pointCopy(containerRect)
//   const lockedScaleSize: ValueSize = sizeLock(containerScaleSize, propertySize)
//   const contentSize = { width: 'w', height: 'h' }
//   const contentPoint = scaledContentPoint(contentSize, containerSize, lockedScaleSize)
//   return pointTranslateExpression(containerPoint, contentPoint)
// }

const valuePointTranslate = (point: Point | ValuePoint, translate: Point | ValuePoint, negate = false): ValuePoint => {
  const negated = negate ? {
    x: operate($MULTIPLY, [translate.x, -1]),
    y: operate($MULTIPLY, [translate.y, -1]),
  } : translate 
  const added = { 
    x: operate($ADD, [point.x, negated.x]), 
    y: operate($ADD, [point.y, negated.y])
  }
  return added
}

const valueEven = (number: Value, rounding: Rounding = ROUND): Value => {
  const divided = operate($DIVIDE, [number, 2])
  const rounded = operate(rounding, divided)
  const maxed = operate($MAX, [1, rounded])
  const multiplied = operate($MULTIPLY, [2, maxed])
  return multiplied
}

const valueSizeEven = (size: Size | ValueSize, rounding?: Rounding): ValueSize => {
  const { width, height } = size
  return {
    ...size,
    width: valueEven(width, rounding), height: valueEven(height, rounding)
  }
}

const padValuePoint = (outputDistance: Value, inputDistance: Value, scale: Value, startCrop = false, endCrop = false): Value => {
  const different = outputDistance !== inputDistance
  const baseDistance = different ? operate($SUBTRACT, [outputDistance, inputDistance]) : 0
  const eastAdded = startCrop ? operate($ADD, [baseDistance, inputDistance]) : baseDistance
  const westAdded = endCrop ? operate($ADD, [eastAdded, inputDistance]) : eastAdded
  const scaled = operate($MULTIPLY, [westAdded, scale])
  const offsetByEast = startCrop ? operate($SUBTRACT, [scaled, inputDistance]) : scaled
  return offsetByEast
}

interface ValuePoint {
  x: Value
  y: Value
}

interface ValueSize {
  width: Value
  height: Value
}

const debugFilters = (inputId: string, clip: ServerClip, args: VisibleCommandFilterArgs, frameRect: Rect): CommandFilters => {
  const { content, container } = clip
  assertServerContentInstance(content, 'content')
  assertServerContainerInstance(container, 'container')

  const { time: argsTime, clipTime, outputSize } = args
  const shortest = outputSize.width < outputSize.height ? WIDTH : HEIGHT
  assertTimeRange(argsTime)
  // const argsTime = timeRange.scale(videoRate)
  const { frameTimes } = argsTime
  let filterInput = inputId
  const color = 'red'
  return frameTimes.flatMap(time => {
    const containerArgs: ContainerRectArgs = { 
      size: outputSize, time, timeRange: clipTime 
    }
    const [containerRect] = clip.clipRects(containerArgs)
    const contentArgs: ContentRectArgs = {
      containerRects:  [containerRect, containerRect], 
      time, timeRange: clipTime, shortest
    }
    const [contentRect] = content.contentRects(contentArgs)
    const rect = { ...contentRect, ...pointTranslate(contentRect, frameRect, true) }
    const drawtextId = idGenerate('drawtext')
    const textFilter = drawtextFilter(filterInput, drawtextId, rect, time.frame, color)
    filterInput = drawtextId

    const drawboxId = idGenerate('drawbox')
    const boxFilter = drawboxFilter(filterInput, drawboxId, rect, color)
    filterInput = drawboxId
    return [textFilter, boxFilter]
  })    
}

const drawboxFilter = (inputId: string, outputId: string, rect: Rect, color: string = RGB_WHITE, thickness: Value = 1): CommandFilter => {
  const options = { ...rect, color, thickness }
  const commandFilter: CommandFilter = {
    ffmpegFilter: 'drawbox', options,
    inputs: [inputId], outputs: [outputId]
  }
  return commandFilter
}

const drawtextFilter = (inputId: string, outputId: string, point: Point, text: Value, fontcolor: string = RGB_WHITE, fontsize: number = 12): CommandFilter => {
  const options = { text, ...pointRound(point, FLOOR), fontcolor, fontsize }  
  const commandFilter: CommandFilter = {
    ffmpegFilter: 'drawtext', options, inputs: [inputId], outputs: [outputId]
  }
  return commandFilter
}

const dynamicScaleFilter = (inputId: string, outputId: string, position: string, args: VisibleCommandFilterArgs, content: ServerContentInstance): CommandFilters => {
  const { time, clipTime, containerRects } = args
  const containerSize = tweenValueSize(containerRects, position)
  const { propertySize, intrinsicRect: inRect } = content
  const [contentWidthStart, contentWidthEnd] = content.tweenValues(WIDTH, time, clipTime).map(Number)
  const [contentHeightStart, contentHeightEnd] = content.tweenValues(HEIGHT, time, clipTime).map(Number)
  const scaleSizeExpressions = { 
    width: tweenOption(contentWidthStart, contentWidthEnd, position, true), 
    height: tweenOption(contentHeightStart, contentHeightEnd, position, true) 
  }

  const scaleSize = sizeLock(scaleSizeExpressions, propertySize)
  const inSize = sizeCopy(inRect)
  const options: ValueRecord = {
    ...valueSizeEven(valueSizeScale(valueSizeCover(inSize, containerSize), scaleSize.width, scaleSize.height), CEIL)
  }
  if (!(isNumber(options.width) && isNumber(options.height))) options.eval = FRAME

  // options.flags = 'accurate_rnd'
  // options.force_original_aspect_ratio = 'disable'
  // options.force_divisible_by = 2

  let filterInput = inputId
  const filters: CommandFilters = []

  const scaleFfmpegFilter = 'scale'
  const scaleId = idGenerate(scaleFfmpegFilter)
  const scaleFilter: CommandFilter = {
    ffmpegFilter: scaleFfmpegFilter, options, 
    inputs: [filterInput], outputs: [scaleId]
  }
  filters.push(scaleFilter)
  filterInput = scaleId

  const formatId = idGenerate('format')
  filters.push(formatFilter(filterInput, formatId))
  filterInput = formatId

  // reset sample aspect ratio 
  const setsarId = outputId // idGenerate('setsar') 
  filters.push(setsarCommandFilter(filterInput, setsarId))
  filterInput = setsarId

  return filters
}

const scaleFilter = (inputId: string, outputId: string, size: Size, sizeEnd: Size, scalePosition: string): CommandFilter => {
  const { width, height } = size
  const { width: widthEnd, height: heightEnd } = sizeEnd
  const options: ValueRecord = {
    width: tweenOption(width, widthEnd, scalePosition, true),
    height: tweenOption(height, heightEnd, scalePosition, true),
    // sws_flags: 'accurate_rnd',
  }
  if (!(isNumber(options.width) && isNumber(options.height))) options.eval = FRAME
  const outputs = []
  if (outputId) outputs.push(outputId)

  const commandFilter: CommandFilter = {
    ffmpegFilter: 'scale', options, inputs: [inputId], outputs
  }
  // console.log('scaleCommandFilter', commandFilter)
  return commandFilter
}

const formatFilter = (inputId: string, outputId: string, pix_fmts = 'yuva420p'): CommandFilter => {
  const formatCommandFilter: CommandFilter = {
    ffmpegFilter: 'format',  options: { pix_fmts },
    inputs: [inputId], outputs: [outputId]
  }
  return formatCommandFilter

}

const setPtsSpeedFilters = (inputId: string, outputId: string, instance: ServerAudioInstance): CommandFilters => {
  const filters: CommandFilters = []
  const { speed } = instance
  let filterInput = inputId
  const setptsFilter = 'setpts'
  const setptsId = idGenerate(setptsFilter)
  if (speed !== 1) {
    const firstSetptsCommandFilter: CommandFilter = {
      ffmpegFilter: setptsFilter,
      options: { expr: `PTS-STARTPTS` },
      inputs: [filterInput], outputs: [setptsId]
    }
    filters.push(firstSetptsCommandFilter)
    filterInput = setptsId
  }
  const secondSetptsCommandFilter: CommandFilter = {
    ffmpegFilter: setptsFilter,
    options: { expr: `((PTS)/${speed})-STARTPTS` },
    inputs: [filterInput], outputs: [outputId]
  }
  filters.push(secondSetptsCommandFilter)
  return filters
}

const precodeCommandFilters = (frameRect: Rect, content: ServerVisibleInstance, args: VisibleCommandFilterArgs): CommandFilters => {
  const filters: CommandFilters = []
  const { videoRate } = args
  const { id, asset } = content
  const inputId = [id, 'v'].join(COLON) 
  const { alpha } = asset
  const colorId = idGenerate('color')
  const outputId = idGenerate('overlay')

 // other filters are overlain atop this color (which shouldn't be visible)
  filters.push(colorFilter('#FF0000', frameRect, videoRate, colorId))

  // console.log('options', options)
  filters.push(overlayCommandFilter(colorId, inputId, outputId, alpha))
  return filters
}

const alphamergeCommandFilters = (maskInput: string, maskedInput: string, outputId: string, transparency: Transparency, debug?: boolean): CommandFilters => {
  assertPopulatedString(maskedInput, 'maskedInput')
  assertPopulatedString(maskInput, 'maskInput')
  
  const mergeFilter = debug ? 'overlay' : 'alphamerge'
  const extract = debug ? false : transparency === ALPHA
  const extractFilter = 'alphaextract'
  const extractId = idGenerate(extractFilter)
  const filters: CommandFilters = []
  let inputId: string = maskInput
  if (extract) {
    const alphaCommandFilter: CommandFilter = {
      ffmpegFilter: extractFilter, options: {},
      inputs: [inputId], outputs: [extractId]
    }
    filters.push(alphaCommandFilter)
    inputId = extractId
  }
  const options: ValueRecord = {}
  const outputs = []
  if (outputId) outputs.push(outputId)
  const commandFilter: CommandFilter = {
    ffmpegFilter: mergeFilter, options,
    inputs: [maskedInput, inputId], outputs
  }
  filters.push(commandFilter)
  // console.log('alphamergeCommandFilters', filters)
  return filters
}

const audibleCommandFilters = (args: AudibleCommandFilterArgs, instance: ServerAudioInstance): CommandFilters => {
  const filters: CommandFilters = []
  const { commandFiles, time, clipTime } = args
  const { id, speed } = instance
  const { asset } = instance
  const commandFile = commandFiles.find(file => file.asset === asset && AUDIO === file.avType)
  const contentId = commandFile ? commandFile.inputId : id
  let filterInput = [contentId, 'a'].join(COLON)
  if (speed !== 1) {
    const atempoFilter = 'atempo'
    const atempoId = idGenerate(atempoFilter)
    const atempoCommandFilter: CommandFilter = {
      ffmpegFilter: atempoFilter, options: { tempo: speed },
      inputs: [filterInput], outputs: [atempoId]
    }
    filters.push(atempoCommandFilter)
    filterInput = atempoId
  }
  const delays = (clipTime.seconds - time.seconds) * 1000
  if (delays) {
    const adelayFilter = 'adelay'
    const adelayId = idGenerate(adelayFilter)
    const adelayCommandFilter: CommandFilter = {
      ffmpegFilter: adelayFilter,
      options: { delays, all: 1 },
      inputs: [filterInput], outputs: [adelayId]
    }
    filters.push(adelayCommandFilter)
    filterInput = adelayId
  }
  const { chainInput } = args
  assertPopulatedString(chainInput)

  const amixFilter: CommandFilter = {
    ffmpegFilter: 'amix',
    inputs: [chainInput, filterInput],
    options: { normalize: 0 }, outputs: []
  }
  filters.push(amixFilter)
  return filters
}

const cropFilter = (inputId: string, outputId: string, rect: ValueRecord): CommandFilter => {
  const options: ValueRecord =  { ...pointCopy(rect) }// exact: 1 
  const outputs = []
  if (outputId) outputs.push(outputId)
  const { width, height } = rect
  if (width) options.w = width
  if (height) options.h = height
  const cropFilter: CommandFilter = {
    ffmpegFilter: 'crop', options, inputs: [inputId], outputs
  }
  // console.log('cropFilter', cropFilter)
  return cropFilter
}

const overlayCommandFilter = (bottomInput: string, topInput: string, outputId: string, alpha?:boolean, values?: ValueRecord): CommandFilter =>{
  const doStack = false// !(alpha || values)
  
  const options: ValueRecord = doStack ? {} : { 
    alpha: 'straight', format: alpha ? 'yuv420p10' : 'yuv420', ...(values || {}) 
  }
  const ffmpegFilter = doStack ? 'vstack' : 'overlay'

  const outputs: Strings = []
  if (outputId) outputs.push(outputId)
  
  
  const filter: CommandFilter = {
    ffmpegFilter, options,
    inputs: [bottomInput, topInput], outputs,
  }
  // console.log('overlayCommandFilter', topInput, 'over', bottomInput, 'as', outputId, values)
  return filter
}

const spectrumFilter = (rate: number, outputId?: string): CommandFilter => {
  const ffmpegFilter = 'colorspectrum'
  const id = outputId || idGenerate('colorspectrum')

  const commandFilter: CommandFilter = {
    ffmpegFilter, options: { rate }, inputs: [], outputs: [id]
  }
  // console.log('colorspectrum', rate, 'as', id)
  return commandFilter
}

const colorFilter = (color: string, maxSize: Size, rate: number, outputId?: string) => {
  const ffmpegFilter = 'color'
  const id = outputId || idGenerate('color')
  const size = sizeValueString(maxSize)
  const commandFilter: CommandFilter = {
    ffmpegFilter, options: { color, rate, size }, inputs: [], outputs: [id]
  }
  // console.log('colorFilter', color, size, 'as', id)
  return commandFilter
}

const setsarCommandFilter = (input: string, output: string): CommandFilter => {
  const id = output || idGenerate('setsar')
  const commandFilter: CommandFilter = {
    ffmpegFilter: 'setsar',
    options: { sar: '1/1' },//, max: 100
    inputs: [input],
    outputs: [id]
  }
  return commandFilter
}

const unionRect = (startRect: Rect, endRect: Rect): Rect => {
  const topLeftPoint = {  
    x: Math.min(startRect.x, endRect.x),
    y: Math.min(startRect.y, endRect.y)
  }
  const botRightPoint = { 
    x: Math.max(startRect.x + startRect.width, endRect.x + endRect.width),
    y: Math.max(startRect.y + startRect.height, endRect.y + endRect.height)
  }
  return { 
    ...pointRound(topLeftPoint, FLOOR), 
    ...sizeEven({
      width: botRightPoint.x - topLeftPoint.x, 
      height: botRightPoint.y - topLeftPoint.y 
    })
  }
}

const offsetRect = (containerRects: RectTuple, outputSize: Size): Rect => {
  const [startRect, endRect] = containerRects
  const union = unionRect(startRect, endRect)
  return unionRect(union, { ...POINT_ZERO, ...outputSize })
}

const copyFilter = (instance: VisibleInstance, track: number, ) => {
  const { id, container } = instance
  const input = [id, 'v'].join(COLON)
  const key = container ? CONTAINER : CONTENT
  const output = `${key}-${track}`
  const commandFilter: CommandFilter = {
    ffmpegFilter: 'copy', options: {}, 
    inputs: [input], outputs: [output]
  }
  // console.log('copyFilter', commandFilter)
  return commandFilter
}

export class ServerTrackClass extends TrackClass implements ServerTrack {
  declare clips: ServerClips
  declare mash: ServerMashAsset
}

const WithAudibleAsset = AudibleAssetMixin(ServerMashAssetClass)
const WithVisibleAsset = VisibleAssetMixin(WithAudibleAsset)
const WithServerAudibleAsset = ServerAudibleAssetMixin(WithVisibleAsset)
const WithServerVisibleAsset = ServerVisibleAssetMixin(WithServerAudibleAsset)
const WithVideoAsset = VideoAssetMixin(WithServerVisibleAsset)

export class ServerMashVideoAssetClass extends WithVideoAsset implements ServerMashVideoAsset {
  constructor(args: MashVideoAssetObject) {
    super(args)
    this.initializeProperties(args)
  }

  
  static handleAsset(event: EventServerAsset) {
    const { detail } = event
    const { assetObject } = detail
    if (isAssetObject(assetObject, VIDEO, MASH)) {
      detail.asset = new ServerMashVideoAssetClass(assetObject)
      event.stopImmediatePropagation()
    }
  }
}

// listen for video/mash asset event
export const ServerMashVideoListeners: ListenersFunction = () => ({
  [EventServerAsset.Type]: ServerMashVideoAssetClass.handleAsset
})

const WithAudibleInstance = AudibleInstanceMixin(ServerInstanceClass)
const WithVisibleInstance = VisibleInstanceMixin(WithAudibleInstance)
const WithServerAudibleInstance = ServerAudibleInstanceMixin(WithVisibleInstance)
const WithServerVisibleInstance = ServerVisibleInstanceMixin(WithServerAudibleInstance)
const WithVideoInstance = VideoInstanceMixin(WithServerVisibleInstance)

export class ServerMashVideoInstanceClass extends WithVideoInstance implements ServerMashVideoInstance {
  constructor(args: MashInstanceObject & InstanceArgs) {
    super(args)
    this.initializeProperties(args)
  }
  
  declare asset: ServerMashVideoAsset
}

