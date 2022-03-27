import EventEmitter from "events"

export interface CommandProbeStream {
  [index: string]: any
  width?: number
  height?: number
  r_frame_rate?: string
  avg_frame_rate?: string
  duration?: string

}

export interface CommandProbeFormat {
  duration?: number
}
export interface CommandProbeData {
  streams: CommandProbeStream[]
  format: CommandProbeFormat
}
export interface CommandProbeFunction {
  (error: any, data: CommandProbeData): void
}

export interface Command extends EventEmitter {
  run(): void
  save(output: string): Command
  kill(signal: string): void
  ffprobe(callback: CommandProbeFunction): void
  _getArguments(): string[]
}
