import type { Constrained, ContainerSvgItemArgs, ContentSvgItemArgs, DataOrError, IntrinsicOptions, MaybeComplexSvgItem, Rect, SvgItemsRecord, VisibleAsset, VisibleInstance } from '@moviemasher/shared-lib/types.js'
import type { ClientAsset, ClientInstance, ClientVisibleAsset, ClientVisibleInstance } from '../types.js'

import { POINT_ZERO, isDefiniteError } from '@moviemasher/shared-lib/runtime.js'
import { assertSizeNotZero, sizeNotZero } from '@moviemasher/shared-lib/utility/rect.js'

export function ClientVisibleAssetMixin
<T extends Constrained<ClientAsset & VisibleAsset>>(Base: T):
T & Constrained<ClientVisibleAsset>  {
  return class extends Base implements ClientVisibleAsset {
    
  }
}

export function ClientVisibleInstanceMixin<T extends Constrained<ClientInstance & VisibleInstance>>(Base: T):
  T & Constrained<ClientVisibleInstance> {
  return class extends Base implements ClientVisibleInstance {
    declare asset: ClientVisibleAsset
    clippedElementPromise(content: ClientVisibleInstance, args: ContainerSvgItemArgs): Promise<DataOrError<SvgItemsRecord>> {
      const { containerRect, ...rest } = args
      const { time, size } = args
      const contentRect = content.contentRect(time, containerRect, size)

      const contentArgs: ContentSvgItemArgs = { ...rest, contentRect }
      return content.contentSvgItemPromise(contentArgs).then(orError => {
        if (isDefiniteError(orError)) return orError

        const { data: item } = orError
        return this.containerSvgItemPromise(args).then(containerOrError => {
          if (isDefiniteError(containerOrError)) return containerOrError

          const { data: containerItem } = containerOrError
          return this.containedItem(item, containerItem, args)
        })  
      })
    }

     containerSvgItemPromise(args: ContainerSvgItemArgs): Promise<DataOrError<MaybeComplexSvgItem>> {
      return Promise.resolve(this.containerSvgItem(args))
    }

    contentSvgItemPromise(args: ContentSvgItemArgs): Promise<DataOrError<MaybeComplexSvgItem>> {
      return Promise.resolve(this.contentSvgItem(args))
    }

    override get intrinsicRect(): Rect {
      const { probeSize } = this.asset
      assertSizeNotZero(probeSize)
      
      return { ...POINT_ZERO, ...probeSize }
    }

    override intrinsicsKnown(options: IntrinsicOptions): boolean {
      if (!options.size) return true

      return sizeNotZero(this.asset.probeSize)
    }


  }
}
