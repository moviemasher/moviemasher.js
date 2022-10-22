/// <reference types="connect" />
/// <reference types="node" />
/// <reference types="fluent-ffmpeg" />
/// <reference types="express" />
import createServer from "connect";
import { CommandProbeData, CommandOptions, LoadedInfo, Size, OutputType, RenderingCommandOutput, RenderingStartRequest, RenderingStartResponse, RenderingStatusResponse, RenderingStatusRequest, RenderingUploadRequest, RenderingUploadResponse, Endpoint, JsonObject, StringObject, UnknownObject, ServerType, ApiCallbacksRequest, ApiCallbacksResponse, ApiServersRequest, ApiServersResponse, WithError, DataCastDefaultResponse, DataCastDefaultRequest, DataMashDefaultRequest, DataMashDefaultResponse, DataCastDeleteResponse, DataCastDeleteRequest, DataDefinitionDeleteResponse, DataDefinitionDeleteRequest, DataMashDeleteResponse, DataMashDeleteRequest, DataCastPutResponse, DataCastPutRequest, DataMashRetrieveRequest, DataDefinitionPutResponse, DataDefinitionPutRequest, DataMashPutRequest, DataMashPutResponse, DataMashGetResponse, DataGetRequest, DataRetrieveResponse, DataCastGetResponse, DataDefinitionGetResponse, DataDefinitionGetRequest, DataCastRetrieveRequest, DataDefinitionRetrieveResponse, DataDefinitionRetrieveRequest, ApiCallback, FileStoreRequest, FileStoreResponse, LoadType, NumberObject, StringsObject, UploadDescription, CommandOutput, StreamingStartResponse, StreamingPreloadResponse, StreamingPreloadRequest, StreamingCutRequest, StreamingCutResponse, StreamingStatusResponse, StreamingStatusRequest, StreamingDeleteRequest, StreamingDeleteResponse, StreamingRemoteRequest, StreamingRemoteResponse, StreamingLocalRequest, StreamingLocalResponse, StreamingWebrtcRequest, StreamingStartRequest, StreamingFormat, CommandInput, Timeout, CommandInputs, CommandFilters, AVType, ApiServerInit, DefinitionObject, CastObject, DataServerInit, AndId, RenderingOptions, RenderingResult, Mash, CommandDescription, CommandDescriptions, RenderingDescription, GraphFile, GraphType, LoaderClass, LoaderCache, Loaded, DefinitionObjects, MashObject, StreamingCommandOutput, ClipObject, DefinitionType, ValueObject, CommandOutputs, RenderingInput } from "@moviemasher/moviemasher.js";
import EventEmitter from "events";
import internal from "stream";
import { PassThrough, Stream, Writable } from "stream";
import ffmpeg from "fluent-ffmpeg";
import Express from "express";
import { Socket } from "net";
interface ConnectionJson {
    iceConnectionState: RTCIceConnectionState;
    id: string;
    localDescription: RTCSessionDescription | null;
    remoteDescription: RTCSessionDescription | null;
    signalingState: RTCSignalingState;
    state: string;
}
declare const Authenticator: createServer.NextHandleFunction;
type CommandDestination = string | internal.Writable;
interface CommandResult {
    error?: string;
}
interface RunningCommand extends EventEmitter {
    id: string;
    run(destination: CommandDestination): void;
    runPromise(destination: CommandDestination): Promise<CommandResult>;
    command: Command;
    kill(): void;
}
interface CommandProbeFunction {
    (error: any, data: CommandProbeData): void;
}
interface Command extends EventEmitter {
    run(): void;
    output(destination: CommandDestination): Command;
    save(output: string): Command;
    mergeAdd(file: string): Command;
    mergeToFile(destination: CommandDestination): Command;
    kill(signal: string): void;
    ffprobe(callback: CommandProbeFunction): void;
    _getArguments(): string[];
}
declare const commandProcess: () => ffmpeg.FfmpegCommand;
declare const commandInstance: (args: CommandOptions) => Command;
declare const commandPath: (path?: string) => void;
declare class Probe {
    private static AlphaFormatsCommand;
    private static _alphaFormats?;
    static get alphaFormats(): string[];
    private static get alphaFormatsInitialize();
    private static probeFile;
    static promise(temporaryDirectory: string, file: string, destination?: string): Promise<LoadedInfo>;
}
interface ApiServerArgs extends ServerArgs {
}
interface ApiServer extends Server {
    args: ApiServerArgs;
    callbacks: ServerHandler<ApiCallbacksResponse, ApiCallbacksRequest>;
    servers: ServerHandler<ApiServersResponse, ApiServersRequest>;
}
interface WebServerArgs extends ServerArgs {
    sources: StringObject;
}
interface WebServer extends Server {
    args: WebServerArgs;
}
interface DataServerArgs extends ServerArgs {
    temporaryIdPrefix: string;
    dbMigrationsPrefix: string;
    dbPath: string;
}
interface DataServer extends Server {
    args: DataServerArgs;
    defaultCast: ServerHandler<DataCastDefaultResponse | WithError, DataCastDefaultRequest>;
    defaultMash: ServerHandler<DataMashDefaultResponse | WithError, DataMashDefaultRequest>;
    deleteCast: ServerHandler<DataCastDeleteResponse, DataCastDeleteRequest>;
    deleteDefinition: ServerHandler<DataDefinitionDeleteResponse, DataDefinitionDeleteRequest>;
    deleteMash: ServerHandler<DataMashDeleteResponse, DataMashDeleteRequest>;
    getCast: ServerHandler<DataCastGetResponse, DataGetRequest>;
    getDefinition: ServerHandler<DataDefinitionGetResponse, DataDefinitionGetRequest>;
    getMash: ServerHandler<DataMashGetResponse, DataGetRequest>;
    putCast: ServerHandler<DataCastPutResponse | WithError, DataCastPutRequest>;
    putDefinition: ServerHandler<DataDefinitionPutResponse | WithError, DataDefinitionPutRequest>;
    putMash: ServerHandler<DataMashPutResponse | WithError, DataMashPutRequest>;
    retrieveCast: ServerHandler<DataRetrieveResponse | WithError, DataCastRetrieveRequest>;
    retrieveDefinition: ServerHandler<DataDefinitionRetrieveResponse | WithError, DataDefinitionRetrieveRequest>;
    retrieveMash: ServerHandler<DataRetrieveResponse | WithError, DataMashRetrieveRequest>;
}
declare const FileServerFilename = "original";
interface FileServerArgs extends ServerArgs {
    uploadsPrefix: string;
    uploadsRelative: string;
    uploadLimits: NumberObject;
    extensions: StringsObject;
}
interface FileServer extends Server {
    args: FileServerArgs;
    constructCallback(uploadDescription: UploadDescription, userId: string, id: string): ApiCallback;
    property: string;
    extensionLoadType(extension: string): LoadType | undefined;
    store: ServerHandler<FileStoreResponse, FileStoreRequest>;
    userUploadPrefix(id: string, user?: string): string;
    withinLimits(size: number, type: string): boolean;
}
interface WebrtcStream {
    command: RunningCommand;
    destination: string;
    size: Size;
    video: PassThrough;
    audio: PassThrough;
    end?: boolean;
}
interface AudioData {
    samples: {
        buffer: ArrayBuffer;
    };
}
interface FrameData extends EventListenerObject {
    frame: {
        width: number;
        height: number;
        data: ArrayBuffer;
    };
}
declare class WebrtcConnection extends EventEmitter {
    constructor(id: string, outputPrefix?: string, commandOutput?: CommandOutput);
    applyAnswer(answer: RTCSessionDescriptionInit): Promise<void>;
    beforeOffer(): void;
    createAudioSink(): any;
    createVideoSink(): any;
    close(): void;
    connectionTimer?: Timeout;
    doOffer(): Promise<void>;
    get iceConnectionState(): RTCIceConnectionState;
    id: string;
    inputAudio(audio: internal.Stream): CommandInput;
    inputVideo(video: internal.Stream, size: Size): CommandInput;
    get localDescription(): RTCSessionDescription | null;
    onAudioData({ samples: { buffer } }: AudioData): void;
    onFrameData(frameData: FrameData): void;
    onIceConnectionStateChange(): void;
    commandOutput: CommandOutput;
    outputPrefix: string;
    _peerConnection: RTCPeerConnection | undefined;
    get peerConnection(): RTCPeerConnection;
    reconnectionTimer?: Timeout;
    get remoteDescription(): RTCSessionDescription | null;
    get signalingState(): RTCSignalingState;
    state: string;
    get stream(): WebrtcStream | undefined;
    streamForSize(size: Size): WebrtcStream;
    streams: WebrtcStream[];
    toJSON(): ConnectionJson;
    waitUntilIceGatheringStateComplete(): Promise<void>;
    static close(): void;
    static connectionsById: Map<string, WebrtcConnection>;
    static callbacksByConnection: Map<WebrtcConnection, () => void>;
    static create(id: string, outputPrefix?: string, commandOutput?: CommandOutput): WebrtcConnection;
    static deleteConnection(connection: WebrtcConnection): void;
    static getConnection(id: string): WebrtcConnection | null;
    static getConnections(): WebrtcConnection[];
    static toJSON(): ConnectionJson[];
}
interface FormatOptions {
    commandOutput: CommandOutput;
    file: string;
    segmentFile: string;
    url: string;
    directory: string;
}
type StreamingFormatOptions = {
    [index in StreamingFormat]: FormatOptions;
};
/** @experimental */
interface StreamingServerArgs extends ServerArgs {
    streamingFormatOptions: StreamingFormatOptions;
    appName: string;
    httpOptions: UnknownObject;
    rtmpOptions: UnknownObject;
    commandOutput: CommandOutput;
    webrtcStreamingDir: string;
    cacheDirectory: string;
    temporaryDirectory: string;
}
interface StreamingServer extends Server {
    args: StreamingServerArgs;
    cut: ServerHandler<StreamingCutResponse, StreamingCutRequest>;
    delete: ServerHandler<StreamingDeleteResponse, StreamingDeleteRequest>;
    remote: ServerHandler<StreamingRemoteResponse | WithError, StreamingRemoteRequest>;
    local: ServerHandler<StreamingLocalResponse | WithError, StreamingLocalRequest>;
    preload: ServerHandler<StreamingPreloadResponse, StreamingPreloadRequest>;
    start: ServerHandler<StreamingStartResponse, StreamingStartRequest>;
    status: ServerHandler<StreamingStatusResponse, StreamingStatusRequest>;
    webrtc: ServerHandler<WebrtcConnection | WithError, StreamingWebrtcRequest>;
}
interface HostOptions {
    api?: ApiServerArgs | false;
    corsOptions?: StringObject | false;
    data?: DataServerArgs | false;
    file?: FileServerArgs | false;
    port: number;
    host: string;
    rendering?: RenderingServerArgs | false;
    streaming?: StreamingServerArgs | false;
    web?: WebServerArgs | false;
    version?: string;
}
interface HostServers {
    [ServerType.Api]?: ApiServer;
    [ServerType.Data]?: DataServer;
    [ServerType.File]?: FileServer;
    [ServerType.Rendering]?: RenderingServer;
    [ServerType.Streaming]?: StreamingServer;
    [ServerType.Web]?: WebServer;
}
declare class Host {
    constructor(object: HostOptions);
    args: HostOptions;
    start(): void;
}
interface ServerAuthentication extends UnknownObject {
    password?: string;
    type?: string;
    users?: StringObject;
}
interface ServerArgs extends Endpoint {
    authentication?: ServerAuthentication;
}
interface Server {
    stopServer(): void;
    startServer(app: Express.Application, activeServers: HostServers): void;
    init(userId: string): JsonObject;
    id: string;
}
type ServerHandler<T1, T2 = UnknownObject> = Express.RequestHandler<UnknownObject, T1, T2, UnknownObject, UnknownObject>;
type RenderingCommandOutputs = {
    [index in OutputType]?: RenderingCommandOutput;
};
interface RenderingServerArgs extends ServerArgs {
    cacheDirectory: string;
    temporaryDirectory: string;
    commandOutputs?: RenderingCommandOutputs;
    previewSize?: Size;
    outputSize?: Size;
    iconSize?: Size;
}
interface RenderingServer extends Server {
    args: RenderingServerArgs;
    start: ServerHandler<RenderingStartResponse, RenderingStartRequest>;
    status: ServerHandler<RenderingStatusResponse, RenderingStatusRequest>;
    upload: ServerHandler<RenderingUploadResponse, RenderingUploadRequest>;
}
interface HostOptionsDefault {
    previewSize?: Size;
    outputSize?: Size;
    port?: number;
    host?: string;
    outputRate?: number;
    auth?: ServerAuthentication;
    temporaryDirectory?: string;
    fileUploadDirectory?: string;
    dataMigrationsDirectory?: string;
    renderingCacheDirectory?: string;
    dataBaseFile?: string;
    webServerHome?: string;
    version?: string;
    renderingCommandOutputs?: RenderingCommandOutputs;
}
declare const HostDefaultPort = 8570;
declare const HostDefaultOptions: (args?: HostOptionsDefault) => HostOptions;
declare class RunningCommandClass extends EventEmitter implements RunningCommand {
    constructor(id: string, args: CommandOptions);
    private _commandProcess?;
    get command(): Command;
    avType: AVType;
    commandFilters: CommandFilters;
    id: string;
    commandInputs: CommandInputs;
    kill(): void;
    makeDirectory(destination: string): void;
    output: CommandOutput;
    run(destination: CommandDestination): void;
    runError(destination: string, ...args: any[]): string;
    runPromise(destination: CommandDestination): Promise<CommandResult>;
}
declare const runningCommandGet: (id: string) => RunningCommand | undefined;
declare const runningCommandDelete: (id: string) => void;
declare const runningCommandInstance: (id: string, options: CommandOptions) => RunningCommand;
declare class ServerClass implements Server {
    args: ServerArgs;
    constructor(args: ServerArgs);
    id: string;
    init(userId: string): JsonObject;
    startServer(app: Express.Application, _activeServers: HostServers): void;
    stopServer(): void;
    userFromRequest(req: unknown): string;
}
declare class ApiServerClass extends ServerClass implements ApiServer {
    args: ApiServerArgs;
    constructor(args: ApiServerArgs);
    id: string;
    init(): ApiServerInit;
    private activeServers;
    callbacks: ServerHandler<ApiCallbacksResponse, ApiCallbacksRequest>;
    servers: ServerHandler<ApiServersResponse, ApiServersRequest>;
    startServer(app: Express.Application, activeServers: HostServers): void;
}
interface DataServerCastRelationUpdate {
    cast: CastObject;
    temporaryIdLookup: StringObject;
}
interface DataServerCastRelationSelect {
    cast: CastObject;
    definitions: DefinitionObject[];
}
interface DataServerRow extends UnknownObject, AndId {
}
declare class DataServerClass extends ServerClass implements DataServer {
    args: DataServerArgs;
    constructor(args: DataServerArgs);
    private castInsertPromise;
    private castUpdatePromise;
    private createPromise;
    private _db?;
    private get db();
    defaultCast: ServerHandler<DataCastDefaultResponse | WithError, DataCastDefaultRequest>;
    defaultMash: ServerHandler<DataMashDefaultResponse | WithError, DataMashDefaultRequest>;
    deleteCast: ServerHandler<DataCastDeleteResponse, DataCastDeleteRequest>;
    deleteDefinition: ServerHandler<DataDefinitionDeleteResponse, DataDefinitionDeleteRequest>;
    deleteMash: ServerHandler<DataMashDeleteResponse, DataMashDeleteRequest>;
    private deletePromise;
    fileServer?: FileServer;
    getCast: ServerHandler<DataCastGetResponse, DataGetRequest>;
    getDefinition: ServerHandler<DataDefinitionGetResponse, DataDefinitionGetRequest>;
    getLatestPromise(userId: string, quotedTable: string): Promise<JsonObject>;
    getMash: ServerHandler<DataMashGetResponse, DataGetRequest>;
    id: string;
    init(): DataServerInit;
    private insertDefinitionPromise;
    private jsonPromise;
    private mashInsertPromise;
    private mashUpdatePromise;
    putCast: ServerHandler<DataCastPutResponse | WithError, DataCastPutRequest>;
    putDefinition: ServerHandler<DataDefinitionPutResponse | WithError, DataDefinitionPutRequest>;
    putMash: ServerHandler<DataMashPutResponse | WithError, DataMashPutRequest>;
    renderingServer?: RenderingServer;
    retrieveCast: ServerHandler<DataRetrieveResponse | WithError, DataCastRetrieveRequest>;
    retrieveDefinition: ServerHandler<DataDefinitionRetrieveResponse | WithError, DataDefinitionRetrieveRequest>;
    retrieveMash: ServerHandler<DataRetrieveResponse | WithError, DataMashRetrieveRequest>;
    private rowExists;
    private selectCastsPromise;
    private selectDefinitionsPromise;
    private selectCastRelationsPromise;
    private selectMashRelationsPromise;
    private selectMashesPromise;
    private startDatabase;
    startServer(app: Express.Application, activeServers: HostServers): void;
    stopServer(): void;
    private updatePromise;
    private castUpdateRelationsPromise;
    private updateDefinitionPromise;
    private mashUpdateRelationsPromise;
    private updateRelationsPromise;
    private userIdPromise;
    private writeCastPromise;
    private writeDefinitionPromise;
    private writeMashPromise;
}
declare class FileServerClass extends ServerClass implements FileServer {
    args: FileServerArgs;
    constructor(args: FileServerArgs);
    constructCallback(uploadDescription: UploadDescription, userId: string, id: string): ApiCallback;
    get extensions(): string[];
    extensionLoadType(extension: string): LoadType | undefined;
    id: string;
    init(userId: string): JsonObject;
    property: string;
    startServer(app: Express.Application, activeServers: HostServers): void;
    store: ServerHandler<FileStoreResponse, FileStoreRequest>;
    userUploadPrefix(id: string, user?: string): string;
    withinLimits(size: number, type: string): boolean;
}
interface RenderingProcessInput {
    cacheDirectory: string;
    /** directory to place output file(s) within */
    outputDirectory: string;
    /** directory where file server creates user directories */
    filePrefix: string;
    /** user directory name */
    defaultDirectory: string;
    /** other allowed user directories relative to default - eg. shared */
    validDirectories: string[];
}
interface RenderingCallback {
    callback?: ApiCallback;
    id?: string;
}
interface RunResult {
    results: RenderingResult[];
}
interface RenderingProcessOptions extends RenderingProcessInput, Partial<RenderingOptions>, RenderingCallback {
}
interface RenderingArgs extends Required<RenderingOptions> {
}
interface RenderingProcessArgs extends RenderingProcessInput, RenderingArgs {
    id?: string;
    temporaryDirectory: string;
}
interface RenderingProcess {
    runPromise: () => Promise<RunResult>;
}
declare class NodeLoader extends LoaderClass {
    temporaryDirectory: string;
    cacheDirectory: string;
    filePrefix: string;
    defaultDirectory: string;
    validDirectories: string[];
    constructor(temporaryDirectory: string, cacheDirectory: string, filePrefix: string, defaultDirectory: string, validDirectories: string[]);
    protected browsing: boolean;
    protected cachePromise(url: string, graphFile: GraphFile, cache: LoaderCache): Promise<Loaded>;
    graphType: GraphType;
    private graphFileTypeBasename;
    infoPath(key: string): string;
    key(graphFile: GraphFile): string;
    protected loadGraphFilePromise(graphFile: GraphFile): Promise<any>;
    private remoteLocalFile;
    private remotePromise;
    private typeExtension;
    private updateableDefinitions;
    private updateSources;
    private writePromise;
}
type RenderingProcessConcatFileDuration = [
    string,
    number
];
declare class RenderingProcessClass implements RenderingProcess {
    args: RenderingProcessArgs;
    constructor(args: RenderingProcessArgs);
    private combinedRenderingDescriptionPromise;
    commandDescriptionMerged(flatDescription: RenderingDescription): CommandDescription | undefined;
    commandDescriptionsMerged(descriptions: CommandDescriptions): CommandDescription;
    concatFile(fileDurations: RenderingProcessConcatFileDuration[]): string;
    private createDirectoryPromise;
    private createFilePromise;
    private directoryPromise;
    private fileName;
    private _id?;
    get id(): string;
    private _mashInstance?;
    get mashInstance(): Mash;
    private outputInstance;
    private _outputsPopulated?;
    private get outputsPopulated();
    private _preloader?;
    get preloader(): NodeLoader;
    get preloaderInitialize(): NodeLoader;
    private renderResultPromise;
    rendered(destinationPath: string, duration?: number, tolerance?: number): boolean;
    runPromise(): Promise<RunResult>;
}
declare const renderingProcessInstance: (options: RenderingProcessArgs) => RenderingProcessClass;
declare class RenderingServerClass extends ServerClass implements RenderingServer {
    args: RenderingServerArgs;
    constructor(args: RenderingServerArgs);
    private dataPutCallback;
    private definitionFilePath;
    private definitionTypeCommandOutputs;
    private directoryPromise;
    fileServer?: FileServer;
    id: string;
    private outputDirectory;
    private populateDefinition;
    private get previewSize();
    private get outputSize();
    private get iconSize();
    private _renderingCommandOutputs?;
    private get renderingCommandOutputs();
    start: ServerHandler<RenderingStartResponse, RenderingStartRequest>;
    private startCallback;
    status: ServerHandler<RenderingStatusResponse, RenderingStatusRequest>;
    private statusCallback;
    startServer(app: Express.Application, activeServers: HostServers): void;
    upload: ServerHandler<RenderingUploadResponse, RenderingUploadRequest>;
}
declare class StreamingServerClass extends ServerClass implements StreamingServer {
    args: StreamingServerArgs;
    constructor(args: StreamingServerArgs);
    cut: ServerHandler<StreamingCutResponse, StreamingCutRequest>;
    delete: ServerHandler<StreamingDeleteResponse, StreamingDeleteRequest>;
    fileServer?: FileServer;
    local: ServerHandler<StreamingLocalResponse | WithError, StreamingLocalRequest>;
    remote: ServerHandler<StreamingRemoteResponse | WithError, StreamingRemoteRequest>;
    id: string;
    preload: ServerHandler<StreamingPreloadResponse, StreamingPreloadRequest>;
    // TODO: support other output besides HLS file
    start: ServerHandler<StreamingStartResponse, StreamingStartRequest>;
    startMediaServer(): void;
    startServer(app: Express.Application, activeServers: HostServers): void;
    status: ServerHandler<StreamingStatusResponse, StreamingStatusRequest>;
    stopServer(): void;
    streamReady(id: string, streamingFormat: StreamingFormat): boolean;
    streamUrl(id: string, streamingFormat: StreamingFormat): string | undefined;
    webrtc: ServerHandler<WebrtcConnection | WithError, StreamingWebrtcRequest>;
}
interface StreamConnectionCommand {
    command: RunningCommand;
    destination: string;
}
interface StreamingProcessArgs {
    id: string;
    directory: string;
    file: string;
    commandOutput: StreamingCommandOutput;
    cacheDirectory: string;
    temporaryDirectory: string;
    filePrefix: string;
    defaultDirectory: string;
    validDirectories: string[];
}
interface StreamingProcessCutArgs {
    mashObjects: MashObject[];
    definitionObjects: DefinitionObjects;
}
// const StreamingProcessClearPng = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIAAAUAAeImBZsAAAAASUVORK5CYII="
declare class StreamingProcessClass extends EventEmitter {
    constructor(args: StreamingProcessArgs);
    args: StreamingProcessArgs;
    close(): void;
    command?: RunningCommand;
    cut(args: StreamingProcessCutArgs): WithError;
    defaultContent(): StreamingProcessCutArgs;
    get destination(): string;
    error(error: any): void;
    id: string;
    private get currentOptions();
    private get latestTsNumber();
    get pathPrefix(): string;
    state: string;
    toJSON(): UnknownObject;
}
declare const streamingProcessDeleteAll: () => void;
declare const streamingProcessCreate: (args: StreamingProcessArgs) => StreamingProcessClass;
declare const streamingProcessDelete: (connection: StreamingProcessClass) => void;
declare const streamingProcessGet: (id: string) => StreamingProcessClass | null;
declare const StreamingProcessFactory: {
    deleteAll: () => void;
    delete: (connection: StreamingProcessClass) => void;
    get: (id: string) => StreamingProcessClass | null;
    create: (args: StreamingProcessArgs) => StreamingProcessClass;
};
declare class WebServerClass extends ServerClass implements WebServer {
    args: WebServerArgs;
    constructor(args: WebServerArgs);
    startServer(app: Express.Application, activeServers: HostServers): void;
}
declare const BasenameCache = "cached";
declare const BasenameRendering = "rendering";
declare const BasenameDefinition = "definition";
declare const ExtensionLoadedInfo = "info.txt";
declare const ExtensionCommands = "commands.txt";
interface SocketCallback {
    (_: Socket): void;
}
declare class StreamUnix {
    constructor(stream: Stream, id: string, onSocket: SocketCallback, type?: string);
    id: string;
    get socketDir(): string;
    get socketPath(): string;
    type: string;
    get url(): string;
}
declare const StreamInput: (stream: Stream, id: string, type?: string) => StreamUnix;
declare const StreamOutput: (stream: Writable, id: string, type?: string) => StreamUnix;
declare const commandExpandComplex: (trimmed: string) => string;
declare const commandQuoteComplex: (trimmed: string) => string;
// export const command
declare const commandErrors: (...args: any[]) => string[];
declare const commandArgsString: (args: string[], destination: string, ...errors: any[]) => string;
declare const directoryLatest: (directory: string, extension: string) => string | undefined;
declare const Directory: {
    latest: (directory: string, extension: string) => string | undefined;
};
declare const expandCommand: (command: string) => string;
declare const expandFileOrScript: (command?: string | undefined) => string;
declare const expandFile: (file?: string | undefined) => string;
declare const expandPath: (string: string) => string;
declare const expandToJson: (config: string) => JsonObject;
declare const idUnique: () => string;
declare const renderingInput: (definition: DefinitionObject, clipObject?: ValueObject) => RenderingInput;
declare const renderingCommandOutputs: (commandOutputs: CommandOutputs) => CommandOutputs;
declare const renderingOutputFile: (index: number, commandOutput: RenderingCommandOutput, extension?: string | undefined) => string;
declare const renderingSource: (commandOutput?: RenderingCommandOutput | undefined) => string;
declare const renderingInputFromRaw: (loadType: LoadType, source: string, clip?: ValueObject) => RenderingInput;
declare const renderingClipFromDefinition: (definition: DefinitionObject, overrides?: ValueObject) => ClipObject;
declare const renderingDefinitionObject: (loadType: LoadType, source: string, definitionId?: string | undefined, label?: string | undefined) => DefinitionObject;
declare const definitionTypeFromRaw: (loadType: LoadType) => DefinitionType;
export { ConnectionJson, Authenticator, CommandProbeFunction, Command, commandProcess, commandInstance, commandPath, Probe, HostOptionsDefault, HostDefaultPort, HostDefaultOptions, HostOptions, HostServers, Host, CommandDestination, CommandResult, RunningCommand, RunningCommandClass, runningCommandGet, runningCommandDelete, runningCommandInstance, ApiServerArgs, ApiServer, ApiServerClass, DataServerArgs, DataServer, DataServerCastRelationUpdate, DataServerCastRelationSelect, DataServerRow, DataServerClass, FileServerFilename, FileServerArgs, FileServer, FileServerClass, RenderingProcessInput, RenderingCallback, RunResult, RenderingProcessOptions, RenderingArgs, RenderingProcessArgs, RenderingProcess, RenderingProcessConcatFileDuration, RenderingProcessClass, renderingProcessInstance, RenderingCommandOutputs, RenderingServerArgs, RenderingServer, RenderingServerClass, FormatOptions, StreamingFormatOptions, StreamingServerArgs, StreamingServer, StreamingServerClass, StreamConnectionCommand, StreamingProcessArgs, StreamingProcessCutArgs, StreamingProcessClass, streamingProcessDeleteAll, streamingProcessCreate, streamingProcessDelete, streamingProcessGet, StreamingProcessFactory, WebrtcStream, AudioData, FrameData, WebrtcConnection, ServerAuthentication, ServerArgs, Server, ServerHandler, ServerClass, WebServerArgs, WebServer, WebServerClass, BasenameCache, BasenameRendering, BasenameDefinition, ExtensionLoadedInfo, ExtensionCommands, SocketCallback, StreamUnix, StreamInput, StreamOutput, commandExpandComplex, commandQuoteComplex, commandErrors, commandArgsString, directoryLatest, Directory, expandCommand, expandFileOrScript, expandFile, expandPath, expandToJson, idUnique, NodeLoader, renderingInput, renderingCommandOutputs, renderingOutputFile, renderingSource, renderingInputFromRaw, renderingClipFromDefinition, renderingDefinitionObject, definitionTypeFromRaw };
//# sourceMappingURL=server-express.d.ts.map