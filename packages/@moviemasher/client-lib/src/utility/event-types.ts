import type { AssetObject, AssetObjects, AssetObjectsResponse, Assets, ClientAssets, ClientAsset, Clip, Clips, DataOrError, DataType, DecodeOptions, Decoding, DecodingType, EncodeArgs, Encoding, Exporters, Importers, Ordered, Propertied, PropertyId, PropertyIds, RawType, RawTypes, Scalar, SelectorTypes, ServerProgress, Size, Source, Sources, SvgElement, SvgItems, TargetId, TargetIds, TranscodeOptions, Transcoding, TranscodingType } from '@moviemasher/shared-lib/types.js'
import { ClipLocation, SelectedProperties, TranslateArgs, IconResponse, AssetObjectsParams, NodeFunctionMap } from '../types'

export interface EventEnabledClientActionDetail {
  clientAction: string
  enabled?: boolean
}

export interface EventClientDecodeDetail {
  options?: DecodeOptions
  decodingType: DecodingType
  asset: ClientAsset
  promise?: Promise<DataOrError<Decoding>>
  progress?: ServerProgress
}

export interface EventClientEncodeDetail extends EncodeArgs {
  promise?: Promise<DataOrError<Encoding>>
  progress?: ServerProgress
}

export interface EventClientTranscodeDetail {
  options?: TranscodeOptions
  transcodingType: TranscodingType
  asset: ClientAsset
  promise?: Promise<DataOrError<Transcoding>>
  progress?: ServerProgress
}

export interface EventDataTypeDetail {
  propertyId: PropertyId
  dataType?: DataType
}

export interface EventManagedAssetIconDetail {
  cover?: boolean
  assetId: string
  size: Size
  promise?: Promise<DataOrError<Element>>
}

export interface EventManagedAssetIdDetail {
  previousId: string
  currentId: string
}

export interface EventAddAssetsDetail {
  mashIndex?: ClipLocation
  assets: ClientAssets
}

export interface EventManagedAssetDetail {
  assetId: string
  assetObject?: AssetObject
  asset?: ClientAsset
}

export interface EventProgressDetail {
  id: string
  progress: number
}

export interface EventDoServerActionDetail {
  serverAction: string
  id?: string
  promise?: Promise<void>
}

export interface EventEnabledServerActionDetail {
  serverAction: string
  enabled?: boolean
}

export interface EventClipElementDetail {
  maxWidth: number
  scale: number
  trackIndex: number
  trackWidth: number
  width: number
  left: number

  label?: string

  labels?: boolean
  icons?: boolean
  clipId: string
  element?: Element
}

export interface EventAssetElementDetail {
  cover?: boolean
  size: Size
  label?: string
  labels?: boolean
  icons?: boolean
  assetId: string
  element?: Element
}

export interface EventPropertyIdsDetail {
  targetIds: TargetIds
  propertyIds: PropertyIds
}

export interface EventSelectedPropertiesDetail {
  selectorTypes?: SelectorTypes
  selectedProperties: SelectedProperties
}

export interface EventPreviewsDetail {
  size?: number | Size
  promise?: Promise<SvgItems>
  elements?: SvgItems
}

export interface EventScalarDetail {
  propertyId: PropertyId
  value?: Scalar
}

export interface EventSelectableDetail {
  targetId: TargetId
  selectable?: Propertied | false
}

export interface EventChangeScalarDetail {
  propertyId: PropertyId
  value?: Scalar
}

export interface EventClipDetail {
  clipId: string
  clip?: Clip
}

export interface EventControlGroupDetail extends Ordered {
  propertyIds: PropertyIds
  selectedProperties?: SelectedProperties
  controlGroup?: Node
  groupedPropertyIds: PropertyIds
}

export interface EventControlDetail {
  type: DataType
  propertyId: PropertyId
  control?: Node
}

export interface EventInspectorSelectorsDetail {
  filter?: string
  selectorTypes: SelectorTypes
}

export interface EventImportDetail {
  fileList: FileList
  promise?: Promise<AssetObjects>
}

export interface EventImportFileDetail {
  source?: Source
  file: File
  promise?: Promise<DataOrError<AssetObject>>
}

export interface EventIconDetail extends TranslateArgs {
  promise?: Promise<DataOrError<IconResponse>>
}

export interface EventAssetObjectDetail {
  assetType?: RawType
  promise?: Promise<DataOrError<AssetObject>>
}

export interface EventAssetObjectsDetail extends AssetObjectsParams {
  promise?: Promise<DataOrError<AssetObjectsResponse>>
}

export interface EventManagedAssetsDetail extends AssetObjectsParams {
  promise?: Promise<DataOrError<Assets>>
}

export interface EventImporterNodeFunctionDetail {
  map: NodeFunctionMap
  types: RawTypes
  sources: Sources
}

export interface EventImportersDetail {
  importers: Importers
}

export interface EventImporterAddDetail {
  assetObject: AssetObject
  promise?: Promise<DataOrError<ClientAsset>>
}

export interface EventExportersDetail {
  exporters: Exporters
}

export interface EventTrackClipsDetail {
  trackIndex: number
  clips?: Clips
  dense?: boolean
}

export interface EventTrackClipIconDetail {
  clipSize: Size
  clipId: string
  gap?: number
  scale: number
  promise?: Promise<DataOrError<SvgElement>>
  background?: SVGElement
}

export interface EventMoveClipDetail {
  clipId?: string
  clipLocation: ClipLocation
}

export interface EventTranslateDetail extends TranslateArgs {
  promise?: Promise<DataOrError<string>>
}

export interface EventPickDetail extends Required<EventPickedDetail> { }

export interface EventPickedDetail {
  picker: string
  picked?: string
}
