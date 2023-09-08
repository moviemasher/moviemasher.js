import { EventServerEncodeFinish } from "@moviemasher/runtime-server";


const finishHandler = (event: EventServerEncodeFinish) => {

}

export const ServerEncodeFinishListeners = () => ({
  [EventServerEncodeFinish.Type]: finishHandler,
})



// const outputDirectory = this.outputDirectory(user, id, renderingId)
// const jsonPath = path.join(outputDirectory, `${BasenameRendering}.json`)
// const jsonString = fileRead(jsonPath)
// const json: RenderingOptions = JSON.parse(jsonString)
// const { output } = json

// const filenames = fs.readdirSync(outputDirectory)
// const countsByType: NumberRecord = {}

// const working = (renderingCommandOutput => {
//   // console.log(this.constructor.name, 'status output', renderingCommandOutput)
//   const { outputType } = renderingCommandOutput
//   if (!isDefined(countsByType[outputType])) countsByType[outputType] = -1
//   countsByType[outputType]++
//   const index = countsByType[outputType]
//   response[outputType] ||= { total: 0, completed: 0 }
//   const state = response[outputType]!
//   state.total++
//   const resultFileName = renderingOutputFile(renderingCommandOutput, ExtensionLoadedInfo)
//   if (filenames.includes(resultFileName)) {
//     state.completed++
//     return 0
//   }
//   return 1
// })(output)
// if (working) response.apiCallback = this.statusCallback(id, renderingId)
// else response.apiCallback = this.dataPutCallback(user, id, renderingId, [output])