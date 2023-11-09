import type { ChangeActionObject, ChangePropertiesActionObject, ClientClip, ClientInstance, ClientTrack, ClientVisibleInstance, Preview, SvgItems, SvgOrImageDataOrError } from '@moviemasher/runtime-client'
import type { Asset, AssetObject, ContainerRectArgs, PropertyId, Scalar, ScalarsById, Size, TargetId, Time } from '@moviemasher/runtime-shared'
import type { MashPreviewArgs } from '../Masher/MashPreview/MashPreview.js'

import { ActionTypeChangeFrame, ActionTypeChangeMultiple, ClipClass, DOT, SizingContainer, SizingContent, TimingContainer, TimingContent, TimingCustom, arrayOfNumbers, assertContainerInstance, assertPopulatedString, assertSizeAboveZero, assertTrue, colorFromRgb, colorRgbDifference, colorToRgb, idGenerate, timeFromArgs } from '@moviemasher/lib-shared'
import { EventManagedAsset, Panel } from '@moviemasher/runtime-client'
import { AUDIO, POINT_ZERO, TARGET_CLIP, isAudibleAssetType, isVisibleAssetType } from '@moviemasher/runtime-shared'
import { assertClientVisibleInstance } from '../ClientGuards.js'
import { isChangePropertyActionObject } from '../Masher/Actions/Action/ActionFunctions.js'
import { MashPreviewClass } from '../Masher/MashPreview/MashPreviewClass.js'
import { pixelToFrame } from '../PixelFunctions.js'
import { svgAppend, svgDefsElement, svgPatternElement, svgPolygonElement, svgSetDimensions, svgSvgElement, svgUrl } from '../SvgFunctions.js'

export class ClientClipClass extends ClipClass implements ClientClip {
  override asset(assetIdOrObject: string | AssetObject): Asset {
    return EventManagedAsset.asset(assetIdOrObject)
  }

  backgroundNode = (size: Size, patternedSize: Size, spacing = 0) => {
    const { width, height } = size
    const { color: fill } = this.track.mash
    const rgb = colorToRgb(fill)
    const differenceRgb = colorRgbDifference(rgb)
    const forecolor = colorFromRgb(differenceRgb)
    const framePolygon = svgPolygonElement(size, '', fill)
    const spaceRect = { x: width, y: 0, width: spacing, height }
    const spacePolygon = svgPolygonElement(spaceRect, '', forecolor)
    const patternSize = { width: width + spacing, height }
    const patternId = idGenerate('pattern')
    const patternItems = [framePolygon, spacePolygon]
    const pattern = svgPatternElement(patternSize, patternId, patternItems)
    const defsElement = svgDefsElement([pattern])
    const patternedPolygon = svgPolygonElement(patternedSize, '', svgUrl(patternId))
    return svgSvgElement(patternedSize, [defsElement, patternedPolygon])
  }

  clipIcon(size: Size, totalSize: Size, scale: number, gap = 1): Promise<SvgOrImageDataOrError> {
    const { timeRange, track } = this
    const { startTime, fps } = timeRange
    const { frame } = startTime
    const { mash } = track
    const widthAndBuffer = size.width + gap
    const cells = arrayOfNumbers(Math.ceil(totalSize.width / widthAndBuffer))
    let pixel = 0
    const times = cells.map(() => {
      const currentFrame = frame + pixelToFrame(pixel, scale, 'floor')
      pixel += widthAndBuffer
      return timeFromArgs(currentFrame, fps)
    })
    const validTimes = times.filter(time => timeRange.intersects(time))
    const previews = validTimes.map(time => {
      const previewArgs: MashPreviewArgs = { clip: this, mash, size, time }
      return new MashPreviewClass(previewArgs)
    })
    let svgItemsPromise = Promise.resolve([] as SvgItems)
    previews.forEach(preview => {
      svgItemsPromise = svgItemsPromise.then(items => {
        return preview.svgItemsPromise.then(svgItems => {
          return [...items, ...svgItems]
        })
      })
    })
    return svgItemsPromise.then(svgItems => {
      const point = { ...POINT_ZERO }
      const containerSvg = svgSvgElement(totalSize)
      svgItems.forEach(svgItem => {
        svgSetDimensions(svgItem, point)
        svgAppend(containerSvg, svgItem)
        point.x += widthAndBuffer
      })
      return { data: containerSvg }
    })
  }

  override get container(): ClientVisibleInstance { return super.container as ClientVisibleInstance }

  override get content(): ClientInstance { return super.content as ClientInstance }

  clipPreviewPromise(size: Size, time: Time, component: Panel): Promise<Preview> {
    assertSizeAboveZero(size)


    const { container, content, timeRange } = this

    assertTrue(timeRange.intersects(time), 'clipPreviewPromise timeRange does not intersect time')
    assertContainerInstance(container)
    const containerRectArgs: ContainerRectArgs = {
      size, time, timeRange: timeRange, editing: true,
    }
  
    const containerRects = this.containerRects(containerRectArgs)

    const [containerRect] = containerRects
    assertClientVisibleInstance(content)
    return container.clippedPreviewPromise(content, containerRect, size, time, component)

  }

  override changeScalar(propertyId: PropertyId, scalar?: Scalar): ChangeActionObject {
    const object = super.changeScalar(propertyId, scalar)
    if (!isChangePropertyActionObject(object)) return object
    
    const name = propertyId.split(DOT).pop()
    switch (name) {
      case 'frame': 
      case 'frames': {
        object.type = ActionTypeChangeFrame
        break
      }
      case 'containerId': 
      case 'contentId': {
        const container = name === 'containerId'
        const relevantTiming = container ? TimingContainer : TimingContent
        const relevantSizing = container ? SizingContainer : SizingContent
        const { timing, sizing, targetId } = this
        const timingBound = timing === relevantTiming
        const sizingBound = sizing === relevantSizing
        if (!(timingBound || sizingBound)) break


        const { undoValue, redoValue } = object
        assertPopulatedString(redoValue)

        const sizingId: PropertyId = `${targetId}${DOT}sizing`
        const timingId: PropertyId = `${targetId}${DOT}timing`
        const undoValues: ScalarsById = { 
          [timingId]: timing, 
          [sizingId]: sizing,
          [propertyId]: undoValue 
        }
        const redoValues: ScalarsById = { ...undoValues, [propertyId]: redoValue }
      
        const asset = this.asset(redoValue)
       

        const { type } = asset
        if (timingBound && !isAudibleAssetType(type)) {
          redoValues[timingId] = TimingCustom
        }
        if (sizingBound && !isVisibleAssetType(type)) {
          redoValues[sizingId] = container ? SizingContent : SizingContainer
        }

        const actionObject: ChangePropertiesActionObject = {
          type: ActionTypeChangeMultiple,
          target: this, redoValues, undoValues
        }
        return actionObject
      }
    }
    return object
  }

  protected override shouldSelectProperty(name: string): boolean {
    switch (name) {
      case 'sizing': return this.content.asset.type !== AUDIO
      case 'timing': {
        if (this.content.hasIntrinsicTiming) break
        return !!this.container?.hasIntrinsicSizing
      }
      case 'frame': return !this.track.dense
      case 'frames': return this.timing === TimingCustom
    }
    return true
  }

  override targetId: TargetId = TARGET_CLIP

  declare track: ClientTrack

  updateAssetId(oldId: string, newId: string): void {
    const { containerId, contentId } = this
    // console.log(this.constructor.name, 'updateAssetId', { oldId, newId, containerId, contentId })
    if (containerId === oldId) this.containerId = newId
    if (contentId === oldId) this.contentId = newId
  }
}
