import { Size, Time, TypeImage, TypeVideo } from '@moviemasher/runtime-shared'
import { ClientVideoAsset } from "../ClientTypes.js"
import { Component } from '../../Base/Code.js'
import { ClientInstanceClass } from '../Instance/ClientInstanceClass.js'
import { assertDefined, isBoolean, isDefiniteError } from '../../Shared/SharedGuards.js'
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { TypeSequence } from '../../Setup/EnumConstantsAndFunctions.js'
import { ClientAudibleInstance, ClientInstance, ClientVisibleInstance } from '../ClientTypes.js'
import { Rect } from '@moviemasher/runtime-shared'
import { NamespaceSvg, SemicolonChar } from '../../Setup/Constants.js'
import { ClientVideo } from '../../Helpers/ClientMedia/ClientMedia.js'
import { ErrorName } from '../../Helpers/Error/ErrorName.js'
import { PreviewItems, SvgItem } from '../../Helpers/Svg/Svg.js'
import { assertClientImage, assertClientVideo, clientMediaImagePromise, clientMediaVideoPromise } from '../../Helpers/ClientMedia/ClientMediaFunctions.js'
import { svgAppend, svgDefsElement, svgSet, svgSetChildren, svgSetDimensions, svgSvgElement, svgUrl } from '../../Helpers/Svg/SvgFunctions.js'
import { AudibleInstanceMixin } from '../../Shared/Audible/AudibleInstanceMixin.js'
import { AudibleClientInstanceMixin } from "../Audible/AudibleClientInstanceMixin.js"
import { VisibleInstanceMixin } from '../../Shared/Visible/VisibleInstanceMixin.js'
import { ClientVisibleInstanceMixin } from "../Visible/ClientVisibleInstanceMixin.js"
import { sizeCopy } from '../../Utility/SizeFunctions.js'
import { VideoInstanceMixin } from '../../Shared/Video/VideoInstanceMixin.js'
import { pointCopy } from '../../Utility/PointFunctions.js'
import { colorWhite } from '../../Helpers/Color/ColorConstants.js'
import { idGenerateString } from '../../Utility/Id.js'
import { Transcoding, TranscodingTypes } from '../../Plugin/Transcode/Transcoding/Transcoding.js'
import { VideoInstance } from '../../Shared/Video/VideoInstance.js'


const WithAudibleInstance = AudibleInstanceMixin(ClientInstanceClass)
const WithVisibleInstance = VisibleInstanceMixin(WithAudibleInstance)
const WithClientAudibleInstance = AudibleClientInstanceMixin(WithVisibleInstance)
const WithClientVisibleInstanceD = ClientVisibleInstanceMixin(WithClientAudibleInstance)
const WithVideo = VideoInstanceMixin(WithClientVisibleInstanceD)

export class ClientVideoInstanceClass extends WithVideo implements VideoInstance, ClientVisibleInstance, ClientAudibleInstance {

  declare asset: ClientVideoAsset

  containedPromise(video: ClientVideo, content: ClientInstance, containerRect: Rect, size: Size, time: Time, component: Component): Promise<PreviewItems> {
    const x = Math.round(Number(video.getAttribute('x')))
    const y = Math.round(Number(video.getAttribute('y')))
    const containerPoint = pointCopy(containerRect)
    containerPoint.x -= x
    containerPoint.y -= y

    const zeroRect = { ...containerPoint, ...sizeCopy(containerRect) }
    const updatableContainer = !this.asset.isVector
    const promise: Promise<string[]> = updatableContainer ? this.stylesPromise(zeroRect, this.assetTime(time)) : Promise.resolve([])

    return promise.then(styles => {
      const items: PreviewItems = []
      const { div } = this

      styles.push(`left: ${x}px`)
      styles.push(`top: ${y}px`)
      if (!updatableContainer) {
        const containerItem = this.pathElement(zeroRect)
        containerItem.setAttribute('fill', colorWhite)
        const clipId = idGenerateString()
        const clipElement = globalThis.document.createElementNS(NamespaceSvg, 'clipPath')
        svgSet(clipElement, clipId)
        svgAppend(clipElement, containerItem)

        const svg = svgSvgElement(size)
        svgSetChildren(svg, [svgDefsElement([clipElement])])

        styles.push(`clip-path:${svgUrl(clipId)}`)
        items.push(svg)
      }
      div.setAttribute('style', styles.join(SemicolonChar) + SemicolonChar)
      svgSetChildren(div, [video])

      items.push(div)
      return items
    })
  }
  
  private _div?: HTMLDivElement
  private get div() {
    return this._div ||= globalThis.document.createElement('div')
  }

  protected _foreignElement?: SVGForeignObjectElement
  get foreignElement() { 
    const { _foreignElement } = this
    if (_foreignElement) return _foreignElement

    const { document } = globalThis
    const element = document.createElementNS(NamespaceSvg, 'foreignObject')
    return this._foreignElement = element
  }

  loadedVideo?: ClientVideo 

