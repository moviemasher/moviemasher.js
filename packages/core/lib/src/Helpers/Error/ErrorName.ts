export const ErrorName = {
  ClientDisabledDelete: 'client.disabled.delete',
  ClientDisabledGet: 'client.disabled.get',
  ClientDisabledList: 'client.disabled.list',
  ClientDisabledSave: 'client.disabled.save',
  DecodeProbe: 'decode.probe',
  Environment: 'error.environment',
  Evaluation: 'error.evaluation',
  FilterId: 'filter.id',
  Frame: 'error.frame',
  ImportDuration: 'import.duration',
  ImportFile: 'import.file',
  ImportSize: 'import.size',
  ImportType: 'import.type',
  Internal: 'error.internal',
  MediaId: 'media.id',
  OutputDimensions: 'output.dimensions',
  OutputDuration: 'output.duration',
  Range: 'error.range',
  Reference: 'error.reference',
  ServerAuthentication: 'server.authentication',
  ServerAuthorization: 'server.authorization',
  Syntax: 'error.syntax',
  Type: 'error.type',
  Unimplemented: 'error.unimplemented',
  Unknown: 'error.unknown',
  Url: 'error.url',

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
