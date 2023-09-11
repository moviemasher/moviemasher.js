export const ERROR = {
  ClientDisabledDelete: 'client.disabled.delete',
  ClientDisabledGet: 'client.disabled.get',
  ClientDisabledList: 'client.disabled.list',
  ClientDisabledSave: 'client.disabled.save',
  DecodeProbe: 'decode.probe',
  Environment: 'error.environment',
  Evaluation: 'error.evaluation',
  FilterId: 'filter.id',
  Frame: 'error.frame',
  Ffmpeg: 'ffpmeg',
  ImportDuration: 'import.duration',
  ImportFile: 'import.file',
  ImportSize: 'import.size',
  ImportType: 'import.type',
  Internal: 'error.internal',
  AssetId: 'asset.id',
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

export const ERROR_NAMES = Object.values(ERROR)

// export const StandardErrorName = {
//   Error: ERROR.Unknown,
//   EvalError: ERROR.Evaluation,
//   InternalError: ERROR.Internal,
//   RangeError: ERROR.Range,
//   ReferenceError: ERROR.Reference,
//   SyntaxError: ERROR.Syntax,
//   TypeError: ERROR.Type,
//   URIError: ERROR.Url,
// }
// export type StandardErrorName = typeof StandardErrorName[keyof typeof StandardErrorName]
