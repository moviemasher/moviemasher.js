export const ErrorName = {
  Environment: 'error.environment',
  DecodeProbe: 'decode.probe',
  Unknown: 'error.unknown',
  Internal: 'error.internal',
  Type: 'error.type',
  Reference: 'error.reference',
  Range: 'error.range',
  Syntax: 'error.syntax',
  Url: 'error.url',
  Evaluation: 'error.evaluation',
  ClientDisabledDelete: 'client.disabled.delete',
  ClientDisabledGet: 'client.disabled.get',
  ClientDisabledList: 'client.disabled.list',
  ClientDisabledSave: 'client.disabled.save',
  ImportType: 'import.type',
  ImportDuration: 'import.duration',
  ImportSize: 'import.size',
  ImportFile: 'import.file',
  ServerAuthentication: 'server.authentication',
  ServerAuthorization: 'server.authorization',
  FilterId: 'filter.id',
  MediaId: 'media.id',
  Unimplemented: 'error.unimplemented',
  Frame: 'error.frame',
  OutputDuration: 'output.duration',
  OutputDimensions: 'output.dimensions',

} as const
export type ErrorName = typeof ErrorName[keyof typeof ErrorName]
export type ErrorNames = ErrorName[]
export const ErrorNames: ErrorNames = Object.values(ErrorName)

export const StandardErrorName = {
  Error: ErrorName.Unknown,
  EvalError: ErrorName.Evaluation,
  InternalError: ErrorName.Internal,
  RangeError: ErrorName.Range,
  ReferenceError: ErrorName.Reference,
  SyntaxError: ErrorName.Syntax,
  TypeError: ErrorName.Type,
  URIError: ErrorName.Url,
}
export type StandardErrorName = typeof StandardErrorName[keyof typeof StandardErrorName]
