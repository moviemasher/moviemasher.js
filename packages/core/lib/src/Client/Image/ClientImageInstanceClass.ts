import { Rect, RectOptions } from '@moviemasher/runtime-shared'
import { ImageInstance } from "../../Shared/Image/ImageInstance.js"
import { ClientInstanceClass } from "../Instance/ClientInstanceClass.js"
import { SvgItem } from '../../Helpers/Svg/Svg.js'
import { isDefiniteError } from '../../Shared/SharedGuards.js'
import { Time, TimeRange } from '@moviemasher/runtime-shared'
import { svgImagePromiseWithOptions } from '../../Helpers/Svg/SvgFunctions.js'
import { TypeImage } from '@moviemasher/runtime-shared'
import { ClientImageAsset } from "../ClientTypes.js"
import { errorThrow } from '../../Helpers/Error/ErrorFunctions.js'
import { VisibleInstanceMixin } from '../../Shared/Visible/VisibleInstanceMixin.js'
import { ClientVisibleInstanceMixin } from "../Visible/ClientVisibleInstanceMixin.js"
import { ClientVisibleInstance } from '../ClientTypes.js'
import { ImageInstanceMixin } from '../../Shared/Image/ImageInstanceMixin.js'
import { clientMediaImagePromise } from '../../Helpers/ClientMedia/ClientMediaFunctions.js'


const WithBase = VisibleInstanceMixin(ClientInstanceClass)
const WithVisible = ClientVisibleInstanceMixin(WithBase)
const WithImage = ImageInstanceMixin(WithVisible)


export class ClientImageInstanceClass extends WithImage implements ImageInstance, ClientVisibleInstance {
  svgItemForTimelinePromise(rect: Rect, time: Time, ): Promise<SvgItem> {
    const { asset: definition } = this
    const requestable = definition.preferredAsset(TypeImage)
    if (!requestable) return errorThrow(`No requestable for ${TypeImage}`)
    
    const { request } = requestable
    return clientMediaImagePromise(request).then(orError => {
      if (isDefiniteError(orError)) return errorThrow(orError.error)

      const { data: clientImage } = orError
      const { src } = clientImage
      const svgImageOptions: RectOptions = { ...rect }
      return svgImagePromiseWithOptions(src, svgImageOptions)
    })
  }
  declare asset: ClientImageAsset
}
