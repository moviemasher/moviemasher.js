import type { ClientAsset, ClientInstance, ClientVisibleAsset, ClientVisibleInstance, Constrained, ContainerSvgItemArgs, ContentSvgItemArgs, DataOrError, IntrinsicOptions, MaybeComplexSvgItem, Property, Rect, SizeKey, SvgItemsRecord, TargetId, VisibleAsset, VisibleInstance } from '../types.js'

import { $ASPECT, $END, $FLIP, $HEIGHT, $SIZE, $WIDTH, POINT_ZERO, isDefiniteError } from '../runtime.js'
import { assertSizeNotZero, sizeNotZero } from '../utility/rect.js'

export function ClientVisibleAssetMixin
<T extends Constrained<ClientAsset & VisibleAsset>>(Base: T):
T & Constrained<ClientVisibleAsset>  {
  return class extends Base implements ClientVisibleAsset {}
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

    private shouldSelectPropertySize(sizeKey: SizeKey): boolean {
      const { sizeKey: size } = this
      if (!size) return true
  
      const sizeAspect = this.value([$SIZE, $ASPECT].join(''))
      const { size: mashSize } = this.clip.track!.mash
      const mashPortrait = mashSize.width < mashSize.height
      const flipped = mashPortrait && sizeAspect === $FLIP
      const property = flipped ? size === $WIDTH ? $HEIGHT : $WIDTH : size
      return property === sizeKey
    }
    
    override shouldSelectProperty(property: Property, targetId: TargetId): Property | undefined {
      if (targetId !== property.targetId) return 
      
      const { name } = property
  
      switch (name) {
        case $HEIGHT:
        case `${$HEIGHT}${$END}`: 
          return this.shouldSelectPropertySize($HEIGHT) ? property : undefined
        case $WIDTH:
        case `${$WIDTH}${$END}`: 
          return this.shouldSelectPropertySize($WIDTH) ? property : undefined
      }
      return super.shouldSelectProperty(property, targetId)
    }
  }
}
