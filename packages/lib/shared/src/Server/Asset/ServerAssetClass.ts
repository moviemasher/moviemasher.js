import { GraphFiles, ServerPromiseArgs } from "@moviemasher/runtime-server";
import { PreloadArgs } from "@moviemasher/runtime-shared";
import { InstanceArgs, InstanceObject } from "@moviemasher/runtime-shared";
import { AssetClass } from "../../Shared/Asset/AssetClass.js";
import { ServerAsset } from "@moviemasher/runtime-server";
import { requestPromise } from "../Utility/ProtocolRequestFunctions.js";
import { isRequest } from "../../Helpers/Request/RequestGuards.js";
import { isDefiniteError } from '@moviemasher/runtime-shared';
import { TypeString } from "@moviemasher/runtime-shared";

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