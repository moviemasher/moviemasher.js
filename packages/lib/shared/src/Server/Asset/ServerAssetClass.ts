import { GraphFiles, ServerPromiseArgs } from "../GraphFile.js";
import { PreloadArgs } from "../../Base/CacheTypes.js";
import { InstanceArgs, InstanceObject } from "../../Shared/Instance/Instance.js";
import { AssetClass } from "../../Shared/Asset/AssetClass.js";
import { ServerAsset } from "./ServerAsset.js";
import { requestPromise } from "../../Helpers/Request/RequestFunctions.js";
import { isRequest } from "../../Helpers/Request/RequestGuards.js";
import { isDefiniteError } from "../../Shared/SharedGuards.js";
import { TypeString } from "../../Utility/ScalarFunctions.js";

export class ServerAssetClass extends AssetClass implements ServerAsset {
  graphFiles(args: PreloadArgs): GraphFiles {
    throw new Error("Method not implemented.");
  }
  serverPromise(args: ServerPromiseArgs): Promise<void> {
    if (this.serverPath) return Promise.resolve()

    const { request } = this
    if (!isRequest(request)) return Promise.resolve()
    
    return requestPromise(request, TypeString).then(orError => {
      if (!isDefiniteError(orError)) {
        const { data } = orError
        this.serverPath = data
      }
    })
  }
  

  instanceArgs(object?: InstanceObject): InstanceArgs {
    return { ...super.instanceArgs(object), asset: this, assetId: this.id }
  }
}