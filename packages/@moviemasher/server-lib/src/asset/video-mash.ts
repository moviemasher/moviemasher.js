import type { EvaluationRect, AVType, AbsolutePath, Aspect, Asset, AssetObject, CacheArgs, ClipObject, ContainerRectArgs, ContainerSvgItemArgs, ContentRectArgs, ContentSvgItemArgs, DataOrError, EvaluationPoint, EvaluationSize, EvaluationValue, InstanceArgs, ListenersFunction, MashInstanceObject, MashVideoAssetObject, Point, Rect, RectTuple, Rounding, Size, SizeKey, SizeTuple, SvgItemArgs, SvgItems, SvgItemsRecord, Time, TimeRange, TrackArgs, ValueRecord, Values, VisibleInstance } from '@moviemasher/shared-lib/types.js'
import type { ServerClip, ServerClips, ServerMashAsset, ServerMashVideoAsset, ServerMashVideoInstance, ServerTrack } from '../type/ServerMashTypes.js'
import type { Tweening } from '../type/ServerTypes.js'
import type { AssetFiles, AudibleCommandFilterArgs, AudioCommandFileArgs, CommandFile, CommandFiles, CommandFilter, CommandFilters, ServerAssetManager, ServerAudioInstance, ServerContainerInstance, ServerContentInstance, ServerMashDescription, ServerMashDescriptionOptions, VideoCommandFileOptions, VideoCommandFilterArgs, VisibleCommandFileArgs, VisibleCommandFilterArgs } from '../types.js'

import { ClipClass } from '@moviemasher/shared-lib/base/clip.js'
import { TrackClass } from '@moviemasher/shared-lib/base/track.js'
import { AudibleAssetMixin, AudibleInstanceMixin } from '@moviemasher/shared-lib/mixin/audible.js'
import { MashAssetMixin } from '@moviemasher/shared-lib/mixin/mash.js'
import { VideoAssetMixin, VideoInstanceMixin } from '@moviemasher/shared-lib/mixin/video.js'
import { VisibleAssetMixin, VisibleInstanceMixin } from '@moviemasher/shared-lib/mixin/visible.js'
import { $ALPHA, $AUDIO, $CEIL, $DIVIDE, $END, $FRAME, $HEIGHT, $MASH, $NUMBER, $OPACITY, $POINT, $SIZE, $SUBTRACT, $SVG, $SVGS, $VARIABLE, $VIDEO, $WIDTH, COLON, DASH, DOT, ERROR, POINT_KEYS, POINT_ZERO, RECTS_ZERO, RECT_KEYS, RECT_ZERO, RGBA_BLACK_ZERO, RGB_BLACK, RGB_WHITE, arrayLast, arraySet, assertAsset, errorThrow, idGenerate, isAssetObject, isDefiniteError, namedError } from '@moviemasher/shared-lib/runtime.js'
import { Eval } from '@moviemasher/shared-lib/utility/evaluation.js'
import { isDefined, isNumber, isBelowOne, isValue  } from '@moviemasher/shared-lib/utility/guard.js'
import { assertCanBeContainerInstance, assertDefined, assertTrue} from '@moviemasher/shared-lib/utility/guards.js'
import { assertSizeNotZero, containerEvaluationPoint, contentEvaluationSize, copyPoint, copyRect, copySize, evenEvaluationSize, orientPoint, pointsEqual, rectsEqual, scaleContentEvaluationPoint, sizeNotZero, sizeString, sizeValid, sizesEqual, translateEvaluationPoint, translatePoint, tweenEvaluation, tweenEvaluationPoint, tweenEvaluationSize, unionRects } from '@moviemasher/shared-lib/utility/rect.js'
import { appendSvgItemsRecord, mergeSvgItemsRecords, simplifyRecord, svgPolygonElement, svgSet, svgSetDimensions, svgText } from '@moviemasher/shared-lib/utility/svg.js'
import { assertTimeRange } from '@moviemasher/shared-lib/utility/time.js'
import path from 'path'
import { ServerAssetClass } from '../base/asset.js'
import { ServerInstanceClass } from '../base/instance.js'
import { ServerMashDescriptionClass } from '../encode/ServerMashDescriptionClass.js'
import { assertServerAudibleInstance, assertServerContentInstance, assertServerVisibleInstance, isServerAudibleInstance } from '../utility/guard.js'
import { ServerAudibleAssetMixin, ServerAudibleInstanceMixin } from '../mixin/audible.js'
import { ServerVisibleAssetMixin, ServerVisibleInstanceMixin } from '../mixin/visible.js'
import { EventServerAsset } from '../utility/events.js'
import { alphamergeFilters, colorFilter, cropFilter, fpsFilter, overlayFilter, scaleFilter, setPtsSpeedFilters, setsarFilter } from '../utility/command.js'
import { ENV, ENV_KEY } from '../utility/env.js'

const WithMashAsset = MashAssetMixin(ServerAssetClass)
export class ServerMashAssetClass extends WithMashAsset implements ServerMashAsset {

  override get clips(): ServerClips { return super.clips as ServerClips }

