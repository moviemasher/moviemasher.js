import { Builder } from './Builder.js'
import { DocumentationConfiguration } from './Types.js';


export class DocumentationBuilder extends Builder {
  
  buildDocumentation(configuration: DocumentationConfiguration) {
    return this.run(configuration)
  }
}