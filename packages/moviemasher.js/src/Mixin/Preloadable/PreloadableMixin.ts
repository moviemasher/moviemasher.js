import { ContentClass } from "../../Content/Content"
import { CommandFile, CommandFiles, ContentCommandFileArgs, GraphFileArgs, GraphFiles } from "../../MoveMe"
import { Preloadable, PreloadableClass, PreloadableDefinition } from "./Preloadable"

export function PreloadableMixin<T extends ContentClass>(Base: T): PreloadableClass & T {
  return class extends Base implements Preloadable {
    contentCommandFiles(args: ContentCommandFileArgs): CommandFiles {
      const commandFiles = super.contentCommandFiles(args)
      const graphFiles = this.graphFiles(args)
      
      commandFiles.push(...graphFiles.map((graphFile, index) => {
        const inputId = index ? `${this.id}-${index}` : this.id
        const commandFile: CommandFile = { ...graphFile, inputId }
        return commandFile
      }))
      // console.log(this.constructor.name, "contentCommandFiles", commandFiles.length)
      return commandFiles
    }
  
    graphFiles(args: GraphFileArgs): GraphFiles {
      return this.definition.graphFiles(args)
    }

    declare definition: PreloadableDefinition
  }
}