  private previewVideoPromise(previewTranscoding: Transcoding): Promise<ClientVideo> {
    const { loadedVideo } = this
    if (loadedVideo) return Promise.resolve(loadedVideo)

    const { request } = previewTranscoding
    return clientMediaVideoPromise(request).then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientVideo } = orError
 
      const video = clientVideo.cloneNode() as ClientVideo
      this.loadedVideo = video
      this.foreignElement.appendChild(video)
      return video
    })
  }


  private sequenceItemPromise(rect: Rect, definitionTime: Time): Promise<SvgItem> {
    return errorThrow(ErrorName.Unimplemented)
    // const { asset } = this
    // const { request } = asset

    // return clientMediaImagePromise(definitionTime).then(loadedImage => {
    //   const { src } = loadedImage
    //   const coverSize = sizeCover(sizeCopy(loadedImage), sizeCopy(rect))
    //   return svgImagePromiseWithOptions(src, coverSize)
    // })
  }


  private stylesPromise(zeroRect: Rect, definitionTime: Time): Promise<string[]> {
    return this.stylesSrcPromise(zeroRect, definitionTime).then(src => {
      const styles: string[] = []
      styles.push(`mask-image: url(${src})`)
      styles.push('mask-repeat: no-repeat')
      styles.push('mask-mode: luminance')
      styles.push(`mask-size: ${zeroRect.width}px ${zeroRect.height}px`)
      styles.push(`mask-position: ${zeroRect.x}px ${zeroRect.y}px`)
      return styles
    })
  }

  private stylesSrcPromise(zeroRect: Rect, definitionTime: Time): Promise<string> {
    const { type, asset } = this
    const types: TranscodingTypes = []
    if (type === TypeImage) types.push(type)
    else types.push(TypeSequence, TypeVideo)
    // const transcoding = asset.preferredAsset(...types)
    // assertDefined(transcoding)


    // const { type: transcodingType } = transcoding

    // TODO: support sequences
    // if (transcodingType === TypeSequence) {
    //   assertVideoMedia(definition)
    //   return definition.loadedImagePromise(definitionTime, sizeCopy(zeroRect)).then(image => (
    //     image.src
    //   ))
    // }
    const imageTranscoding = asset.preferredAsset(TypeImage) 
    assertDefined(imageTranscoding)
    const { request } = imageTranscoding

    return clientMediaImagePromise(request).then(orError => {
      if (isDefiniteError(orError))
        return errorThrow(orError.error)

      const { data: clientImage } = orError


      assertClientImage(clientImage)
      return clientImage.src
    })
  }

  svgItemForPlayerPromise(rect: Rect, time: Time): Promise<SvgItem> {
    const { loadedVideo, asset } = this
    const definitionTime = this.assetTime(time)
    if (loadedVideo) return Promise.resolve(this.videoForPlayerPromise(rect, definitionTime))

    const { previewTranscoding } = asset
    if (!previewTranscoding) return errorThrow(ErrorName.Type)

    const { type } = previewTranscoding
    switch (type) {
      case TypeVideo: {
        return this.videoItemForPlayerPromise(previewTranscoding, rect, definitionTime)
      }

      // TODO: support sequence
      // case TypeSequence: {
      //   return this.sequenceItemPromise(rect, definitionTime)
      // }
    }
    return errorThrow(ErrorName.Type)
  }

  svgItemForTimelinePromise(rect: Rect, time: Time): Promise<SvgItem> {
    const definitionTime = this.assetTime(time)
    return this.sequenceItemPromise(rect, definitionTime)
  }

  unload() {
    delete this._foreignElement
    delete this.loadedVideo
  }

  private videoForPlayerPromise(rect: Rect, definitionTime: Time): SvgItem {
    const { loadedVideo: video } = this 
    assertClientVideo(video)
    
    video.currentTime = definitionTime.seconds

    const { clientCanMaskVideo } = ClientVideoInstanceClass
    if (clientCanMaskVideo) svgSetDimensions(this.foreignElement, rect)
  
    const { width, height } = rect
    video.width = width 
    video.height = height

    return clientCanMaskVideo ? this.foreignElement : video
  }


  private videoItemForPlayerPromise(previewTranscoding: Transcoding, rect: Rect, definitionTime: Time): Promise<SvgItem> {
    console.log(this.constructor.name, 'videoItemForPlayerPromise', definitionTime, previewTranscoding)
    return this.previewVideoPromise(previewTranscoding).then(() => (
      this.videoForPlayerPromise(rect, definitionTime)
    ))
  }


  static _clientCanMaskVideo?: boolean
  static get clientCanMaskVideo(): boolean {
    const { _clientCanMaskVideo } = this
    if (isBoolean(_clientCanMaskVideo)) return _clientCanMaskVideo

    const { navigator } = globalThis
    const { userAgent } = navigator
    const safari = userAgent.includes('Safari') && !userAgent.includes('Chrome')
    return this._clientCanMaskVideo = !safari
  }
}