  clipsInTimeOfType(time: Time, avType?: AVType): ServerClips {
    return super.clipsInTimeOfType(time, avType) as ServerClips
  }

  clipInstance(object: ClipObject): ServerClip {
    return new ServerClipClass(object)
  } 

  assetFiles(_: CacheArgs): AssetFiles {
    return errorThrow(ERROR.Unimplemented)
  }
  
  override mashDescription(options: ServerMashDescriptionOptions): ServerMashDescription {
    return new ServerMashDescriptionClass({ ...options, mash: this })
  }

  override trackInstance(args: TrackArgs): ServerTrack {
    return new ServerTrackClass(args)
  }
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
  constructor(args: MashVideoAssetObject, manager?: ServerAssetManager) {
    super(args, manager)
    this.initializeProperties(args)
  }

  static handleAsset(event: EventServerAsset) {
    const { detail } = event
    const { assetObject, manager } = detail
    if (isAssetObject(assetObject, $VIDEO, $MASH)) {
      // console.log('ServerMashVideoAssetClass.handleAsset', !!manager)
      detail.asset = new ServerMashVideoAssetClass(assetObject, manager)
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

export class ServerClipClass extends ClipClass implements ServerClip {
  override asset(assetIdOrObject: string | AssetObject): Asset {
    const { mash } = this.track
    const asset = mash.asset(assetIdOrObject)
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

  private svgFilesForTime(encodePath: AbsolutePath, time: TimeRange, outputSize: Size, videoRate: number): DataOrError<CommandFiles>{
    const svgFiles: CommandFiles = []
    const result = { data: svgFiles }
    const { content, container, timeRange, transparency, clipIndex } = this
    const svgItemArgs: SvgItemArgs = { timeRange, size: outputSize, time: time }
    const { asset: containerAsset, id: containerId } = container
    assertServerVisibleInstance(content, 'content')

    const { asset: contentAsset } = content
    const { isVector, canBeFill: containerCanBeFill } = containerAsset
    const containerIsVideo = !(isVector || containerCanBeFill)
    const { canBeFill: contentCanBeFill } = contentAsset
    const contentIsVideo = !contentCanBeFill
    if (containerIsVideo && contentIsVideo) {
      return result
    }
    const hasBoth = !(containerIsVideo || contentIsVideo)
    const tweening = contentIsVideo ? container.tweening : this.tweening
    const isRange = time.frames > 1
    const times = isRange && tweening ? time.scale(videoRate).frameTimes : [time.startTime]

    if (!sizeNotZero(outputSize)) return namedError(ERROR.Internal, outputSize)

    const containerRectArgs: ContainerRectArgs = { outputSize, time, timeRange }
    const containerRects = this.clipRects(containerRectArgs)
    const contentRectArgs: ContentRectArgs = {
      containerRects, time, timeRange, outputSize
    }
    const [frameRect] = this.bestFrameRects(contentRectArgs, !contentIsVideo, !containerIsVideo) 
    const offsetPoint = translatePoint(POINT_ZERO, frameRect, true) 
    const { length } = times
    const pad = String(length).length
    const multipleTimes = length > 1
    const color = contentIsVideo ? RGB_WHITE : RGB_BLACK 
    const backColor = (contentIsVideo ? (transparency === $ALPHA ? RGBA_BLACK_ZERO : RGB_BLACK) : RGBA_BLACK_ZERO)
    const [firstTime] = times
    const lastTime = arrayLast(times) 
    const root = path.resolve(ENV.get(ENV_KEY.RelativeRequestRoot))

    const base_uri = `file://${root}`    
    const inputOptions: ValueRecord = { framerate: videoRate, base_uri }
    if (isRange) inputOptions.t = time.lengthSeconds
    const nameBits: Values = [firstTime.frame, lastTime.frame, frameRect.width, frameRect.height]
    const basePath = path.join(encodePath, $SVGS, clipIndex.join(DASH), nameBits.join(DASH))
    const baseFile: CommandFile = { 
      inputId: containerId, inputOptions, avType: $VIDEO,
      type: $SVGS, asset: containerAsset, file: '',
    }  
    if (multipleTimes) baseFile.path = [basePath, $FRAME, `%0${String(length + 1).length}d.svg`, ].join(DASH)
    for (const [index, time] of times.entries()) {
      const record: SvgItemsRecord = { 
        items: [svgPolygonElement(frameRect, '', backColor)], defs: [], styles: [] 
      }
      const timeContainerRects = index ? this.clipRects({ ...containerRectArgs, time }) : containerRects
      const [containerStartRect] = timeContainerRects
      if (!sizeNotZero(containerStartRect)) return namedError(ERROR.Internal, containerStartRect)
      
      const containerRect = { ...containerStartRect, ...translatePoint(containerStartRect, offsetPoint) }
     
      const [opacity] = this.tweenValues($OPACITY, time, timeRange)
      const args: ContainerSvgItemArgs = { ...svgItemArgs, color, containerRect, time, opacity }
      if (hasBoth) {
        const clippedOrError = container.clippedElement(content, args)
        if (isDefiniteError(clippedOrError)) return clippedOrError

        mergeSvgItemsRecords(record, clippedOrError.data)
      } else if (!containerIsVideo) {
        const containerOrError = container.containerSvgItem(args)
        if (isDefiniteError(containerOrError)) return containerOrError
      
        appendSvgItemsRecord(record, containerOrError.data)
      } else {
        const contentRect = content.contentRect(time, containerRect, outputSize)
        const contentSvgItemArgs: ContentSvgItemArgs = { 
          ...svgItemArgs, contentRect, time, opacity
        }
        const contentOrError = content.contentSvgItem(contentSvgItemArgs)
        if (isDefiniteError(contentOrError)) return contentOrError

        appendSvgItemsRecord(record, contentOrError.data)
      }
      const svg = simplifyRecord(record, frameRect)
      const { outerHTML: text } = svg
      const nameBits: Values = []
      if (multipleTimes) {
        nameBits.push('', $FRAME, String(1 + time.frame - firstTime.frame).padStart(pad, '0'))
      }
      const file = [basePath, [nameBits.join(DASH), $SVG].join(DOT)].join('')
      const svgFile: CommandFile = { ...baseFile, content: text, file }  
      svgFiles.push(svgFile)
    }
    return result
  }

  // private svgItemsDebugForTime(time: Time, containerStartRect: Rect, contentStartRect: Rect, offsetPoint: Point): SvgItems {
  //   const children: SvgItems = []
  //   const contentColor = 'red'
  //   const containerColor = 'black' 
  //   const contentRect = { ...contentStartRect, ...translatePoint(contentStartRect, offsetPoint) }
  //   const contentText = `${time.frame} ${rectValuesString(contentRect)}`
  //   const contentElement = svgPolygonElement(contentRect, '', RGBA_BLACK_ZERO)
  //   svgSet(contentElement, contentColor, 'stroke')
  //   svgSet(contentElement, '1', 'stroke-width')
  //   children.push(contentElement)
  //   const contentTextElement = svgText(contentText, contentColor, 12)
  //   svgSetDimensions(contentTextElement, translatePoint(contentRect, { x: 3, y: 15 }))
  //   children.push(contentTextElement)
  //   const containerRect = { ...containerStartRect, ...translatePoint(containerStartRect, offsetPoint) }
  //   const containerText = `${time.frame} ${rectValuesString(containerRect)}`
  //   const containerElement = svgPolygonElement(containerRect, '', RGBA_BLACK_ZERO)
  //   svgSet(containerElement, containerColor, 'stroke')
  //   svgSet(containerElement, '1', 'stroke-width')
  //   children.push(containerElement)
  //   const containerTextElement = svgText(containerText, containerColor, 12)
  //   svgSetDimensions(containerTextElement, translatePoint(containerRect, { x: 3, y: 15 }))
  //   children.push(containerTextElement)  
  //   return children
  // }
  
  videoCommandFiles(args: VideoCommandFileOptions): CommandFiles {
    const files: CommandFiles = []
    const { content, container, timeRange, precoding, timeRange: clipTime } = this
    assertServerVisibleInstance(content, 'content')

    const { outputSize, time: timeOrRange, videoRate, encodePath } = args
    assertSizeNotZero(outputSize, 'outputSize')
    const time = clipTime.intersection(timeOrRange)
    assertDefined(time, 'intersection')
   
    const containerRectArgs: ContainerRectArgs = {
      outputSize, time, timeRange
    }
    const containerRects = this.clipRects(containerRectArgs)
    const fileArgs: VisibleCommandFileArgs = { 
      ...args, clipTime: timeRange, outputSize, containerRects
    }
    if (precoding) {
      const { seconds: startSeconds } = content.assetTime(time)
      const inputOptions: ValueRecord = { }
      if (startSeconds) inputOptions.ss = startSeconds
   
      const file: CommandFile = {
        type: $VIDEO, asset: content.asset, file: precoding, 
        inputId: content.id, avType: $VIDEO, inputOptions
      }
      // console.log(this.constructor.name, 'videoCommandFiles ADDING', file)
      files.push(file)
    }
    const contentOrNot = precoding ? undefined : content
    const containerFiles = container.visibleCommandFiles(fileArgs, contentOrNot)
    files.push(...containerFiles)
    const svgFilesOrError = this.svgFilesForTime(encodePath, time, outputSize, videoRate)
    if (!isDefiniteError(svgFilesOrError)) files.push(...svgFilesOrError.data)
    return files
  }

  videoCommandFilters(args: VideoCommandFilterArgs): CommandFilters {
    const filters: CommandFilters = []
    const { content, container } = this
    assertServerVisibleInstance(content, 'content')

    const { asset: containerAsset, id: containerId } = container
    const { isVector, canBeFill: containerCanBeFill, alpha } = containerAsset
    const hasContainerSvg = isVector || containerCanBeFill

    const { canBeFill: hasContentSvg } = content.asset
    const hasBoth = hasContainerSvg && hasContentSvg

    let containerInput = [containerId, 'v'].join(COLON)
    const { chainInput } = args
  
    if (!hasBoth) {
      filters.push(...this.videoComplexFilters(containerInput, args))
      containerInput = arrayLast(arrayLast(filters).outputs)
    }
    filters.push(overlayFilter(chainInput, containerInput, '', alpha))
    return filters
  }

  private bestFrameRects(args: ContentRectArgs, hasContentSvg?: boolean, hasContainerSvg?: boolean): [Rect, RectTuple, Rect | undefined] {
    const { content, precoding } = this
    const { outputSize, containerRects } = args
    const outputRect = { ...POINT_ZERO, ...outputSize }
    const contentRects: RectTuple = hasContentSvg ? RECTS_ZERO : content.contentRects(args)
    const rects = hasContentSvg ? containerRects : contentRects
    const useOutput = precoding || (hasContentSvg && hasContainerSvg)
    const rect = useOutput ? outputRect : unionRects(...rects, outputRect)
    const invalidRect: Rect | undefined = undefined

    const invalid = !sizeValid(rect)
    if (invalid) copyRect(rect, invalidRect)
    if (invalid && !useOutput) { 
      // try to fallback to container rects 
      console.log(this.constructor.name, 'bestFrameRects', 'invalid', { hasContentSvg, rect })
      assertTrue(!hasContentSvg, sizeString(rect))
      
      arraySet(rects, containerRects)
      copyRect(unionRects(...rects), rect)
      assertTrue(sizeValid(rect), sizeString(rect))
    }
    return [rect, contentRects, invalidRect]
  }

  private videoComplexFilters(inputId: string, args: VideoCommandFilterArgs): CommandFilters {
    let containerInput = inputId 
    const filters: CommandFilters = []
    const { content, container } = this
    assertServerVisibleInstance(content, 'content')

    const { asset: containerAsset, id: containerId } = container
    const { isVector, canBeFill: containerCanBeFill } = containerAsset
    const containerIsVideo = !(isVector || containerCanBeFill)

    const { id: contentId, asset: contentAsset } = content
    const contentIsVideo = !contentAsset.canBeFill

    let contentInput = [contentIsVideo ? contentId : containerId, 'v'].join(COLON) 

    const { outputSize, time: outputTime, clipTime } = args
    assertSizeNotZero(outputSize, 'outputSize')

    const time = clipTime.intersection(outputTime)
    assertTimeRange(time)
    assertCanBeContainerInstance(container, 'container')

    const containerRectArgs: ContainerRectArgs = { 
      outputSize, time, timeRange: clipTime 
    }
    const containerRects = this.clipRects(containerRectArgs)    
    const tweening: Tweening = { point: false, size: false }
    if (containerRects.length > 1) {
      tweening.point = !pointsEqual(containerRects[0], containerRects[1])
      tweening.size = !sizesEqual(containerRects[0], containerRects[1])
    }
    const { transparency, precoding } = this
    const visibleArgs: VisibleCommandFilterArgs = { ...args, containerRects }
    const outputRect = { ...POINT_ZERO, ...outputSize }
    const alphaId = idGenerate('alpha')
    const contentArgs: ContentRectArgs = {
      containerRects, time, timeRange: clipTime, outputSize
    }
    const [frameRect, contentRects, idealRect] = this.bestFrameRects(contentArgs, !contentIsVideo, !containerIsVideo)
    const offsetPoint = translatePoint(POINT_ZERO, frameRect, true) 
    const cropRect = { ...outputSize, ...offsetPoint}
    if (precoding) {  
      const precodingId = idGenerate('precoding')
      filters.push(...precodeFilters(contentInput, precodingId, visibleArgs, contentAsset.alpha )) 
      contentInput = precodingId
    } else {

      if (contentIsVideo) {
        if (idealRect) {
          // content is scaled to large for an $SVG file
          // const idealRect = unionRects(...contentRects, outputRect)
          console.log(this.constructor.name, 'videoComplexFilters', 'frameRectIncomplete', { frameRect, contentRects, idealRect })
          const difRect = {
            x: frameRect.x - idealRect.x,
            y: frameRect.y - idealRect.y,
          }
          const containerColorId = idGenerate('container-color')
          filters.push(colorFilter(containerColorId, '#000000', 1, idealRect))

          const containerOverlayId = idGenerate('container-overlay')
          filters.push(overlayFilter(containerColorId, containerInput, containerOverlayId, true, difRect))
          containerInput = containerOverlayId

          copyRect(idealRect, frameRect)
          copyPoint(idealRect, cropRect)
        }
        if (contentRects.length > 1) {
          const [first, last] = contentRects
          tweening.point ||= !pointsEqual(first, last)
          tweening.size ||= !sizesEqual(first, last)
        }
        filters.push(...this.videoInstanceFilters(content, frameRect, contentRects, visibleArgs, tweening))   
        contentInput = arrayLast(arrayLast(filters).outputs)
      }
      if (containerIsVideo) {
        filters.push(...this.videoInstanceFilters(container, frameRect, containerRects, visibleArgs, tweening))   
        containerInput = arrayLast(arrayLast(filters).outputs)
      }     
    }

    filters.push(...alphamergeFilters(containerInput, contentInput, alphaId, transparency))  
    containerInput = alphaId
    const needsCrop = !rectsEqual(cropRect, outputRect)
    if (needsCrop) {
      const cropId = idGenerate('crop')
      filters.push(cropFilter(containerInput, cropId, cropRect))
      containerInput = cropId
    } 
    if (containerIsVideo && contentIsVideo) {
      filters.push(...this.opacityCommandFilters(containerInput, args))
    } 
    return filters
  }

  private videoInstanceFilters(instance: VisibleInstance, frameRect: Rect, rects: RectTuple, args: VisibleCommandFilterArgs, tweening: Tweening): CommandFilters {
    const filters: CommandFilters = []
    const { size, point } = tweening
    const needsDynamic = size && point
    const { videoRate, duration, commandFiles, time } = args
    const { asset, container, id } = instance
    const { alpha } = asset
    const commandFile = commandFiles.find(file => (
      file.inputId.startsWith(id) && file.asset === asset && file.type === $VIDEO
    ))
    assertDefined<CommandFile>(commandFile, 'commandFile')

    const { inputId: fileId } = commandFile
    const inputId = [fileId, 'v'].join(COLON)
    let filterInput = inputId
    const { asset: _, ...file } = commandFile
    // console.log(this.constructor.name, 'videoInstanceFilters', { file, asset: asset.label, time })
    const colorId = idGenerate('color')
    const scaleId = idGenerate('scale')
    const outputId = idGenerate('overlay')
    const options: ValueRecord = { ...POINT_ZERO }
    const sizePosition = tweenPosition(videoRate * duration) 
    const pointPosition = tweenPosition(videoRate * duration, 1) // overlay bug
    filters.push(colorFilter(colorId, '#000000', videoRate, frameRect))

    if (isServerAudibleInstance(instance)) {
      const setptsId = idGenerate('setpts')
      filters.push(...setPtsSpeedFilters(filterInput, setptsId, instance))
      filterInput = setptsId
    } 
    // should this be first?
    const fpsId = idGenerate('fps')
    filters.push(fpsFilter(filterInput, fpsId, videoRate))
    filterInput = fpsId

    const evaluationPoint: EvaluationPoint = { ...POINT_ZERO }
    if (needsDynamic) {
      const contentSize =  this.evaluationSize(container, sizePosition, args, $CEIL) 
      filters.push(...this.dynamicScaleFilters(filterInput, scaleId, contentSize))
      filterInput = scaleId
      const contentPoint =  this.evaluationPoint(container, pointPosition, args, $CEIL) 
      copyPoint(contentPoint, evaluationPoint)
    } else {
      filters.push(...this.linearScaleFilters(filterInput, scaleId, sizePosition, rects))
      filterInput = scaleId
      const contentPoint = tweenEvaluationPoint(rects, pointPosition)
      copyPoint(contentPoint, evaluationPoint)
    }
    // translate the point
    const translated = translateEvaluationPoint(evaluationPoint, frameRect, true)

    // now evaluate it as much as possible
    POINT_KEYS.forEach(key => { options[key] = evaluationValue(translated[key]) })
    filters.push(overlayFilter(colorId, filterInput, outputId, alpha, options))
    return filters
  }

  private evaluationSize(container: boolean, sizePosition: EvaluationValue, args: VisibleCommandFilterArgs, rounding: Rounding = $CEIL) {
    if (container) return this.containerEvaluationSize(sizePosition, args, rounding) 
    return this.contentEvaluationSize(sizePosition, args, rounding)
  }

  private evaluationPoint(container: boolean, pointPosition: EvaluationValue, args: VisibleCommandFilterArgs, rounding: Rounding = $CEIL) {
    if (container) return this.containerEvaluationPoint(pointPosition, args, rounding) 
    return this.contentEvaluationPoint(pointPosition, args, rounding)
  }


  private containerEvaluationPoint(position: EvaluationValue, args: VisibleCommandFilterArgs, rounding: Rounding): EvaluationPoint {
    const containerSize = this.containerEvaluationSize(position, args, rounding)
    const { outputSize, time, clipTime } = args
    const { container } = this
    const containerTweenRects = container.scaleRects(time, clipTime)
    const containerTweenPoints = containerTweenRects.map((tweenRect, index) => {
      const startOrEnd = index ? $END : 'Start'
      const point: EvaluationPoint = { ...POINT_ZERO }
      POINT_KEYS.forEach(key => {
        const variable = `${key}Container${startOrEnd}`
        const evaluation = Eval($NUMBER, [tweenRect[key]], variable)
        point[key] = evaluation
      })
      return point
    })
    const { pointAspect, cropDirections } = container
    const containerTweenPoint = tweenEvaluationPoint(containerTweenPoints, position)
    const containerPoint = containerEvaluationPoint(containerTweenPoint, containerSize, outputSize, pointAspect, cropDirections, rounding)
    return containerPoint
  }

  private containerEvaluationSize(position: EvaluationValue, args: VisibleCommandFilterArgs, rounding: Rounding): EvaluationSize {
    // sizes in container rects are correct, so we can just tween between them
    const { containerRects } = args
    const containerSize = tweenEvaluationSize(containerRects, position)
    const evenedSize = evenEvaluationSize(containerSize, rounding)
    return evenedSize
    
    // const { container } = this
    // const intrinsicSize = this.sizingRect(outputSize)
    // const { sizeAspect, SizeKey } = container
    // const tweenRects = container.scaleRects(time, clipTime)
    // const tweenSize = tweenEvaluationSize(tweenRects, position)
    // const flippedSize = orientEvaluationSize(tweenSize, intrinsicSize, outputSize, sizeAspect, SizeKey)
    // const { container } = this
    // assertServerContainerInstance(container)
    // const { time, clipTime, outputSize } = args
    // const intrinsicSize = this.sizingRect(outputSize)
    // const { sizeAspect, SizeKey } = container
    // const tweenRects = container.scaleRects(time, clipTime)
    // const tweenSize = tweenEvaluationSize(tweenRects, position)
    // const containerSize = containerEvaluationSize(tweenSize, intrinsicSize, outputSize, sizeAspect, SizeKey, rounding)
    // return containerSize
  }

  private contentEvaluationPoint(position: EvaluationValue, args: VisibleCommandFilterArgs, rounding: Rounding): EvaluationPoint {
    const { content } = this
    const { time, clipTime, outputSize} = args

    // can't interpolate between points in container rects since they are based on sizes
    const containerPoint = this.containerEvaluationPoint(position, args, rounding)
    // outputEvaluation(containerPoint, 'container')

    const containerSize = this.containerEvaluationSize(position, args, rounding)

    const containerRect: EvaluationRect = {  ...containerPoint, ...containerSize }
    const contentScalingRects = content.scaleRects(time, clipTime)
    const contentTweenRects = contentScalingRects.map((contentTweenRect, index) => {
      const startOrEnd = index ? $END : 'Start'
      const rect: EvaluationRect = { ...RECT_ZERO }
      RECT_KEYS.forEach(key => {
        const variable = `${key}Content${startOrEnd}`
        const evaluation = Eval($NUMBER, [contentTweenRect[key]], variable)
        rect[key] = evaluation
      })
      return rect
    })
    const tweenRect = {
      ...tweenEvaluationSize(contentTweenRects, position),
      ...tweenEvaluationPoint(contentTweenRects, position)
    }
    const { intrinsicRect, sizeKey, pointAspect, sizeAspect } = content
    const point = contentEvaluationPoint(tweenRect, intrinsicRect, containerRect, outputSize, sizeAspect, pointAspect, rounding, sizeKey)
    return point
  }

  private contentEvaluationSize = (position: EvaluationValue, args: VisibleCommandFilterArgs, rounding: Rounding): EvaluationSize => {
    const { time, clipTime, outputSize } = args
    const { content } = this
    const { sizeKey, intrinsicRect, sizeAspect } = content
    const contentTweenRects = content.scaleRects(time, clipTime)
    const contentTweenSize = tweenEvaluationSize(contentTweenRects, position)
    const containerSize = this.containerEvaluationSize(position, args, rounding)
    // outputEvaluation(containerSize, 'container')
    const contentSize = contentEvaluationSize(contentTweenSize, intrinsicRect, containerSize, outputSize, sizeAspect, rounding, sizeKey)
    return contentSize
  }

  private linearScaleFilters(inputId: string, outputId: string, sizePosition: EvaluationValue, sizes: SizeTuple): CommandFilters {
    const filters: CommandFilters = []
    const [sizeStart, sizeEnd] = sizes
    const { width: widthStart, height: heightStart } = sizeStart
    const { width: widthEnd, height: heightEnd } = sizeEnd
    
    const scaledSize = {
      width: tweenEvaluation($WIDTH, widthStart, widthEnd, sizePosition),
      height: tweenEvaluation($HEIGHT, heightStart, heightEnd, sizePosition),
      // sws_flags: 'accurate_rnd',
    }
    const options = {
      width: String(scaledSize.width),
      height: String(scaledSize.height),
    }
    // reset sample aspect ratio 
    const scaleId = idGenerate('setsar') 
    filters.push(scaleFilter(inputId, scaleId, options))
    filters.push(setsarFilter(scaleId, outputId))
    return filters
  }

  private dynamicScaleFilters = (inputId: string, outputId: string, contentSize: EvaluationSize): CommandFilters => {
    const options: ValueRecord = {
      eval: $FRAME,
      w: evaluationValue(contentSize.width), 
      h: evaluationValue(contentSize.height)
    }
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

    // reset sample aspect ratio 
    const setsarId = outputId 
    filters.push(setsarFilter(filterInput, setsarId, ))

    return filters
  }

  private opacityCommandFilters(filterInput: string, args: VideoCommandFilterArgs): CommandFilters {
    const { clipTime, time, videoRate, duration } = args
    assertTimeRange(clipTime)

    const [opacity, opacityEnd] = this.tweenValues('opacity', time, clipTime)
    if (!isNumber(opacity)) return []

    if (!(isBelowOne(opacity) || (isDefined(opacityEnd) && isBelowOne(opacityEnd)))) {
      return []
    }

    const options: ValueRecord = {
      lum: 'lum(X,Y)', cb: 'cb(X,Y)', cr: 'cr(X,Y)', a: `alpha(X,Y)*${opacity}`
    }
    if (duration) {
      if (isNumber(opacityEnd) && opacity != opacityEnd) {
        const position = tweenPosition(videoRate * duration, 0, 'N')
        const toValue = opacityEnd - opacity
        options.a = `alpha(X,Y)*(${opacity}+(${toValue}*${position}))`
      }
    }
    const commandFilter: CommandFilter = {
      ffmpegFilter: 'geq',
      inputs: [filterInput],
      options, outputs: [idGenerate('opacity')]
    }
    return [commandFilter]
  }
}

const tweenPosition = (frames: number, offset = 0, frame='n'): EvaluationValue => {
  const frameVariable = Eval($VARIABLE, [frame], 'frame')
  const subtracted = Eval($SUBTRACT, [frameVariable, offset], 'overlayFrame')
  const divided = Eval($DIVIDE, [subtracted, frames], 'framePosition')
  return divided
}

const precodeFilters = (inputId: string, outputId: string, args: VisibleCommandFilterArgs, alpha?: boolean): CommandFilters => {
  const filters: CommandFilters = []
  const { videoRate, outputSize } = args
  const colorId = idGenerate('color')

 // other filters are overlain atop this color (which shouldn't be visible)
  filters.push(colorFilter(colorId, '#FF0000', videoRate, outputSize))

  // console.log('options', options)
  filters.push(overlayFilter(colorId, inputId, outputId, alpha))
  return filters
}


const evaluationValue = (operative: EvaluationValue) => (
  isValue(operative) ? operative : operative.toValue()
)


const audibleCommandFilters = (args: AudibleCommandFilterArgs, instance: ServerAudioInstance): CommandFilters => {
  const filters: CommandFilters = []
  const { commandFiles, time, clipTime } = args
  const { id, speed } = instance
  const { asset } = instance
  const commandFile = commandFiles.find(file => file.asset === asset && $AUDIO === file.avType)
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

  const amixFilter: CommandFilter = {
    ffmpegFilter: 'amix',
    inputs: [chainInput, filterInput],
    options: { normalize: 0 }, outputs: []
  }
  filters.push(amixFilter)
  return filters
}

const contentEvaluationPoint = (tweenRect: EvaluationRect, intrinsicSize: Size, containerRect: EvaluationRect, outputSize: Size, sizeAspect: Aspect, pointAspect: Aspect, rounding: Rounding, sizeKey?: SizeKey): EvaluationPoint => {
  const containerSize = copySize(containerRect)
  const containerPoint = copyPoint(containerRect)
  const tweenPoint = orientPoint(tweenRect, outputSize, pointAspect)
  const expressionSize = { width: 'w', height: 'h' }
  const contentSize = evenEvaluationSize(expressionSize, rounding)
  const contentPoint = scaleContentEvaluationPoint(contentSize, containerSize, tweenPoint, rounding)
  const translatedPoint = translateEvaluationPoint(containerPoint, contentPoint)
  return translatedPoint 
}

const rectValuesString = (rect: Rect): string => {
  const { x, y, width, height } = rect
  return `${width}x${height}@${x}/${y}`
}

// type EvaluationRecord = Record<string, EvaluationValue> | EvaluationPoint | EvaluationSize

// const debugFilters = (inputId: string, clip: ServerClip, args: VisibleCommandFilterArgs, frameRect: Rect): CommandFilters => {
//   const drawtextFilter = (inputId: string, outputId: string, point: Point, text: Value, fontcolor: string = RGB_WHITE, fontsize: number = 12): CommandFilter => {
//     const options = { text, ...roundPoint(point, $FLOOR), fontcolor, fontsize }  
//     const commandFilter: CommandFilter = {
//       ffmpegFilter: 'drawtext', options, inputs: [inputId], outputs: [outputId]
//     }
//     return commandFilter
//   }  


//   const drawboxFilter = (inputId: string, outputId: string, rect: Rect, color: string = RGB_WHITE, thickness: Value = 1): CommandFilter => {
//     const options = { ...rect, color, thickness }
//     const commandFilter: CommandFilter = {
//       ffmpegFilter: 'drawbox', options,
//       inputs: [inputId], outputs: [outputId]
//     }
//     return commandFilter
//   }


//   const { content, container } = clip
//   assertServerContentInstance(content, 'content')
//   assertServerContainerInstance(container, 'container')

//   const { time: argsTime, clipTime: argsClipTime, outputSize } = args
//   const time = argsTime.scale(3)
//   const clipTime = argsClipTime.scale(3)

//   assertTimeRange(time)
//   // const argsTime = timeRange.scale(videoRate)
//   const { frameTimes } = time
//   let filterInput = inputId

//   const containerColor = RGB_BLACK // '#00FF00' 
//   const contentColor = RGB_BLACK // '#0000FF' 


//   return frameTimes.flatMap(time => {
//     const filters: CommandFilters = []
//     const containerArgs: ContainerRectArgs = { 
//       outputSize, time, timeRange: clipTime 
//     }
//     const [containerStartRect] = clip.clipRects(containerArgs)
//     const contentArgs: ContentRectArgs = {
//       containerRects:  [containerStartRect, containerStartRect], 
//       time, timeRange: clipTime, outputSize
//     }
//     const [contentStartRect] = content.contentRects(contentArgs)
//     const contentRect = { ...contentStartRect, ...translatePoint(contentStartRect, frameRect, true) }
//     const contentTextRect = { ...contentRect, ...translatePoint(contentRect, { x: 3, y: 3 }) }
//     const contentDrawtextId = idGenerate('drawtext')
//     const contentText = `${time.frame} ${rectValuesString(contentRect)}`
//     const contentTextFilter = drawtextFilter(filterInput, contentDrawtextId, contentTextRect, contentText, contentColor)
//     filters.push(contentTextFilter)
//     filterInput = contentDrawtextId

//     const contentDrawboxId = idGenerate('drawbox')
//     const contentDrawboxFilter = drawboxFilter(filterInput, contentDrawboxId, contentRect, contentColor)
//     filters.push(contentDrawboxFilter)
//     filterInput = contentDrawboxId

//     const containerRect = { ...containerStartRect, ...translatePoint(containerStartRect, frameRect, true) }
//     const containerTextRect = { ...containerRect, ...translatePoint(containerRect, { x: 3, y: 3 }) }
//     const containerDrawtextId = idGenerate('drawtext')
//     const containerText = `${time.frame} ${rectValuesString(containerRect)}`
//     const containerTextFilter = drawtextFilter(filterInput, containerDrawtextId, containerTextRect, containerText, containerColor)
//     filters.push(containerTextFilter)
//     filterInput = containerDrawtextId

//     const containerDrawboxId = idGenerate('drawbox')
//     const containerDrawboxFilter = drawboxFilter(filterInput, containerDrawboxId, containerRect, containerColor)
//     filters.push(containerDrawboxFilter)
//     filterInput = containerDrawboxId


//     return filters
//   })    
// }
// const heading = (numbers: Numbers): string => {
//   const strings: Strings = []
//   let [number] = numbers
//   let headed = ''
//   numbers.forEach((next, index) => {
//     const delta = next - number
//     if (delta) {
//       const direction = isPositive(delta) ? '+' : '-'
//       if (direction !== headed) {
//         headed = direction
//         strings.push(`${headed}${index}`)
//       }
//     }
//     number = next
//   })
//   return strings.join(',')
// }

// let DEBUG_COUNTER = 0
// const indentExpression = (expression: string): string => {
//   const indent = SPACE.repeat(2)
//   let depth = 0
//   const chars = expression.split('').flatMap(char => {
//     if (char === '(') return [char, NEWLINE, indent.repeat(++depth)]
//     if (char === ')') return [NEWLINE, indent.repeat(--depth), char]
//     return [char]
//   })
//   return chars.join('')
// }
// const outputEvaluation = (record: EvaluationRecord, contentOrContainer: string): void => {
//   const prefix = `/app/temporary/assets/json/${contentOrContainer}`
//   Object.entries(record).forEach(([key, evaluation]) => {
//     if (key === $X || key === $Y) {
//       const numbers = arrayOfNumbers(3, 1).map(frame => {
//         EvaluationVariables.n = frame
//         const value = Number(evaluation)
//         fileWrite(`${prefix}-${key}-${DEBUG_COUNTER}-description-${frame}.txt`, evaluation.description)
//         return value
//       })
//       delete EvaluationVariables.n
//       const value = evaluation.toValue()
//       fileWrite(`${prefix}-${key}-${DEBUG_COUNTER}-expression.txt`, value)
//       fileWrite(`${prefix}-${key}-${DEBUG_COUNTER}-expression-indented.txt`, indentExpression(value))
//       const headed = heading(numbers)

//     }
//     const string = jsonStringify(evaluation)
//     fileWrite(`${prefix}-${key}-${DEBUG_COUNTER}.json`, string)
//   })
// }


// const containerEvaluationSize = (tweenSize: EvaluationSize, intrinsicSize: Size, outputSize: Size, sizeAspect: string = $MAINTAIN, rounding: Rounding, sizeKey?: SizeKey): EvaluationSize => {
//   const flippedSize = orientEvaluationSize(tweenSize, intrinsicSize, outputSize, sizeAspect, sizeKey)
//   const scaledSize = scaleEvaluationSize(outputSize, flippedSize.width, flippedSize.height, rounding)   
//   const evenedSize = evenEvaluationSize(scaledSize, rounding)
//   return evenedSize
// }


// const debugEvaluations = (opertives: EvaluationRecord): any => {
//   Object.entries(opertives).forEach(([key, operative]) => {
//     const filePath = path.join('/app/temporary/assets/json', `${key}.json`)//ENV.get(ENV_KEY.ApiDirCache)
//     fileWrite(filePath, jsonStringify(operative))
//   })
//   return Object.keys(opertives)
// }
// const debugObjects = (objects: EvaluationsRecord): any => {
//   return Object.fromEntries(Object.entries(objects).map(([key, value]) => {
//     return [key, debugEvaluations(value)]
//   }))
// }
