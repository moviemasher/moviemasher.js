import { isImportedAssetObject } from "../../Shared/Imported/ImportedAssetGuards.js";
import { ImportedClientAssetObject } from "./ClientAsset.js";

export const isClientImportedAssetObject = (value: any): value is ImportedClientAssetObject => (
  isImportedAssetObject(value) && 
  ('clientAudio' in value || 'clientVideo' in value || 'clientImage' in value)
)

