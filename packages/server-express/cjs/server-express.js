'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var Express = require('express');
var ffmpeg = require('fluent-ffmpeg');
var moviemasher_js = require('@moviemasher/moviemasher.js');
var path = require('path');
var fs = require('fs');
var child_process = require('child_process');
var cors = require('cors');
var basicAuth = require('express-basic-auth');
var sqlite = require('sqlite');
var sqlite3 = require('sqlite3');
var uuidV4 = require('@bitjourney/uuid-v4');
var multer = require('multer');
var EventEmitter = require('events');
var http = require('http');
var https = require('https');
var md5 = require('md5');
var stream = require('stream');
var net = require('net');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var Express__default = /*#__PURE__*/_interopDefaultLegacy(Express);
var ffmpeg__default = /*#__PURE__*/_interopDefaultLegacy(ffmpeg);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path);
var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs);
var cors__default = /*#__PURE__*/_interopDefaultLegacy(cors);
var basicAuth__default = /*#__PURE__*/_interopDefaultLegacy(basicAuth);
var sqlite3__default = /*#__PURE__*/_interopDefaultLegacy(sqlite3);
var multer__default = /*#__PURE__*/_interopDefaultLegacy(multer);
var EventEmitter__default = /*#__PURE__*/_interopDefaultLegacy(EventEmitter);
var http__default = /*#__PURE__*/_interopDefaultLegacy(http);
var https__default = /*#__PURE__*/_interopDefaultLegacy(https);
var md5__default = /*#__PURE__*/_interopDefaultLegacy(md5);
var net__default = /*#__PURE__*/_interopDefaultLegacy(net);

const Authenticator = (req, res, next) => {
    if (!req.httpVersion) {
        console.warn("Authenticator blocked");
        Express.response.statusCode = 401;
        res.end('');
    }
    else
        next();
};

const commandCombinedOptions = (args) => Object.entries(args).map(([key, value]) => {
    const keyString = `-${key}`;
    const valueString = String(value);
    if (valueString.length)
        return `${keyString} ${valueString}`;
    return keyString;
});
const commandComplexFilter = (args) => {
    return args.map(commandFilter => {
        const { options, ffmpegFilter, ...rest } = commandFilter;
        const newOptions = Object.entries(options).map(([key, value]) => {
            if (moviemasher_js.isNumber(value))
                return `${key}=${value}`;
            if (!value.length)
                return key.replaceAll(',', '\\,');
            const commasEscaped = value.replaceAll(',', '\\,');
            const colonsEscaped = commasEscaped.replaceAll(':', '\\\\:');
            return `${key}=${colonsEscaped}`;
        }).join(':');
        return { ...rest, options: newOptions, filter: ffmpegFilter };
    });
};
const commandProcess = () => {
    const logger = {
        warn: console.warn,
        error: console.error,
        debug: console.debug,
        info: console.info,
    };
    const ffmpegOptions = { logger };
    const instance = ffmpeg__default["default"](ffmpegOptions);
    return instance;
};
const commandInstance = (args) => {
    const instance = commandProcess();
    const { inputs, output, commandFilters, avType } = args;
    if (avType === moviemasher_js.AVType.Video)
        instance.noAudio();
    else if (avType === moviemasher_js.AVType.Audio)
        instance.noVideo();
    inputs?.forEach(({ source, options }) => {
        // console.log("commandInstance adding", source)
        instance.addInput(source);
        // instance.addInputOption('-re')
        if (options)
            instance.addInputOptions(commandCombinedOptions(options));
    });
    // console.log("commandInstance GRAPHFILTERS", commandFilters)
    if (commandFilters?.length) {
        instance.complexFilter(commandComplexFilter(commandFilters));
        const last = commandFilters[commandFilters.length - 1];
        last.outputs.forEach(output => {
            instance.map(`[${output}]`);
        });
        // instance.addOption('-filter_complex_threads 1')
    }
    if (avType !== moviemasher_js.AVType.Video) {
        if (moviemasher_js.isPopulatedString(output.audioCodec))
            instance.audioCodec(output.audioCodec);
        if (moviemasher_js.isValue(output.audioBitrate))
            instance.audioBitrate(output.audioBitrate);
        if (moviemasher_js.isAboveZero(output.audioChannels))
            instance.audioChannels(output.audioChannels);
        if (moviemasher_js.isAboveZero(output.audioRate))
            instance.audioFrequency(output.audioRate);
    }
    if (avType !== moviemasher_js.AVType.Audio) {
        if (moviemasher_js.isPopulatedString(output.videoCodec))
            instance.videoCodec(output.videoCodec);
        if (moviemasher_js.isAboveZero(output.videoRate))
            instance.fpsOutput(output.videoRate);
    }
    // if (isPopulatedString(output.format) && output.format !== OutputFormat.Png) instance.format(output.format)
    const options = output.options || {};
    const instanceOptions = moviemasher_js.isPopulatedObject(options) ? options : {};
    instanceOptions.hide_banner = '';
    instanceOptions.shortest = '';
    // instance.addOutputOption('-shortest')
    instance.addOptions(commandCombinedOptions(instanceOptions));
    return instance;
};
const commandPath = (path = 'ffmpeg') => { ffmpeg__default["default"].setFfmpegPath(path); };

const commandErrorRegex = [
    /Input frame sizes do not match \([0-9]*x[0-9]* vs [0-9]*x[0-9]*\)/,
    /Option '[0-9a-z_-]*' not found/,
    'Error:',
    'Cannot find a matching stream',
    'Unable to parse option value',
    'Invalid too big or non positive size',
];
const commandNL = "\n";
const commandExpandComplex = (trimmed) => {
    if (!trimmed.includes(';'))
        return trimmed;
    const lines = trimmed.split(';');
    const broken = lines.map(line => {
        const [firstChar, secondChar] = line;
        if (firstChar !== '[' || moviemasher_js.isNumeric(secondChar))
            return `${commandNL}${line}`;
        return line;
    });
    return broken.join(`;${commandNL}`);
};
const commandQuoteComplex = (trimmed) => {
    if (!trimmed.includes(';'))
        return trimmed;
    return `'${trimmed}'`;
};
// export const command
const commandErrors = (...args) => {
    return args.flatMap(arg => {
        const stringArg = String(arg);
        const lines = stringArg.split(commandNL).map(line => line.trim());
        return lines.filter(line => commandErrorRegex.some(regex => line.match(regex)));
    });
};
const commandArgsString = (args, destination, ...errors) => {
    let name = '';
    const isError = !!errors.length;
    const params = [];
    const rootPath = `${path__default["default"].resolve('./')}/`;
    args.forEach(arg => {
        if (!moviemasher_js.isPopulatedString(arg))
            return;
        const trimmed = arg.trim();
        const firstArgChar = trimmed.slice(0, 1);
        const isName = firstArgChar === '-';
        if (isName) {
            if (name)
                params.push([name, '']);
            name = trimmed.slice(1);
        }
        else {
            if (name)
                params.push([name, trimmed.replaceAll(rootPath, '')]);
            name = '';
        }
    });
    const displayParams = [];
    if (isError && destination) {
        displayParams.push(`${destination} failed`);
        displayParams.push(...commandErrors(...errors));
    }
    displayParams.push('ffmpeg');
    displayParams.push(...params.map(([name, value]) => (value ? `-${name} ${commandExpandComplex(value)}${commandNL}` : `-${name}${commandNL}`)));
    if (destination)
        displayParams.push(destination);
    if (!isError)
        params.unshift(['y', '']);
    const commandParams = params.map(([name, value]) => (value ? `-${name} ${commandQuoteComplex(value)}` : `-${name}`));
    commandParams.unshift('ffmpeg');
    if (destination)
        commandParams.push(destination);
    const blocks = [displayParams.join(commandNL)];
    blocks.push(...errors);
    blocks.push(commandParams.join(' '));
    return blocks.join(`${commandNL}${commandNL}`);
};

const expandCommand = (command) => {
    return child_process.execSync(command).toString().trim();
};
const expandFileOrScript = (command) => {
    if (!command)
        return '';
    if (command.endsWith(moviemasher_js.ExtText))
        return expandFile(command);
    if (command.startsWith('/'))
        return expandCommand(command);
    return command;
};
const expandFile = (file) => {
    return file ? fs__default["default"].readFileSync(file).toString() : '';
};
const expandPath = (string) => {
    return string.startsWith('.') ? path__default["default"].resolve(string) : string;
};
const expandToJson = (config) => {
    if (!config) {
        return {};
    }
    if (config.endsWith(moviemasher_js.ExtJson)) { // json file
        return expandToJson(expandFile(config));
    }
    switch (config[0]) {
        case '.':
        case '/': { // path to script, since it doesn't end in .json
            return expandToJson(expandFileOrScript(config));
        }
        case '{': { // json string
            return JSON.parse(config);
        }
    }
    // failed to expand to JSON
    return {};
};

class Probe {
    static AlphaFormatsCommand = "ffprobe -v 0 -of compact=p=0 -show_entries pixel_format=name:flags=alpha | grep 'alpha=1' | sed 's/.*=\\(.*\\)|.*/\\1/' ";
    static _alphaFormats;
    static get alphaFormats() {
        return this._alphaFormats ||= this.alphaFormatsInitialize;
    }
    static get alphaFormatsInitialize() {
        const result = expandCommand(this.AlphaFormatsCommand);
        return result.split("\n");
    }
    static probeFile(src) {
        const match = src.match(/%0([0-9]*)d/);
        if (!match)
            return src;
        const parentDir = path__default["default"].dirname(src);
        const ext = path__default["default"].extname(src);
        const [_, digit] = match;
        const zeros = '0'.repeat(Number(digit) - 1);
        return path__default["default"].join(parentDir, `${zeros}1${ext}`);
    }
    static promise(temporaryDirectory, file, destination) {
        const src = this.probeFile(file);
        const relative = path__default["default"].relative('./', file);
        const parentDir = path__default["default"].dirname(src);
        if (!fs__default["default"].existsSync(src))
            return Promise.reject(`${relative} does not exist`);
        if (!fs__default["default"].statSync(src).size)
            return Promise.reject(`${relative} is empty`);
        const dest = destination || path__default["default"].join(parentDir, `${path__default["default"].basename(src)}.json`);
        if (fs__default["default"].existsSync(dest)) {
            return fs__default["default"].promises.readFile(dest).then(buffer => JSON.parse(buffer.toString()));
        }
        const process = commandProcess();
        process.addInput(src);
        return new Promise((resolve, reject) => {
            fs__default["default"].promises.mkdir(path__default["default"].dirname(dest), { recursive: true }).then(() => {
                process.ffprobe((error, data) => {
                    const info = {
                        audible: false, ...moviemasher_js.SizeZero, info: data,
                        extension: path__default["default"].extname(src).slice(1)
                    };
                    if (error) {
                        info.error = commandArgsString(process._getArguments(), dest, error);
                    }
                    else {
                        const { streams, format } = data;
                        const { duration = 0 } = format;
                        const durations = [];
                        const rotations = [];
                        const sizes = [];
                        for (const stream of streams) {
                            const { rotation, width, height, duration, codec_type, pix_fmt } = stream;
                            if (moviemasher_js.isPopulatedString(pix_fmt))
                                info.alpha = this.alphaFormats.includes(pix_fmt);
                            if (moviemasher_js.isNumeric(rotation))
                                rotations.push(Math.abs(Number(rotation)));
                            if (codec_type === 'audio')
                                info.audible = true;
                            if (moviemasher_js.isPositive(duration))
                                durations.push(Number(duration));
                            if (width && height)
                                sizes.push({ width, height });
                        }
                        if (duration || durations.length) {
                            if (durations.length) {
                                const maxDuration = Math.max(...durations);
                                info.duration = duration ? Math.max(maxDuration, duration) : maxDuration;
                            }
                            else
                                info.duration = duration;
                        }
                        if (sizes.length) {
                            const flipped = rotations.some(n => n === 90 || n === 270);
                            const widthKey = flipped ? 'height' : 'width';
                            const heightKey = flipped ? 'width' : 'height';
                            info[widthKey] = Math.max(...sizes.map(size => size.width));
                            info[heightKey] = Math.max(...sizes.map(size => size.height));
                        }
                    }
                    fs__default["default"].promises.writeFile(dest, JSON.stringify(info)).then(() => { resolve(info); });
                });
            });
        });
    }
}
// const data = {
//         streams: [
//           {
//             index: 0,
//             codec_name: 'h264',
//             codec_long_name: 'H.264 / AVC / MPEG-4 AVC / MPEG-4 part 10',
//             profile: 'High',
//             codec_type: 'video',
//             codec_time_base: '1/60',
//             codec_tag_string: 'avc1',
//             codec_tag: '0x31637661',
//             width: 512,
//             height: 288,
//             coded_width: 512,
//             coded_height: 288,
//             closed_captions: 0,
//             has_b_frames: 2,
//             sample_aspect_ratio: '1:1',
//             display_aspect_ratio: '16:9',
//             pix_fmt: 'yuv420p',
//             level: 41,
//             color_range: 'unknown',
//             color_space: 'unknown',
//             color_transfer: 'unknown',
//             color_primaries: 'unknown',
//             chroma_location: 'left',
//             field_order: 'unknown',
//             timecode: 'N/A',
//             refs: 1,
//             is_avc: 'true',
//             nal_length_size: 4,
//             id: 'N/A',
//             r_frame_rate: '30/1',
//             avg_frame_rate: '30/1',
//             time_base: '1/15360',
//             start_pts: 0,
//             start_time: 0,
//             duration_ts: 46080,
//             duration: 3,
//             bit_rate: 16605,
//             max_bit_rate: 'N/A',
//             bits_per_raw_sample: 8,
//             nb_frames: 90,
//             nb_read_frames: 'N/A',
//             nb_read_packets: 'N/A',
//             tags: [Object],
//             disposition: [Object]
//           },
//           {
//             index: 1,
//             codec_name: 'aac',
//             codec_long_name: 'AAC (Advanced Audio Coding)',
//             profile: 'LC',
//             codec_type: 'audio',
//             codec_time_base: '1/44100',
//             codec_tag_string: 'mp4a',
//             codec_tag: '0x6134706d',
//             sample_fmt: 'fltp',
//             sample_rate: 44100,
//             channels: 2,
//             channel_layout: 'stereo',
//             bits_per_sample: 0,
//             id: 'N/A',
//             r_frame_rate: '0/0',
//             avg_frame_rate: '0/0',
//             time_base: '1/44100',
//             start_pts: 0,
//             start_time: 0,
//             duration_ts: 132300,
//             duration: 3,
//             bit_rate: 13432,
//             max_bit_rate: 224000,
//             bits_per_raw_sample: 'N/A',
//             nb_frames: 131,
//             nb_read_frames: 'N/A',
//             nb_read_packets: 'N/A',
//             tags: [Object],
//             disposition: [Object]
//           }
//         ],
//         format: {
//           filename: '/Users/doug/GitHub/moviemasher.js/dev/shared/video/rgb.mp4',
//           nb_streams: 2,
//           nb_programs: 0,
//           format_name: 'mov,mp4,m4a,3gp,3g2,mj2',
//           format_long_name: 'QuickTime / MOV',
//           start_time: 0,
//           duration: 3.024,
//           size: 15970,
//           bit_rate: 42248,
//           probe_score: 100,
//           tags: {
//             major_brand: 'isom',
//             minor_version: '512',
//             compatible_brands: 'isomiso2avc1mp41',
//             title: 'test',
//             encoder: 'Lavf58.29.100'
//           }
//         },
//         chapters: []
// }

const OpenAuthentication = { type: 'basic' };
const HostDefaultPort = 8570;
const HostDefaultOptions = (args = {}) => {
    const { previewSize, outputSize, outputRate, port, auth, webServerHome, temporaryDirectory, fileUploadDirectory, dataMigrationsDirectory, dataBaseFile, renderingCacheDirectory, host, version, renderingCommandOutputs, } = args;
    const definedHost = host || '0.0.0.0';
    const commandOutput = {};
    const basePort = port || HostDefaultPort;
    if (outputSize) {
        const { width, height } = outputSize;
        commandOutput.width = width;
        commandOutput.height = height;
    }
    if (outputRate)
        commandOutput.videoRate = outputRate;
    const temporary = temporaryDirectory || './temporary';
    const cacheDirectory = renderingCacheDirectory || `${temporary}/cache`;
    const migrations = dataMigrationsDirectory || "./workspaces/example-express-react/host/data-migrations";
    const home = webServerHome || "./workspaces/example-express-react/host/public/index.html";
    const homeDirectory = path__default["default"].dirname(home);
    const baseFile = dataBaseFile || `${path__default["default"].dirname(migrations)}/sqlite.db`;
    const upload = fileUploadDirectory || `${homeDirectory}/media`;
    const commandOutputs = renderingCommandOutputs || {};
    if (!upload.startsWith(homeDirectory))
        throw 'fileUploadDirectory must be under webServerHome';
    const uploadsRelative = path__default["default"].relative(homeDirectory, upload);
    const authentication = auth || OpenAuthentication;
    if (authentication.type === 'basic') {
        // support grabbing shared password from command or text file
        authentication.password = expandFileOrScript(authentication.password);
    }
    const api = {
        authentication
    };
    const data = {
        temporaryIdPrefix: 'temporary-',
        dbPath: baseFile,
        dbMigrationsPrefix: migrations,
        authentication
    };
    const file = {
        uploadLimits: {
            video: 100,
            audio: 50,
            image: 5,
        },
        uploadsPrefix: upload,
        uploadsRelative,
        extensions: {
            [moviemasher_js.LoadType.Audio]: [
                'aiff',
                'mp3',
            ],
            [moviemasher_js.LoadType.Image]: [
                'jpeg',
                'jpg',
                'png',
                'svg',
            ],
            [moviemasher_js.LoadType.Video]: [
                'mov',
                'mp4',
                'mpeg',
                'mpg',
            ],
        },
        authentication
    };
    const rendering = {
        temporaryDirectory: temporary,
        cacheDirectory, authentication, commandOutputs, previewSize, outputSize
    };
    const streamingFormatOptions = {
        [moviemasher_js.StreamingFormat.Hls]: {
            commandOutput: moviemasher_js.outputDefaultHls(commandOutput),
            segmentFile: `000000.${moviemasher_js.ExtTs}`,
            url: '/hls',
            directory: `${temporary}/streams`,
            file: `index.${moviemasher_js.ExtHls}`,
        },
        [moviemasher_js.StreamingFormat.Rtmp]: {
            commandOutput: moviemasher_js.outputDefaultRtmp(commandOutput),
            segmentFile: '',
            file: `index.${moviemasher_js.ExtRtmp}`,
            url: '/rtmp',
            directory: `${temporary}/streams/rtmp`,
        },
        [moviemasher_js.StreamingFormat.Mdash]: {
            commandOutput: moviemasher_js.outputDefaultDash(commandOutput),
            segmentFile: '',
            file: `index.${moviemasher_js.ExtDash}`,
            url: '/rtmp',
            directory: `${temporary}/streams/mdash`,
        },
    };
    const streaming = {
        streamingFormatOptions,
        commandOutput: moviemasher_js.outputDefaultHls(commandOutput),
        appName: moviemasher_js.StreamingFormat.Rtmp,
        cacheDirectory: `${temporary}/cache`,
        temporaryDirectory: temporary,
        webrtcStreamingDir: `${temporary}/streams/webrtc`,
        rtmpOptions: {
            port: 1935,
            chunk_size: 60000,
            gop_cache: true,
            ping: 30,
            ping_timeout: 60
        },
        httpOptions: {
            port: basePort + 1,
            mediaroot: `${temporary}/streams`,
            allow_origin: "*"
        },
        authentication
    };
    const web = {
        sources: { '/': home },
        authentication
    };
    const options = {
        port: basePort, host: definedHost, version,
        corsOptions: { origin: "*" },
        api, data, file, rendering, streaming, web
    };
    return options;
};

class ServerClass {
    args;
    constructor(args) {
        this.args = args;
    }
    id = '';
    init(userId) { return {}; }
    startServer(app, _activeServers) {
        // console.log(this.constructor.name, "startServer")
        const { authentication } = this.args;
        if (authentication?.type === 'basic') {
            const { password, users } = authentication;
            const authorizer = (username, suppliedPassword) => {
                if (!(username && suppliedPassword))
                    return false;
                if (!password)
                    return true;
                return basicAuth__default["default"].safeCompare(suppliedPassword, password);
            };
            const options = {
                users, authorizer, challenge: true, realm: 'moviemasher',
            };
            app.use(`/${this.id}/*`, basicAuth__default["default"](options), (_req, _res, next) => { next(); });
        }
    }
    stopServer() { }
    userFromRequest(req) {
        const request = req;
        const { user } = request.auth;
        return user;
    }
}

class ApiServerClass extends ServerClass {
    args;
    constructor(args) {
        super(args);
        this.args = args;
    }
    id = 'api';
    init() { return {}; }
    activeServers = {};
    callbacks = (req, res) => {
        const request = req.body;
        const { id } = request;
        const apiCallbacks = {};
        const keys = Object.keys(this.activeServers);
        const [_, serverId] = id.split('/');
        if (keys.includes(serverId))
            apiCallbacks[id] = { endpoint: { prefix: id } };
        const response = { apiCallbacks };
        res.send(response);
    };
    servers = (req, res) => {
        const response = {};
        try {
            const user = this.userFromRequest(req);
            Object.entries(this.activeServers).forEach(([serverType, server]) => {
                response[serverType] = server.init(user);
            });
        }
        catch (error) {
            response.error = String(error);
        }
        res.send(response);
    };
    startServer(app, activeServers) {
        super.startServer(app, activeServers);
        this.activeServers = activeServers;
        app.post(moviemasher_js.Endpoints.api.callbacks, this.callbacks);
        app.post(moviemasher_js.Endpoints.api.servers, this.servers);
    }
}

const idUnique = () => {
    return uuidV4.generateUUIDv4();
};

const DataServerColumns = ['id', 'label', 'icon'];
const DataServerColumnsDefault = ['*'];
const DataServerNow = () => (new Date()).toISOString();
const DataServerSelect = (quotedTable, columns = DataServerColumnsDefault) => {
    return `SELECT ${columns.join(', ')} FROM ${quotedTable} WHERE id = ?`;
};
const DataServerJsonAnonymous = (row) => {
    if (!row)
        return {};
    const { json, userId, ...rest } = row;
    return json ? { ...JSON.parse(json), ...rest } : rest;
};
const DataServerJson = (row) => {
    if (!row)
        return {};
    const { json, ...rest } = row;
    if (!json)
        return rest;
    const parsed = JSON.parse(json);
    return DataServerJson({ ...parsed, ...rest });
};
const DataServerJsons = (rows) => { return rows.map(DataServerJsonAnonymous); };
const DataServerInsert = (quotedTable, columns) => {
    return `
    INSERT INTO ${quotedTable}
    (${columns.join(', ')})
    VALUES(${Array(columns.length).fill('?').join(', ')})
  `;
};
const DataServerUpdate = (quotedTable, columns) => {
    return `
    UPDATE ${quotedTable}
    SET ${columns.map((column => `${column} = ?`)).join(', ')}
    WHERE id = ?
  `;
};
const DataServerInsertRecord = (userId, data) => {
    const { userId: _, type, createdAt, icon, label, id, ...rest } = data;
    const json = JSON.stringify(rest);
    const record = { json, userId };
    if (id)
        record.id = String(id);
    if (createdAt)
        record.createdAt = String(createdAt);
    if (icon)
        record.icon = String(icon);
    if (label)
        record.label = String(label);
    // for definitions
    if (type)
        record.type = String(type);
    return record;
};
const DataServerPopulateLayers = (mashes, layers) => {
    layers?.forEach(layer => {
        if (moviemasher_js.isLayerFolderObject(layer))
            DataServerPopulateLayers(mashes, layer.layers);
        else if (moviemasher_js.isLayerMashObject(layer)) {
            const { mash } = layer;
            const { id } = mash;
            const found = mashes.find(mash => mash.id === id);
            if (!found)
                throw new Error(moviemasher_js.Errors.internal + 'no mash with id ' + id + ' in ' + mashes.map(m => m.id).join(', '));
            layer.mash = found;
        }
    });
};
class DataServerClass extends ServerClass {
    args;
    constructor(args) {
        super(args);
        this.args = args;
    }
    castInsertPromise(userId, cast, definitionIds) {
        const lookup = {};
        const { id } = cast;
        const temporaryId = id || idUnique();
        const permanentId = temporaryId.startsWith(this.args.temporaryIdPrefix) ? idUnique() : temporaryId;
        if (permanentId !== temporaryId)
            lookup[temporaryId] = permanentId;
        cast.id = permanentId;
        const updatePromise = this.castUpdateRelationsPromise(userId, cast, definitionIds);
        const insertPromise = updatePromise.then(castData => {
            const { cast, temporaryIdLookup } = castData;
            return this.createPromise('`cast`', DataServerInsertRecord(userId, cast)).then(() => {
                return { ...temporaryIdLookup, ...lookup };
            });
        });
        return insertPromise.then(lookup => ({ ...lookup, ...lookup }));
    }
    castUpdatePromise(userId, cast, definitionIds) {
        const { id } = cast;
        if (!id)
            return Promise.reject(401);
        const relationsPromise = this.castUpdateRelationsPromise(userId, cast, definitionIds);
        const updatePromise = relationsPromise.then(castData => {
            const { cast, temporaryIdLookup } = castData;
            return this.updatePromise('`cast`', cast).then(() => temporaryIdLookup);
        });
        return updatePromise;
    }
    createPromise(quotedTable, data) {
        data.createdAt ||= DataServerNow();
        const id = data.id || idUnique();
        moviemasher_js.assertPopulatedString(id);
        const permanentId = id.startsWith(this.args.temporaryIdPrefix) ? idUnique() : id;
        data.id = permanentId;
        const keys = [];
        const values = [];
        Object.entries(data).forEach(([key, value]) => {
            keys.push(key);
            values.push(value);
        });
        const sql = DataServerInsert(quotedTable, keys);
        // console.log(sql, ...values)
        return this.db.run(sql, ...values).then(() => permanentId);
    }
    _db;
    get db() {
        if (!this._db)
            throw moviemasher_js.Errors.internal + 'db';
        return this._db;
    }
    defaultCast = async (req, res) => {
        const previewSize = this.renderingServer?.args.previewSize;
        const response = { cast: {}, definitions: [], previewSize };
        try {
            const user = this.userFromRequest(req);
            const cast = await this.getLatestPromise(user, '`cast`');
            if (cast.id) {
                const castDefinitions = await this.selectCastRelationsPromise(cast);
                response.definitions = castDefinitions.definitions;
                response.cast = castDefinitions.cast;
            }
        }
        catch (error) {
            response.error = String(error);
        }
        res.send(response);
    };
    defaultMash = async (req, res) => {
        const previewSize = this.renderingServer?.args.previewSize;
        const response = { mash: {}, definitions: [], previewSize };
        try {
            const user = this.userFromRequest(req);
            const sql = `
        SELECT mash.* FROM mash 
        LEFT JOIN cast_mash 
        ON cast_mash.mashId = mash.id 
        WHERE cast_mash.mashId IS NULL
        AND mash.userId = ? 
        ORDER BY createdAt DESC
        LIMIT 1
      `;
            const mash = await this.db.get(sql, user).then(row => {
                const { userId: rowUserId, ...rest } = DataServerJson(row);
                return rowUserId === user ? rest : {};
            });
            if (mash.id) {
                response.mash = mash;
                response.definitions = await this.selectMashRelationsPromise(String(mash.id));
            }
        }
        catch (error) {
            response.error = String(error);
        }
        // console.log("defaultMash", response)
        res.send(response);
    };
    deleteCast = async (req, res) => {
        const { id } = req.body;
        const response = {};
        try {
            const user = this.userFromRequest(req);
            const existing = await this.rowExists('`cast`', id, user);
            if (existing)
                await this.deletePromise('`cast`', id);
            else
                response.error = `Could not find Cast with id: ${id}`;
        }
        catch (error) {
            response.error = String(error);
        }
        res.send(response);
    };
    deleteDefinition = async (req, res) => {
        const { id } = req.body;
        const response = {};
        try {
            const user = this.userFromRequest(req);
            const existing = await this.rowExists('`mash`', id, user);
            if (existing) {
                const sql = `SELECT * FROM mash_definition WHERE definitionId = ?`;
                const rows = await this.db.all(sql, id);
                if (rows.length) {
                    response.mashIds = rows.map(row => row.mashid);
                    response.error = `Referenced by ${moviemasher_js.stringPluralize(rows.length, 'mash', 'es')}`;
                }
                else
                    await this.deletePromise('`definition`', id);
            }
            else
                response.error = `Could not find Definition with id: ${id}`;
        }
        catch (error) {
            response.error = String(error);
        }
        res.send(response);
    };
    deleteMash = async (req, res) => {
        const { id } = req.body;
        const response = {};
        try {
            const user = this.userFromRequest(req);
            const existing = await this.rowExists('`mash`', id, user);
            if (existing) {
                const sql = `SELECT * FROM cast_mash WHERE mashId = ?`;
                const rows = await this.db.all(sql, id);
                if (rows.length) {
                    response.castIds = rows.map(row => row.castId);
                    response.error = `Referenced by ${moviemasher_js.stringPluralize(rows.length, 'cast')}`;
                }
                else
                    await this.deletePromise('`mash`', id);
            }
            else
                response.error = `Could not find Mash with id: ${id}`;
        }
        catch (error) {
            response.error = String(error);
        }
        res.send(response);
    };
    deletePromise(quotedTable, id) {
        const sql = `DELETE FROM ${quotedTable} WHERE id = ?`;
        return this.db.run(sql, id).then(moviemasher_js.EmptyMethod);
    }
    fileServer;
    getCast = async (req, res) => {
        const { id } = req.body;
        const response = { cast: {}, definitions: [] };
        try {
            const user = this.userFromRequest(req);
            const cast = await this.jsonPromise('`cast`', user, id);
            if (!cast)
                response.error = `Could not find cast ${id}`;
            else {
                const castDefinitions = await this.selectCastRelationsPromise(cast);
                response.definitions = castDefinitions.definitions;
                response.cast = castDefinitions.cast;
            }
        }
        catch (error) {
            response.error = String(error);
        }
        res.send(response);
    };
    getDefinition = async (req, res) => {
        const { id } = req.body;
        const response = { definition: {} };
        try {
            const user = this.userFromRequest(req);
            const definition = await this.jsonPromise('`definition`', user, id);
            if (!definition) {
                response.error = `Could not find definition ${id}`;
            }
            else
                response.definition = definition;
        }
        catch (error) {
            response.error = String(error);
        }
        res.send(response);
    };
    getLatestPromise(userId, quotedTable) {
        const sql = `SELECT * FROM ${quotedTable} WHERE userId = ? ORDER BY createdAt DESC`;
        return this.db.get(sql, userId).then(row => {
            const { userId: rowUserId, ...rest } = DataServerJson(row);
            return rowUserId === userId ? rest : {};
        });
    }
    getMash = async (req, res) => {
        const { id } = req.body;
        const response = { mash: {}, definitions: [] };
        try {
            const user = this.userFromRequest(req);
            const mash = await this.jsonPromise('`mash`', user, id);
            if (mash.id !== id)
                response.error = `Could not find mash ${id}`;
            else {
                response.mash = mash;
                response.definitions = await this.selectMashRelationsPromise(id);
            }
        }
        catch (error) {
            response.error = String(error);
        }
        res.send(response);
    };
    id = 'data';
    init() { return { temporaryIdPrefix: this.args.temporaryIdPrefix }; }
    insertDefinitionPromise(userId, definition) {
        return this.createPromise('`definition`', DataServerInsertRecord(userId, definition));
    }
    jsonPromise(quotedTable, userId, id) {
        if (!id || id.startsWith(this.args.temporaryIdPrefix))
            return Promise.resolve();
        return this.db.get(DataServerSelect(quotedTable), id).then(DataServerJson).then(row => {
            if (!row)
                return;
            const { userId: rowUserId, ...rest } = row;
            if (rowUserId === userId)
                return rest;
        });
    }
    mashInsertPromise(userId, mash, definitionIds) {
        const temporaryLookup = {};
        const { id } = mash;
        const temporaryId = id || idUnique();
        mash.id = temporaryId;
        const insertPromise = this.createPromise('`mash`', DataServerInsertRecord(userId, mash));
        const definitionPromise = insertPromise.then(permanentId => {
            if (permanentId !== temporaryId)
                temporaryLookup[temporaryId] = permanentId;
            return this.mashUpdateRelationsPromise(permanentId, definitionIds);
        });
        return definitionPromise.then(() => temporaryLookup);
    }
    mashUpdatePromise(userId, mash, definitionIds) {
        const { createdAt, icon, id, label, ...rest } = mash;
        if (!id)
            return Promise.reject(401);
        const json = JSON.stringify(rest);
        const data = { userId, createdAt, icon, id, label, json };
        return this.updatePromise('`mash`', data).then(() => this.mashUpdateRelationsPromise(id, definitionIds));
    }
    putCast = async (req, res) => {
        const { cast, definitionIds } = req.body;
        const response = {};
        try {
            const user = this.userFromRequest(req);
            response.temporaryIdLookup = await this.writeCastPromise(user, cast, definitionIds);
        }
        catch (error) {
            response.error = String(error);
        }
        res.send(response);
    };
    putDefinition = async (req, res) => {
        const { definition } = req.body;
        const response = { id: '' };
        try {
            const user = this.userFromRequest(req);
            response.id = await this.writeDefinitionPromise(user, definition);
        }
        catch (error) {
            response.error = String(error);
        }
        res.send(response);
    };
    putMash = async (req, res) => {
        const { mash, definitionIds } = req.body;
        // console.log(this.constructor.name, Endpoints.data.mash.put, JSON.stringify(mash, null, 2))
        const response = {};
        try {
            const user = this.userFromRequest(req);
            response.temporaryIdLookup = await this.writeMashPromise(user, mash, definitionIds);
        }
        catch (error) {
            response.error = String(error);
        }
        res.send(response);
    };
    renderingServer;
    retrieveCast = async (req, res) => {
        const { partial } = req.body;
        const response = { described: [] };
        try {
            const user = this.userFromRequest(req);
            const columns = partial ? DataServerColumns : DataServerColumnsDefault;
            response.described = await this.selectCastsPromise(user, columns);
        }
        catch (error) {
            response.error = String(error);
        }
        res.send(response);
    };
    retrieveDefinition = async (req, res) => {
        const request = req.body;
        const { partial, types } = request;
        const response = { definitions: [] };
        try {
            const user = this.userFromRequest(req);
            // console.log(this.constructor.name, "retrieveDefinition", types, partial)
            const columns = partial ? DataServerColumns : DataServerColumnsDefault;
            response.definitions = await this.selectDefinitionsPromise(user, types, columns);
        }
        catch (error) {
            response.error = String(error);
        }
        res.send(response);
    };
    retrieveMash = async (req, res) => {
        const { partial } = req.body;
        const response = { described: [] };
        try {
            const user = this.userFromRequest(req);
            const columns = partial ? DataServerColumns : DataServerColumnsDefault;
            response.described = await this.selectMashesPromise(user, columns);
        }
        catch (error) {
            response.error = String(error);
        }
        res.send(response);
    };
    rowExists(quotedTable, id, userId) {
        const promise = new Promise((resolve, reject) => {
            this.userIdPromise(quotedTable, id).then(ownerId => {
                if (ownerId && ownerId !== userId)
                    return reject(403);
                return resolve(!!ownerId);
            });
        });
        return promise;
    }
    selectCastsPromise(userId, columns = DataServerColumnsDefault) {
        const table = '`cast`';
        const sql = `SELECT ${columns.join(', ')} FROM ${table} WHERE userId = ?`;
        return this.db.all(sql, userId).then(DataServerJsons);
    }
    selectDefinitionsPromise(userId, types, columns = DataServerColumnsDefault) {
        const table = '`definition`';
        const sql = `
      SELECT ${columns.join(', ')}
      FROM ${table}
      WHERE (${Array(types.length).fill('type = ?').join(' OR ')})
      AND (userId = '' OR userId = ?)
    `;
        // console.log(this.constructor.name, sql, types, userId)
        return this.db.all(sql, ...types, userId).then(DataServerJsons);
    }
    selectCastRelationsPromise(cast) {
        const { id } = cast;
        moviemasher_js.assertPopulatedString(id);
        const sql = `
      SELECT mash.*
      FROM cast_mash
      JOIN mash
      ON mash.id = mashId
      WHERE castId = ?
    `;
        return this.db.all(sql, id).then(DataServerJsons).then((mashes) => {
            DataServerPopulateLayers(mashes, cast.layers);
            const definitions = [];
            const initialData = { cast, definitions };
            let promise = Promise.resolve(initialData);
            mashes.forEach(mash => {
                const { id } = mash;
                moviemasher_js.assertPopulatedString(id);
                promise = promise.then(data => {
                    return this.selectMashRelationsPromise(id).then(definitions => {
                        data.definitions.push(...definitions);
                        return data;
                    });
                });
            });
            return promise;
        });
    }
    selectMashRelationsPromise(id) {
        const sql = `
      SELECT definition.*
      FROM mash_definition
      JOIN definition
      ON definition.id = definitionId
      WHERE mashId = ?
    `;
        return this.db.all(sql, id).then(DataServerJsons);
    }
    selectMashesPromise(userId, columns = DataServerColumnsDefault) {
        const table = '`mash`';
        const qualified = columns.map(column => `${table}.${column}`);
        const sql = `SELECT 
      ${qualified.join(', ')} 
      FROM ${table} 
      LEFT JOIN cast_mash
      ON cast_mash.mashId = ${table}.id
      WHERE cast_mash.mashId IS NULL
      AND userId = ?
    `;
        return this.db.all(sql, userId).then(DataServerJsons);
    }
    startDatabase() {
        const { dbPath, dbMigrationsPrefix } = this.args;
        console.debug(this.constructor.name, "startDatabase", dbPath);
        fs__default["default"].mkdirSync(path__default["default"].dirname(dbPath), { recursive: true });
        sqlite.open({ filename: dbPath, driver: sqlite3__default["default"].Database }).then(db => {
            this._db = db;
            if (dbMigrationsPrefix) {
                console.debug(this.constructor.name, "startDatabase migrating...", dbMigrationsPrefix);
                this.db.migrate({ migrationsPath: dbMigrationsPrefix }).catch(err => console.error(this.constructor.name, "startDatabase migration failed", err));
            }
        });
    }
    startServer(app, activeServers) {
        super.startServer(app, activeServers);
        this.fileServer = activeServers.file;
        this.renderingServer = activeServers.rendering;
        app.post(moviemasher_js.Endpoints.data.cast.default, this.defaultCast);
        app.post(moviemasher_js.Endpoints.data.cast.delete, this.deleteCast);
        app.post(moviemasher_js.Endpoints.data.cast.get, this.getCast);
        app.post(moviemasher_js.Endpoints.data.cast.put, this.putCast);
        app.post(moviemasher_js.Endpoints.data.cast.retrieve, this.retrieveCast);
        app.post(moviemasher_js.Endpoints.data.definition.delete, this.deleteDefinition);
        app.post(moviemasher_js.Endpoints.data.definition.get, this.getDefinition);
        app.post(moviemasher_js.Endpoints.data.definition.retrieve, this.retrieveDefinition);
        app.post(moviemasher_js.Endpoints.data.definition.put, this.putDefinition);
        app.post(moviemasher_js.Endpoints.data.mash.default, this.defaultMash);
        app.post(moviemasher_js.Endpoints.data.mash.delete, this.deleteMash);
        app.post(moviemasher_js.Endpoints.data.mash.get, this.getMash);
        app.post(moviemasher_js.Endpoints.data.mash.put, this.putMash);
        app.post(moviemasher_js.Endpoints.data.mash.retrieve, this.retrieveMash);
        this.startDatabase();
    }
    stopServer() { this._db?.close(); }
    updatePromise(quotedTable, data) {
        const { id, ...rest } = data;
        const keys = [];
        const values = [];
        Object.entries(rest).forEach(([key, value]) => {
            keys.push(key);
            values.push(value);
        });
        const sql = DataServerUpdate(quotedTable, keys);
        // console.log(sql, ...values, id)
        return this.db.run(sql, ...values, id).then(moviemasher_js.EmptyMethod);
    }
    castUpdateRelationsPromise(userId, cast, definitionIds) {
        const temporaryIdLookup = {};
        const { createdAt, icon, id, label, ...rest } = cast;
        moviemasher_js.assertPopulatedString(id);
        const { layers = [] } = cast;
        const layersMashes = (layers) => {
            const { temporaryIdPrefix } = this.args;
            return layers.flatMap(layer => {
                if (moviemasher_js.isLayerMashObject(layer)) {
                    const { mash } = layer;
                    const temporaryId = mash.id;
                    moviemasher_js.assertPopulatedString(temporaryId);
                    const permanentId = temporaryId.startsWith(temporaryIdPrefix) ? idUnique() : temporaryId;
                    if (temporaryId !== permanentId) {
                        temporaryIdLookup[temporaryId] = permanentId;
                        mash.id = permanentId;
                    }
                    layer.mash = { id: permanentId };
                    return [mash];
                }
                else if (moviemasher_js.isLayerFolderObject(layer)) {
                    const { layers } = layer;
                    if (layers)
                        return layersMashes(layers);
                }
                return [];
            });
        };
        const mashes = layersMashes(layers);
        let mashesPromise = Promise.resolve(temporaryIdLookup);
        const permanentIds = mashes.map(mash => mash.id);
        mashes.forEach(mash => {
            const mashId = mash.id;
            const ids = definitionIds ? definitionIds[mashId] : [];
            mashesPromise = mashesPromise.then(lookup => {
                return this.writeMashPromise(userId, mash, ids).then(mashLookup => ({ ...lookup, ...mashLookup }));
            });
        });
        return mashesPromise.then(mashesLookup => {
            return this.updateRelationsPromise('cast', 'mash', id, permanentIds).then(lookup => {
                const json = JSON.stringify(rest);
                const cast = { createdAt, icon, id, label, json };
                const response = {
                    cast, temporaryIdLookup: { ...lookup, ...mashesLookup }
                };
                return response;
            });
        });
    }
    updateDefinitionPromise(definition) {
        const { type, createdAt, icon, id, label, ...rest } = definition;
        if (!id)
            return Promise.reject(401);
        const json = JSON.stringify(rest);
        const data = { createdAt, icon, id, label, json };
        return this.updatePromise('`definition`', data).then(moviemasher_js.EmptyMethod);
    }
    mashUpdateRelationsPromise(mashId, definitionIds) {
        // console.log("updateMashDefinitionsPromise", mashId, definitionIds)
        const relationPromise = this.updateRelationsPromise('mash', 'definition', mashId, definitionIds);
        return relationPromise;
    }
    updateRelationsPromise(from, to, id, ids) {
        const temporaryLookup = {};
        if (!ids)
            return Promise.resolve(temporaryLookup);
        const permanentIds = ids.map(id => {
            if (id.startsWith(this.args.temporaryIdPrefix))
                return temporaryLookup[id] = idUnique();
            return id;
        });
        const quotedTable = `${from}_${to}`;
        const fromId = `${from}Id`;
        const toId = `${to}Id`;
        const sql = `SELECT * FROM ${quotedTable} WHERE ${fromId} = ?`;
        // console.log("updateRelationsPromise", sql, id)
        return this.db.all(sql, id).then(rows => {
            const toDelete = [];
            const toKeep = [];
            rows.forEach((row) => {
                const relatedId = String(row[toId]);
                if (permanentIds.includes(relatedId))
                    toKeep.push(relatedId);
                else
                    toDelete.push(row.id);
            });
            const toCreate = permanentIds.filter(id => !toKeep.includes(id));
            const promises = [
                ...toDelete.map(id => this.deletePromise(quotedTable, id)),
                ...toCreate.map(relatedId => this.createPromise(quotedTable, { [toId]: relatedId, [fromId]: id }).then(moviemasher_js.EmptyMethod)),
            ];
            switch (promises.length) {
                case 0: return Promise.resolve();
                case 1: return promises[0];
                default: return Promise.all(promises).then(moviemasher_js.EmptyMethod);
            }
        }).then(() => temporaryLookup);
    }
    userIdPromise(table, id) {
        return this.db.get(`SELECT userId FROM ${table} WHERE id = ?`, id)
            .then(row => row?.userId || '');
    }
    writeCastPromise(userId, cast, definitionIds) {
        const { id } = cast;
        const promiseJson = this.jsonPromise('`cast`', userId, id);
        return promiseJson.then(row => {
            if (row) {
                Object.assign(row, cast);
                return this.castUpdatePromise(userId, row, definitionIds);
            }
            return this.castInsertPromise(userId, cast, definitionIds);
        });
    }
    writeDefinitionPromise(userId, definition) {
        const { id } = definition;
        if (!id)
            return this.insertDefinitionPromise(userId, definition);
        return this.rowExists('`definition`', id, userId).then(existing => {
            if (!existing)
                return this.insertDefinitionPromise(userId, definition);
            return this.updateDefinitionPromise(definition).then(() => id);
        });
    }
    writeMashPromise(userId, mash, definitionIds) {
        const { id } = mash;
        const promiseJson = this.jsonPromise('`mash`', userId, id);
        return promiseJson.then(row => {
            if (row) {
                Object.assign(row, mash);
                return this.mashUpdatePromise(userId, row, definitionIds);
            }
            return this.mashInsertPromise(userId, mash, definitionIds);
        });
    }
}

const FileServerFilename = 'original';

const FileServerMeg = 1024 * 1024;
class FileServerClass extends ServerClass {
    args;
    constructor(args) {
        super(args);
        this.args = args;
    }
    constructCallback(uploadDescription, userId, id) {
        const request = { id };
        const callback = {
            endpoint: { prefix: moviemasher_js.Endpoints.file.store },
            request: { body: request, headers: { "Content-Type": "multipart/form-data" } }
        };
        return callback;
    }
    get extensions() {
        return Object.values(this.args.extensions).flat();
    }
    extensionLoadType(extension) {
        return moviemasher_js.UploadTypes.find(loadType => this.args.extensions[loadType].includes(extension));
    }
    id = 'file';
    init(userId) {
        const prefix = `/${path__default["default"].join(this.args.uploadsRelative, userId)}/`;
        const { extensions, uploadLimits } = this.args;
        return { prefix, extensions, uploadLimits };
    }
    property = 'file';
    startServer(app, activeServers) {
        super.startServer(app, activeServers);
        const fileSize = FileServerMeg * Math.max(...Object.values(this.args.uploadLimits));
        const { uploadsPrefix } = this.args;
        const { extensions } = this;
        const storage = multer__default["default"].diskStorage({
            destination: function (req, _file, cb) {
                const { id } = req.body;
                const request = req;
                const { user } = request.auth;
                if (!user)
                    cb(new Error(moviemasher_js.Errors.invalid.user), '');
                else {
                    const filePath = `${uploadsPrefix}/${user}/${id}`;
                    fs__default["default"].mkdirSync(filePath, { recursive: true });
                    cb(null, filePath);
                }
            },
            filename: function (_req, file, cb) {
                const { originalname } = file;
                const ext = path__default["default"].extname(originalname).slice(1).toLowerCase();
                if (!extensions.includes(ext))
                    cb(new Error(`Invalid extension ${ext}`), '');
                else
                    cb(null, `${FileServerFilename}.${ext}`);
            }
        });
        const multerOptions = { storage, limits: { fileSize } };
        const upload = multer__default["default"](multerOptions);
        app.post(moviemasher_js.Endpoints.file.store, upload.single(this.property), this.store);
    }
    store = async (req, res) => {
        const request = req.body;
        const response = {};
        try {
            const user = this.userFromRequest(req);
            if (user) {
                const { id } = request;
                if (id) {
                    const { file: uploadedFile } = req;
                    if (!uploadedFile)
                        response.error = 'No file supplied';
                }
                else
                    response.error = moviemasher_js.Errors.id;
            }
            else
                response.error = moviemasher_js.Errors.invalid.user;
        }
        catch (error) {
            response.error = String(error);
        }
        res.send(response);
    };
    userUploadPrefix(id, user) {
        moviemasher_js.assertPopulatedString(id, 'upload id');
        return id;
    }
    withinLimits(size, type) {
        if (!size)
            throw moviemasher_js.Errors.invalid.size;
        if (!type)
            throw moviemasher_js.Errors.invalid.type;
        const limit = this.args.uploadLimits[type];
        if (!limit)
            throw moviemasher_js.Errors.invalid.type;
        return limit > size / FileServerMeg;
    }
}

const BasenameCache = 'cached';
const BasenameRendering = 'rendering';
const BasenameDefinition = 'definition';
const ExtensionLoadedInfo = 'info.txt';
const ExtensionCommands = 'commands.txt';

class RunningCommandClass extends EventEmitter__default["default"] {
    constructor(id, args) {
        super();
        this.id = id;
        const { commandFilters, inputs, output, avType } = args;
        this.avType = avType;
        if (commandFilters)
            this.commandFilters = commandFilters;
        if (inputs)
            this.commandInputs = inputs;
        if (!(this.commandInputs.length || this.commandFilters.length)) {
            console.trace(this.constructor.name, "with no inputs or commandFilters");
            throw moviemasher_js.Errors.invalid.argument + 'inputs';
        }
        this.output = output;
    }
    _commandProcess;
    get command() {
        if (this._commandProcess)
            return this._commandProcess;
        const { commandInputs: inputs, commandFilters, output, avType } = this;
        // console.log(this.constructor.name, "command", inputs)
        const commandOptions = { commandFilters, inputs, output, avType };
        return this._commandProcess = commandInstance(commandOptions);
    }
    avType;
    commandFilters = [];
    id;
    commandInputs = [];
    kill() {
        console.debug(this.constructor.name, "kill", this.id);
        this._commandProcess?.kill('SIGKILL');
    }
    makeDirectory(destination) {
        fs__default["default"].mkdirSync(path__default["default"].dirname(destination), { recursive: true });
    }
    output = {};
    run(destination) {
        // console.log(this.constructor.name, "run", destination)
        this.command.on('error', (...args) => {
            const destinationString = moviemasher_js.isPopulatedString(destination) ? destination : '';
            const errorString = this.runError(destinationString, ...args);
            console.error(this.constructor.name, "run on error", errorString);
            this.emit('error', errorString);
        });
        this.command.on('start', (...args) => {
            this.emit('start', ...args);
        });
        this.command.on('end', (...args) => {
            this.emit('end', ...args);
        });
        if (moviemasher_js.isPopulatedString(destination))
            this.makeDirectory(destination);
        try {
            this.command.output(destination);
            this.command.run();
        }
        catch (error) {
            console.error(this.constructor.name, "run received error", error);
        }
    }
    runError(destination, ...args) {
        return commandArgsString(this.command._getArguments(), destination, ...args);
    }
    runPromise(destination) {
        moviemasher_js.assertPopulatedString(destination);
        const result = {};
        const promise = new Promise((resolve, reject) => {
            const { command } = this;
            command.on('error', (...args) => {
                reject({ error: this.runError(destination, ...args) });
            });
            command.on('end', () => { resolve(result); });
            try {
                this.makeDirectory(destination);
                command.save(destination);
            }
            catch (error) {
                reject({ error: this.runError(destination, error) });
            }
        });
        return promise;
    }
}

const CommandFactoryInstances = {};
const runningCommandGet = (id) => {
    return CommandFactoryInstances[id];
};
const runningCommandDelete = (id) => {
    const existing = runningCommandGet(id);
    if (!existing)
        return;
    delete CommandFactoryInstances[id];
    existing.kill();
};
const runningCommandInstance = (id, options) => {
    const command = new RunningCommandClass(id, options);
    CommandFactoryInstances[id] = command;
    return command;
};

class NodeLoader extends moviemasher_js.LoaderClass {
    temporaryDirectory;
    cacheDirectory;
    filePrefix;
    defaultDirectory;
    validDirectories;
    constructor(temporaryDirectory, cacheDirectory, filePrefix, defaultDirectory, validDirectories) {
        super();
        this.temporaryDirectory = temporaryDirectory;
        this.cacheDirectory = cacheDirectory;
        this.filePrefix = filePrefix;
        this.defaultDirectory = defaultDirectory;
        this.validDirectories = validDirectories;
        if (!cacheDirectory)
            throw moviemasher_js.Errors.invalid.url + 'cacheDirectory';
        if (!filePrefix)
            throw moviemasher_js.Errors.invalid.url + 'filePrefix';
        if (!defaultDirectory)
            throw moviemasher_js.Errors.invalid.url + 'defaultDirectory';
    }
    browsing = false;
    cachePromise(url, graphFile, cache) {
        // console.log(this.constructor.name, "cachePromise", url)
        if (fs__default["default"].existsSync(url)) {
            // console.log(this.constructor.name, "cachePromise existent")
            return this.updateSources(url, cache, graphFile);
        }
        const { filePrefix } = this;
        if (url.startsWith(filePrefix))
            throw moviemasher_js.Errors.uncached + ' cachePromise ' + url;
        // console.log(this.constructor.name, "cachePromise calling writePromise", url)
        return this.writePromise(graphFile, url).then(() => {
            return this.updateSources(url, cache, graphFile);
        });
    }
    graphType = moviemasher_js.GraphType.Mash;
    graphFileTypeBasename(type, content) {
        if (type !== moviemasher_js.GraphFileType.SvgSequence)
            return `${BasenameCache}.${type}`;
        const fileCount = content.split("\n").length;
        const digits = String(fileCount).length;
        return `%0${digits}.svg`;
    }
    infoPath(key) {
        return path__default["default"].join(this.cacheDirectory, `${md5__default["default"](key)}.${ExtensionLoadedInfo}`);
    }
    key(graphFile) {
        const { type, file, content, resolved: key } = graphFile;
        if (key) {
            // console.log(this.constructor.name, "key RESOLVED", type, file, key)
            return key;
        }
        moviemasher_js.assertPopulatedString(file, 'file');
        const { cacheDirectory, filePrefix, defaultDirectory, validDirectories } = this;
        if (!moviemasher_js.isLoadType(type)) {
            if (!type)
                console.trace(this.constructor.name, "key NOT LOADTYPE", type, file, content);
            // file is clip.id, content contains text of file
            moviemasher_js.assertPopulatedString(content, 'content');
            const fileName = this.graphFileTypeBasename(type, content);
            return path__default["default"].resolve(cacheDirectory, file, fileName);
        }
        // file is url, if absolute then use md5 as directory name
        if (file.includes('://')) {
            // console.log(this.constructor.name, "key LOADTYPE ABSOLUTE", type, file, content)
            const extname = path__default["default"].extname(file);
            const ext = extname || this.typeExtension(type);
            return path__default["default"].resolve(cacheDirectory, md5__default["default"](file), `${BasenameCache}${ext}`);
        }
        // console.log(this.constructor.name, "key LOADTYPE NOT ABSOLUTE", type, file)
        const resolved = path__default["default"].resolve(filePrefix, defaultDirectory, file);
        const directories = [defaultDirectory, ...validDirectories];
        const prefixes = [path__default["default"].resolve(cacheDirectory),
            ...directories.map(dir => path__default["default"].resolve(filePrefix, dir))
        ];
        const valid = prefixes.some(prefix => resolved.startsWith(prefix));
        if (!valid)
            throw moviemasher_js.Errors.invalid.url + resolved;
        graphFile.resolved = resolved;
        return resolved;
    }
    loadGraphFilePromise(graphFile) {
        let cache = this.cacheGet(graphFile, true);
        moviemasher_js.assertObject(cache);
        const { definition } = graphFile;
        if (moviemasher_js.isDefinition(definition)) {
            const { definitions } = cache;
            if (!definitions.includes(definition))
                definitions.push(definition);
        }
        const { promise } = cache;
        moviemasher_js.assertObject(promise);
        return promise;
    }
    remoteLocalFile(originalFile, loadType, mimeType) {
        if (!moviemasher_js.isPopulatedString(mimeType) || mimeType.startsWith(loadType))
            return originalFile;
        if (!(loadType === moviemasher_js.LoadType.Font && mimeType.startsWith('text/css')))
            return originalFile;
        const dirname = path__default["default"].dirname(originalFile);
        const extname = path__default["default"].extname(originalFile);
        const basename = path__default["default"].basename(originalFile, extname);
        return path__default["default"].join(dirname, `${basename}.css`);
    }
    remotePromise(loadType, key, urlString) {
        // console.log(this.constructor.name, "remotePromise", key, urlString)
        const promise = new Promise((resolve, reject) => {
            const { request } = urlString.startsWith('https') ? https__default["default"] : http__default["default"];
            const req = request(urlString, response => {
                const { ['content-type']: type } = response.headers;
                const filePath = this.remoteLocalFile(key, loadType, type);
                // console.log(this.constructor.name, "remotePromise.request", type, filePath)
                const stream = fs__default["default"].createWriteStream(filePath);
                response.pipe(stream);
                stream.on('finish', () => {
                    stream.close();
                    if (filePath === key)
                        resolve();
                    else {
                        fs__default["default"].promises.readFile(filePath).then(buffer => {
                            const string = buffer.toString();
                            const lastUrl = this.lastCssUrl(string);
                            this.remotePromise(loadType, key, lastUrl).then(resolve);
                        });
                    }
                });
                stream.on('error', (error) => {
                    console.error(this.constructor.name, "remotePromise.callback error", error);
                    reject(error);
                });
            });
            req.on('error', error => {
                console.error(error);
                reject(error);
            });
            req.end();
        });
        return promise;
    }
    typeExtension(type) {
        switch (type) {
            case moviemasher_js.LoadType.Font: return '.ttf';
            case moviemasher_js.LoadType.Image: return '.png';
            case moviemasher_js.LoadType.Audio: return '.mp3';
            case moviemasher_js.LoadType.Video: return '.mp4';
        }
    }
    updateableDefinitions(preloaderSource) {
        const definitions = [...preloaderSource.definitions];
        const preloadableDefinitions = definitions.filter(definition => {
            return moviemasher_js.isPreloadableDefinition(definition);
        });
        return preloadableDefinitions.filter(definition => {
            const trimmable = moviemasher_js.isUpdatableDurationDefinition(definition);
            if (trimmable && !moviemasher_js.isAboveZero(definition.duration))
                return true;
            return moviemasher_js.isUpdatableSizeDefinition(definition) && !moviemasher_js.sizeAboveZero(definition.sourceSize);
        });
    }
    updateSources(key, cache, graphFile) {
        const { definitions } = cache;
        cache.loaded = true;
        definitions.forEach(definition => {
            if (!moviemasher_js.isPreloadableDefinition(definition))
                return;
            if (!definition.source.startsWith('http')) {
                definition.source = key;
            }
            return;
        });
        const { type } = graphFile;
        if (!moviemasher_js.isLoadType(type))
            return Promise.resolve();
        const neededDefinitions = this.updateableDefinitions(cache);
        // console.log(this.constructor.name, "updateSources", neededDefinitions.length)
        if (!neededDefinitions.length)
            return Promise.resolve();
        // const preloaderFile = cache as LoaderCache
        const infoPath = this.infoPath(key);
        const { temporaryDirectory } = this;
        // console.log(this.constructor.name, "updateSources", infoPath)
        return Probe.promise(temporaryDirectory, key, infoPath).then(loadedInfo => {
            this.updateDefinitions(graphFile, loadedInfo);
        });
    }
    writePromise(graphFile, key) {
        const { file, type, content } = graphFile;
        const dirname = path__default["default"].dirname(key);
        let promise = fs__default["default"].promises.mkdir(dirname, { recursive: true }).then(moviemasher_js.EmptyMethod);
        // console.log(this.constructor.name, "writePromise", key, type, file)
        if (moviemasher_js.isLoadType(type)) {
            if (moviemasher_js.urlIsHttp(file)) {
                // console.log(this.constructor.name, "writePromise calling remotePromise", type, key, file)
                return promise.then(() => this.remotePromise(type, key, file));
            }
            // local file should already exist!
            throw moviemasher_js.Errors.uncached + file;
        }
        moviemasher_js.assertPopulatedString(content);
        switch (type) {
            case moviemasher_js.GraphFileType.SvgSequence: return promise.then(() => {
                const svgs = content.split("\n");
                const { length } = svgs;
                const digits = String(length).length;
                return Promise.all(svgs.map((svg, index) => {
                    const fileName = `${String(index).padStart(digits, '0')}.svg`;
                    const filePath = path__default["default"].join(dirname, fileName);
                    return fs__default["default"].promises.writeFile(filePath, svg);
                })).then(moviemasher_js.EmptyMethod);
            });
        }
        return promise.then(() => fs__default["default"].promises.writeFile(key, content));
    }
}

const renderingInput = (definition, clipObject = {}) => {
    const { type, id } = definition;
    const definitionObject = {
        ...definition,
        type: type === moviemasher_js.DefinitionType.VideoSequence ? moviemasher_js.DefinitionType.Video : type
    };
    const definitions = [definitionObject];
    const clip = renderingClipFromDefinition(definitionObject, clipObject);
    const track = {
        dense: true,
        clips: [clip]
    };
    const tracks = [track];
    const mashObject = { id };
    const mash = { ...mashObject, tracks };
    return { mash, definitions };
};
const renderingCommandOutputs = (commandOutputs) => {
    const counts = {};
    return commandOutputs.map(output => {
        const { outputType } = output;
        const populated = moviemasher_js.outputDefaultPopulate(output);
        if (!counts[outputType]) {
            counts[outputType] = 1;
        }
        else {
            populated.basename ||= `${outputType}-${counts[outputType]}`;
            counts[outputType]++;
        }
        return populated;
    });
};
const renderingOutputFile = (index, commandOutput, extension) => {
    const { basename, format, extension: outputExtension, outputType } = commandOutput;
    const ext = extension || outputExtension || format;
    moviemasher_js.assertPopulatedString(ext);
    const components = [basename || outputType];
    if (index && !basename)
        components.push(String(index));
    components.push(ext);
    return components.join('.');
};
const renderingSource = (commandOutput) => {
    if (!commandOutput) {
        // console.log("renderingSource with no commandOutput")
        return '';
    }
    const { format, extension, outputType } = commandOutput;
    const ext = extension || format;
    if (outputType === moviemasher_js.OutputType.ImageSequence)
        return '';
    return `${outputType}.${ext}`;
};
const renderingInputFromRaw = (loadType, source, clip = {}) => {
    const definitionId = clip.id || source;
    const definition = renderingDefinitionObject(loadType, source, String(definitionId), String(clip.label));
    return renderingInput(definition, clip);
};
const renderingClipFromDefinition = (definition, overrides = {}) => {
    const { id, type } = definition;
    const { id: _, containerId: suppliedContainerId, ...rest } = overrides;
    const contentId = id || type;
    const supplied = suppliedContainerId ? String(suppliedContainerId) : undefined;
    const containerId = type === 'audio' ? '' : supplied;
    const definitionId = moviemasher_js.clipDefault.id;
    const content = { ...rest };
    const visibleClipObject = {
        definitionId, contentId, content, containerId
    };
    if (type === moviemasher_js.DefinitionType.Image) {
        visibleClipObject.timing = moviemasher_js.Timing.Custom;
        visibleClipObject.frames = 1;
    }
    // console.log("renderingClipFromDefinition", overrides, visibleClipObject)
    return visibleClipObject;
};
const renderingDefinitionObject = (loadType, source, definitionId, label) => {
    const type = definitionTypeFromRaw(loadType);
    const id = definitionId || idUnique();
    const definition = { id, type, source, label };
    return definition;
};
const definitionTypeFromRaw = (loadType) => {
    switch (loadType) {
        case moviemasher_js.LoadType.Audio: return moviemasher_js.DefinitionType.Audio;
        case moviemasher_js.LoadType.Video: return moviemasher_js.DefinitionType.VideoSequence;
        case moviemasher_js.LoadType.Image: return moviemasher_js.DefinitionType.Image;
        case moviemasher_js.LoadType.Font: return moviemasher_js.DefinitionType.Font;
    }
};

class RenderingProcessClass {
    args;
    constructor(args) {
        this.args = args;
        // console.log(this.constructor.name, "upload", args.upload)
        moviemasher_js.Defined.define(...this.args.definitions);
    }
    combinedRenderingDescriptionPromise(index, renderingDescription) {
        const { visibleCommandDescriptions, commandOutput, audibleCommandDescription } = renderingDescription;
        const length = visibleCommandDescriptions?.length;
        if (!length || length === 1) {
            // console.log(this.constructor.name, "combinedRenderingDescriptionPromise resolved", length)
            return Promise.resolve(renderingDescription);
        }
        const extension = moviemasher_js.ExtTs;
        const { options: commandOutputOptions = {}, audioBitrate, audioChannels, audioCodec, audioRate, outputType, ...rest } = commandOutput;
        const options = { ...commandOutputOptions, an: '', qp: 0 };
        const output = {
            ...rest, options, extension, outputType: moviemasher_js.OutputType.Video
        };
        const { outputDirectory } = this.args;
        const concatDirectoryName = renderingOutputFile(index, commandOutput, 'concat');
        const concatDirectory = path__default["default"].join(outputDirectory, concatDirectoryName);
        let promise = this.createDirectoryPromise(concatDirectory);
        const fileDurations = visibleCommandDescriptions.map((description, index) => {
            const baseName = `concat-${index}`;
            const fileName = `${baseName}.${extension}`;
            const destinationPath = path__default["default"].join(concatDirectory, fileName);
            const cmdPath = path__default["default"].join(concatDirectory, `${baseName}.${ExtensionCommands}`);
            const infoPath = path__default["default"].join(concatDirectory, `${baseName}.${ExtensionLoadedInfo}`);
            const { duration } = description;
            moviemasher_js.assertAboveZero(duration, 'duration');
            const concatFileDuration = [fileName, duration];
            promise = promise.then(() => {
                return this.renderResultPromise(destinationPath, cmdPath, infoPath, output, description).then(moviemasher_js.EmptyMethod);
            });
            return concatFileDuration;
        });
        const concatFile = this.concatFile(fileDurations);
        const concatFilePath = path__default["default"].join(concatDirectory, 'concat.txt');
        promise = promise.then(() => {
            // console.log(this.constructor.name, "combinedRenderingDescriptionPromise finished concat generation", concatFilePath)
            return this.createFilePromise(concatFilePath, concatFile);
        });
        return promise.then(() => {
            moviemasher_js.assertSize(output);
            const { width, height } = output;
            const commandInput = { source: concatFilePath }; //, options: { video_size: `${width}x${height}` }
            const durations = fileDurations.map(([_, duration]) => duration);
            const duration = durations.reduce((total, duration) => total + duration, 0);
            const inputs = audibleCommandDescription?.inputs || [];
            const description = {
                inputs: [commandInput], duration, avType: moviemasher_js.AVType.Video
            };
            if (inputs.length) {
                description.commandFilters = [{
                        inputs: [`${inputs.length}:v`], ffmpegFilter: 'copy',
                        options: {}, outputs: []
                    }];
            }
            const renderingDescription = {
                audibleCommandDescription, visibleCommandDescriptions: [description],
                commandOutput: {
                    ...commandOutput, width, height,
                    options: { ...commandOutputOptions, 'c:v': 'copy' }
                },
            };
            return renderingDescription;
        });
    }
    commandDescriptionMerged(flatDescription) {
        const { visibleCommandDescriptions, audibleCommandDescription } = flatDescription;
        const descriptions = [];
        const length = visibleCommandDescriptions?.length;
        if (length) {
            moviemasher_js.assertTrue(length === 1, 'flat');
            const [visibleCommandDescription] = visibleCommandDescriptions;
            descriptions.push(visibleCommandDescription);
        }
        // audio must come last
        if (audibleCommandDescription)
            descriptions.push(audibleCommandDescription);
        // else console.log(this.constructor.name, "commandDescriptionMerged no audibleCommandDescription")
        if (!descriptions.length)
            return;
        const [description] = descriptions;
        const merged = descriptions.length > 1 ? this.commandDescriptionsMerged(descriptions) : description;
        return merged;
    }
    commandDescriptionsMerged(descriptions) {
        const inputs = [];
        const commandFilters = [];
        const durations = [];
        const types = new Set();
        descriptions.forEach(description => {
            const { duration, inputs: descriptionInputs, commandFilters: filters, avType } = description;
            types.add(avType);
            if (descriptionInputs)
                inputs.push(...descriptionInputs);
            if (filters)
                commandFilters.push(...filters);
            if (duration)
                durations.push(duration);
        });
        const avType = types.size === 1 ? [...types.values()].pop() : moviemasher_js.AVType.Both;
        const commandDescription = { inputs, commandFilters, avType };
        moviemasher_js.assertTrue(durations.length === descriptions.length, 'each description has duration');
        commandDescription.duration = Math.max(...durations);
        // console.log(this.constructor.name, "commandDescriptionsMerged", inputs)
        return commandDescription;
    }
    concatFile(fileDurations) {
        const lines = ['ffconcat version 1.0'];
        lines.push(...fileDurations.flatMap(fileDuration => {
            const [file, duration] = fileDuration;
            return [`file '${file}'`, `duration ${duration}`];
        }));
        return lines.join("\n");
    }
    createDirectoryPromise(directoryPath) {
        return fs__default["default"].promises.mkdir(directoryPath, { recursive: true }).then(moviemasher_js.EmptyMethod);
    }
    createFilePromise(filePath, content) {
        return fs__default["default"].promises.writeFile(filePath, content).then(moviemasher_js.EmptyMethod);
    }
    directoryPromise() {
        const { outputsPopulated: outputs, args, id } = this;
        const { outputDirectory, mash, definitions, upload } = args;
        // console.log(this.constructor.name, "directoryPromise", outputDirectory)
        const argsJson = JSON.stringify({ id, outputs, mash, definitions, upload }, null, 2);
        return this.createDirectoryPromise(outputDirectory).then(() => {
            const jsonPath = path__default["default"].join(outputDirectory, `${BasenameRendering}.json`);
            return this.createFilePromise(jsonPath, argsJson);
        });
    }
    fileName(index, commandOutput, renderingOutput) {
        const { outputType, videoRate } = commandOutput;
        if (outputType !== moviemasher_js.OutputType.ImageSequence)
            return renderingOutputFile(index, commandOutput);
        if (!videoRate)
            throw moviemasher_js.Errors.internal + 'videoRate';
        const { format, extension, basename } = commandOutput;
        const base = basename || '';
        const ext = extension || format;
        const { duration } = renderingOutput;
        const framesMax = Math.floor(videoRate * duration) - 2;
        const begin = 1;
        const lastFrame = begin + (framesMax - begin);
        const padding = String(lastFrame).length;
        return `${base}%0${padding}d.${ext}`;
    }
    _id;
    get id() {
        if (this._id)
            return this._id;
        return this._id = this.args.id || moviemasher_js.idGenerateString();
    }
    _mashInstance;
    get mashInstance() {
        if (this._mashInstance)
            return this._mashInstance;
        const { args, preloader } = this;
        const { mash } = args;
        const mashOptions = { ...mash, preloader };
        return this._mashInstance = moviemasher_js.mashInstance(mashOptions);
    }
    outputInstance(commandOutput) {
        const { outputType } = commandOutput;
        const { cacheDirectory, upload } = this.args;
        // console.log(this.constructor.name, "outputInstance upload", upload)
        const { mashInstance } = this;
        const args = {
            commandOutput, cacheDirectory, mash: mashInstance, upload
        };
        return moviemasher_js.OutputFactory[outputType](args);
    }
    _outputsPopulated;
    get outputsPopulated() {
        return this._outputsPopulated ||= renderingCommandOutputs(this.args.outputs);
    }
    _preloader;
    get preloader() { return this._preloader ||= this.preloaderInitialize; }
    get preloaderInitialize() {
        const { args } = this;
        const { cacheDirectory, validDirectories, defaultDirectory, filePrefix, temporaryDirectory } = args;
        return new NodeLoader(temporaryDirectory, cacheDirectory, filePrefix, defaultDirectory, validDirectories);
    }
    renderResultPromise(destination, cmdPath, infoPath, commandOutput, commandDescription) {
        const { outputType, avType } = commandOutput;
        const { duration, inputs } = commandDescription;
        // console.log(this.constructor.name, "renderResultPromise", inputs)
        const commandOptions = {
            output: commandOutput, ...commandDescription
        };
        const options = commandOutput.options;
        switch (outputType) {
            case moviemasher_js.OutputType.Image:
            case moviemasher_js.OutputType.Waveform: {
                options['frames:v'] = 1;
                break;
            }
            default: {
                if (duration)
                    options.t = duration;
            }
        }
        if (avType === moviemasher_js.AVType.Audio) {
            delete commandOutput.videoCodec;
            delete commandOutput.videoRate;
        }
        else if (avType === moviemasher_js.AVType.Video) {
            delete commandOutput.audioCodec;
            delete commandOutput.audioBitrate;
            delete commandOutput.audioChannels;
            delete commandOutput.audioRate;
        }
        const command = runningCommandInstance(this.id, commandOptions);
        const commandsText = commandArgsString(command.command._getArguments(), destination);
        const writeCommandPromise = fs__default["default"].promises.writeFile(cmdPath, commandsText);
        const runCommandPromise = writeCommandPromise.then(() => {
            return command.runPromise(destination);
        });
        return runCommandPromise.then((commandResult) => {
            const renderingResult = {
                ...commandResult, destination, outputType
            };
            const { error } = commandResult;
            if (error) {
                // console.warn(this.constructor.name, "renderResultPromise runPromise", destination, error)
                return fs__default["default"].promises.writeFile(infoPath, JSON.stringify(renderingResult)).then(() => renderingResult);
            }
            const { temporaryDirectory } = this.args;
            return Probe.promise(temporaryDirectory, destination, infoPath).then(() => renderingResult);
        });
    }
    rendered(destinationPath, duration = 0, tolerance = 0.1) {
        if (!fs__default["default"].existsSync(destinationPath))
            return false;
        if (!duration)
            return true;
        const dirName = path__default["default"].dirname(destinationPath);
        const extName = path__default["default"].extname(destinationPath);
        const baseName = path__default["default"].basename(destinationPath, extName);
        const infoPath = path__default["default"].join(dirName, `${baseName}.${ExtensionLoadedInfo}`);
        if (!fs__default["default"].existsSync(infoPath))
            return false;
        const buffer = fs__default["default"].readFileSync(infoPath);
        if (!moviemasher_js.isDefined(buffer))
            return false;
        const info = JSON.parse(buffer.toString());
        const infoTolerant = Math.round(info.duration / tolerance);
        const tolerant = Math.round(duration / tolerance);
        const durationsEqual = infoTolerant === tolerant;
        if (!durationsEqual)
            console.log(this.constructor.name, "rendered", infoTolerant, durationsEqual ? "===" : "!==", tolerant);
        return durationsEqual;
    }
    runPromise() {
        const results = [];
        const countsByType = {};
        const runData = {
            runResult: { results }, countsByType
        };
        let promise = this.directoryPromise().then(() => runData);
        const { outputsPopulated } = this;
        const { outputDirectory, upload } = this.args;
        outputsPopulated.forEach(output => {
            const { optional, outputType } = output;
            const instanceOptions = {
                options: {}, ...output
            };
            // options!.report ||= path.join(outputDirectory, `report`)
            const expectDuration = outputType !== moviemasher_js.OutputType.Image;
            const renderingOutput = this.outputInstance(instanceOptions);
            promise = promise.then(data => {
                const { countsByType } = data;
                if (!moviemasher_js.isDefined(countsByType[outputType]))
                    countsByType[outputType] = -1;
                countsByType[outputType]++;
                const index = countsByType[outputType];
                // console.log(this.constructor.name, "runPromise directoryPromise done")
                const outputPromise = renderingOutput.renderingDescriptionPromise(results);
                const flatPromise = outputPromise.then(renderingDescription => {
                    // console.log(this.constructor.name, "runPromise renderingDescriptionPromise done")
                    return this.combinedRenderingDescriptionPromise(index, renderingDescription);
                });
                return flatPromise.then(flatDescription => {
                    const { commandOutput } = flatDescription;
                    const infoFilename = renderingOutputFile(index, commandOutput, ExtensionLoadedInfo);
                    const infoPath = path__default["default"].join(outputDirectory, infoFilename);
                    const commandDescription = this.commandDescriptionMerged(flatDescription);
                    if (!commandDescription) {
                        if (!optional)
                            throw `required ${outputType} failed`;
                        results.push({ outputType });
                        const info = { warning: `found no ${outputType}` };
                        return fs__default["default"].promises.writeFile(infoPath, JSON.stringify(info));
                    }
                    if (expectDuration) {
                        const { duration, inputs } = commandDescription;
                        // console.log(this.constructor.name, "command", inputs)
                        if (!duration)
                            throw moviemasher_js.Errors.invalid.duration;
                    }
                    const cmdFilename = renderingOutputFile(index, commandOutput, ExtensionCommands);
                    const destinationFileName = this.fileName(index, commandOutput, renderingOutput);
                    const cmdPath = path__default["default"].join(outputDirectory, cmdFilename);
                    const destination = path__default["default"].join(outputDirectory, destinationFileName);
                    // console.log(this.constructor.name, "runPromise flatPromise done", destination)
                    const renderPromise = this.renderResultPromise(destination, cmdPath, infoPath, commandOutput, commandDescription);
                    return renderPromise.then(renderingResult => { results.push(renderingResult); });
                }).then(() => data);
            });
        });
        return promise.then(({ runResult }) => {
            if (upload) {
                const [clip] = this.mashInstance.tracks[0].clips;
                const { contentId } = clip;
                const definition = moviemasher_js.Defined.fromId(contentId);
                if (moviemasher_js.isPreloadableDefinition(definition)) {
                    const { source: file, loadType: type } = definition;
                    const { preloader, args } = this;
                    const { outputDirectory } = args;
                    const graphFile = {
                        input: true, definition, type, file
                    };
                    moviemasher_js.assertLoadType(type);
                    const url = preloader.key(graphFile);
                    const infoPath = preloader.infoPath(url);
                    if (fs__default["default"].existsSync(infoPath)) {
                        // console.log("url", url, "infoPath", infoPath)
                        return fs__default["default"].promises.copyFile(infoPath, path__default["default"].join(outputDirectory, `upload.${ExtensionLoadedInfo}`)).then(() => {
                            return runResult;
                        });
                    }
                }
            }
            return runResult;
        });
    }
}

const renderingProcessInstance = (options) => {
    return new RenderingProcessClass(options);
};

class RenderingServerClass extends ServerClass {
    args;
    constructor(args) {
        super(args);
        this.args = args;
    }
    dataPutCallback(upload, user, id, renderingId, outputs) {
        const definitionPath = this.definitionFilePath(user, id);
        if (upload) {
            moviemasher_js.assertTrue(fs__default["default"].existsSync(definitionPath), definitionPath);
            const definitionString = expandFile(definitionPath);
            const definition = JSON.parse(definitionString);
            this.populateDefinition(user, renderingId, definition, outputs);
            const callback = {
                endpoint: { prefix: moviemasher_js.Endpoints.data.definition.put },
                request: { body: { definition } }
            };
            return callback;
        }
        // it's a mash render
        const [output] = outputs;
        const mash = {
            id, rendering: `${id}/${renderingId}/${output.outputType}.${output.extension || output.format}`
        };
        const callback = {
            endpoint: { prefix: moviemasher_js.Endpoints.data.mash.put },
            request: { body: { mash } }
        };
        return callback;
    }
    definitionFilePath(user, definitionId) {
        const outputDirectory = this.outputDirectory(user, definitionId);
        const jsonPath = path__default["default"].join(outputDirectory, `${BasenameDefinition}.json`);
        return jsonPath;
    }
    definitionTypeCommandOutputs(definitionType) {
        const outputs = [];
        const { previewSize, iconSize } = this;
        // TODO: support waveform generation
        // TODO: support font uploading
        switch (definitionType) {
            case moviemasher_js.DefinitionType.Audio: {
                outputs.push({ outputType: moviemasher_js.OutputType.Audio });
                // outputs.push({ outputType: OutputType.Waveform })
                break;
            }
            case moviemasher_js.DefinitionType.Image: {
                outputs.push({ outputType: moviemasher_js.OutputType.Image, ...previewSize });
                outputs.push({ outputType: moviemasher_js.OutputType.Image, ...iconSize, basename: 'icon' });
                break;
            }
            case moviemasher_js.DefinitionType.VideoSequence: {
                outputs.push({ outputType: moviemasher_js.OutputType.Audio, optional: true });
                outputs.push({ outputType: moviemasher_js.OutputType.Image, ...iconSize, basename: 'icon' });
                outputs.push({ outputType: moviemasher_js.OutputType.ImageSequence, ...previewSize });
                // outputs.push({ outputType: OutputType.Waveform })
                break;
            }
            case moviemasher_js.DefinitionType.Font: {
                // outputs.push({ outputType: OutputType.Font })
                break;
            }
        }
        return outputs;
    }
    directoryPromise(user, definition) {
        const { id } = definition;
        const jsonPath = this.definitionFilePath(user, id);
        const outputDirectory = path__default["default"].dirname(jsonPath);
        // console.log(this.constructor.name, "directoryPromise", outputDirectory)
        return fs__default["default"].promises.mkdir(outputDirectory, { recursive: true }).then(() => {
            return fs__default["default"].promises.writeFile(jsonPath, JSON.stringify(definition, null, 2));
        });
    }
    fileServer;
    id = 'rendering';
    outputDirectory(user, id, renderingId) {
        const components = [this.fileServer.args.uploadsPrefix];
        if (user)
            components.push(user);
        if (id)
            components.push(id);
        if (renderingId)
            components.push(renderingId);
        return path__default["default"].resolve(...components);
    }
    populateDefinition(user, renderingId, definition, commandOutputs) {
        const { fileServer } = this;
        moviemasher_js.assertTrue(fileServer);
        const { id, source, type: definitionType } = definition;
        moviemasher_js.assertPopulatedString(id);
        moviemasher_js.assertDefinitionType(definitionType);
        moviemasher_js.assertPopulatedString(source);
        const prefix = path__default["default"].join(fileServer.userUploadPrefix(id, user), renderingId);
        const outputDirectory = this.outputDirectory(user, id);
        const inInfoName = `upload.${ExtensionLoadedInfo}`;
        const inInfoPath = path__default["default"].join(outputDirectory, renderingId, inInfoName);
        const inInfoExists = fs__default["default"].existsSync(inInfoPath);
        const inInfo = inInfoExists ? expandToJson(inInfoPath) : {};
        const { width: inWidth, height: inHeight, duration: inDuration, audible: inAudible, label: inLabel } = inInfo;
        if (moviemasher_js.isUpdatableDurationType(definitionType) && moviemasher_js.isAboveZero(inDuration)) {
            definition.duration = inDuration;
        }
        if (moviemasher_js.isUpdatableSizeType(definitionType)) {
            if (moviemasher_js.isAboveZero(inWidth) && moviemasher_js.isAboveZero(inHeight)) {
                definition.sourceSize = { width: inWidth, height: inHeight };
            }
        }
        const countByType = {};
        commandOutputs.forEach(output => {
            const { outputType } = output;
            if (!moviemasher_js.isDefined(countByType[outputType]))
                countByType[outputType] = -1;
            countByType[outputType]++;
            const index = countByType[outputType];
            const outInfoName = renderingOutputFile(index, output, ExtensionLoadedInfo);
            const outInfoPath = path__default["default"].join(outputDirectory, renderingId, outInfoName);
            const outInfo = expandToJson(outInfoPath);
            const { width: outWidth, height: outHeight, duration: outDuration, audible: outAudible, extension } = outInfo;
            const outputFilename = renderingOutputFile(index, output, extension);
            const outUrl = path__default["default"].join(prefix, outputFilename);
            // console.log(this.constructor.name, "populateDefinition", outInfo, index, outputType, outUrl)
            switch (outputType) {
                case moviemasher_js.OutputType.ImageSequence: {
                    if (moviemasher_js.isAboveZero(outWidth) && moviemasher_js.isAboveZero(outHeight)) {
                        definition.fps = output.videoRate;
                        definition.previewSize = { width: outWidth, height: outHeight };
                        definition.url = prefix + '/';
                    }
                    break;
                }
                case moviemasher_js.OutputType.Audio: {
                    const { duration: definitionDuration } = definition;
                    if (moviemasher_js.isAboveZero(outDuration) && moviemasher_js.isAboveZero(definitionDuration)) {
                        definition.audio = true;
                        definition.duration = Math.min(definitionDuration, outDuration);
                        const audioInput = definitionType === moviemasher_js.DefinitionType.Audio;
                        if (audioInput)
                            definition.url = outUrl;
                        else
                            definition.audioUrl = outUrl;
                    }
                    break;
                }
                case moviemasher_js.OutputType.Image: {
                    if (moviemasher_js.isAboveZero(outWidth) && moviemasher_js.isAboveZero(outHeight)) {
                        const outSize = { width: outWidth, height: outHeight };
                        const imageInput = definitionType === moviemasher_js.DefinitionType.Image;
                        if (imageInput && !index) {
                            definition.previewSize = outSize;
                            definition.url = outUrl;
                        }
                        else
                            definition.icon = outUrl;
                    }
                    break;
                }
            }
        });
        // console.log(this.constructor.name, "populateDefinition", definition)
    }
    get previewSize() { return this.args.previewSize || moviemasher_js.SizePreview; }
    get outputSize() { return this.args.outputSize || moviemasher_js.SizeOutput; }
    get iconSize() { return this.args.iconSize || moviemasher_js.SizeIcon; }
    _renderingCommandOutputs;
    get renderingCommandOutputs() {
        if (this._renderingCommandOutputs)
            return this._renderingCommandOutputs;
        const { previewSize, outputSize } = this;
        const provided = this.args.commandOutputs || {};
        const outputs = Object.fromEntries(moviemasher_js.OutputTypes.map(outputType => {
            const base = { outputType };
            switch (outputType) {
                case moviemasher_js.OutputType.Image:
                case moviemasher_js.OutputType.ImageSequence: {
                    base.width = previewSize.width;
                    base.height = previewSize.height;
                    base.cover = true;
                    break;
                }
                case moviemasher_js.OutputType.Video: {
                    base.width = outputSize.width;
                    base.height = outputSize.height;
                    break;
                }
            }
            const commandOutput = provided[outputType] || {};
            const renderingCommandOutput = { ...base, ...commandOutput };
            return [outputType, renderingCommandOutput];
        }));
        return this._renderingCommandOutputs = outputs;
    }
    start = async (req, res) => {
        const request = req.body;
        const { mash = {}, outputs = [], definitions = [], upload = false, ...rest } = request;
        // console.log(this.constructor.name, "start", JSON.stringify(request, null, 2))
        const commandOutputs = outputs.map(output => {
            const { outputType } = output;
            const commandOutput = {
                ...this.renderingCommandOutputs[outputType],
                ...output
            };
            return moviemasher_js.outputDefaultPopulate(commandOutput);
        });
        const id = mash.id || idUnique();
        const renderingId = idUnique();
        const response = {
            apiCallback: this.statusCallback(id, renderingId)
        };
        try {
            const user = this.userFromRequest(req);
            const { cacheDirectory, temporaryDirectory } = this.args;
            const filePrefix = this.fileServer.args.uploadsPrefix;
            const outputDirectory = this.outputDirectory(user, id, renderingId);
            const processArgs = {
                ...rest,
                upload, mash,
                defaultDirectory: user,
                validDirectories: ['shared'],
                cacheDirectory,
                temporaryDirectory,
                outputDirectory,
                filePrefix,
                definitions,
                outputs: commandOutputs
            };
            const renderingProcess = renderingProcessInstance(processArgs);
            renderingProcess.runPromise();
        }
        catch (error) {
            response.error = String(error);
        }
        res.send(response);
    };
    startCallback(definitionObject) {
        const { id, type } = definitionObject;
        if (!id)
            throw moviemasher_js.Errors.id;
        moviemasher_js.assertDefinitionType(type);
        const outputs = this.definitionTypeCommandOutputs(type);
        const clipObject = {};
        const input = renderingInput(definitionObject, clipObject);
        const renderingStartRequest = {
            ...input, outputs, upload: true
        };
        const request = { body: renderingStartRequest };
        const endpoint = { prefix: moviemasher_js.Endpoints.rendering.start };
        const renderingApiCallback = { endpoint, request };
        return renderingApiCallback;
    }
    status = async (req, res) => {
        const request = req.body;
        // console.log(this.constructor.name, "status", JSON.stringify(request, null, 2))
        const { id, renderingId } = request;
        const response = {};
        try {
            const user = this.userFromRequest(req);
            const outputDirectory = this.outputDirectory(user, id, renderingId);
            const jsonPath = path__default["default"].join(outputDirectory, `${BasenameRendering}.json`);
            const jsonString = expandFile(jsonPath);
            const json = JSON.parse(jsonString);
            const { outputs, upload } = json;
            const filenames = fs__default["default"].readdirSync(outputDirectory);
            const countsByType = {};
            const working = outputs.map(renderingCommandOutput => {
                // console.log(this.constructor.name, "status output", renderingCommandOutput)
                const { outputType } = renderingCommandOutput;
                if (!moviemasher_js.isDefined(countsByType[outputType]))
                    countsByType[outputType] = -1;
                countsByType[outputType]++;
                const index = countsByType[outputType];
                response[outputType] ||= { total: 0, completed: 0 };
                const state = response[outputType];
                state.total++;
                const resultFileName = renderingOutputFile(index, renderingCommandOutput, ExtensionLoadedInfo);
                if (filenames.includes(resultFileName)) {
                    state.completed++;
                    return 0;
                }
                return 1;
            });
            if (Math.max(...working))
                response.apiCallback = this.statusCallback(id, renderingId);
            else
                response.apiCallback = this.dataPutCallback(!!upload, user, id, renderingId, outputs);
        }
        catch (error) {
            response.error = String(error);
        }
        // console.log(this.constructor.name, "status response", response)
        res.send(response);
    };
    statusCallback(id, renderingId) {
        const statusCallback = {
            endpoint: { prefix: moviemasher_js.Endpoints.rendering.status },
            request: { body: { id, renderingId } }
        };
        return statusCallback;
    }
    startServer(app, activeServers) {
        super.startServer(app, activeServers);
        this.fileServer = activeServers.file;
        if (this.fileServer) {
            app.post(moviemasher_js.Endpoints.rendering.upload, this.upload);
        }
        app.post(moviemasher_js.Endpoints.rendering.start, this.start);
        app.post(moviemasher_js.Endpoints.rendering.status, this.status);
    }
    upload = async (req, res) => {
        const request = req.body;
        const { name, type, size } = request;
        // console.log(this.constructor.name, "upload", request)
        const response = {};
        try {
            const user = this.userFromRequest(req);
            const { fileServer } = this;
            moviemasher_js.assertTrue(fileServer, 'fileServer');
            const extension = path__default["default"].extname(name).slice(1).toLowerCase();
            let raw = type.split('/').pop(); // audio, video, image, font
            if (raw && !moviemasher_js.isLoadType(raw))
                raw = '';
            raw ||= fileServer.extensionLoadType(extension);
            if (!raw)
                response.error = moviemasher_js.Errors.invalid.type;
            else if (!fileServer.withinLimits(size, raw))
                response.error = moviemasher_js.Errors.invalid.size;
            else {
                const loadType = raw;
                response.loadType = loadType;
                const definitionId = idUnique(); // new definition id
                const prefix = fileServer.userUploadPrefix(definitionId, user);
                const source = path__default["default"].join(prefix, `${FileServerFilename}.${extension}`);
                const definition = renderingDefinitionObject(loadType, source, definitionId, name);
                // id, type, source, label
                await this.directoryPromise(user, definition);
                response.id = definitionId;
                response.fileProperty = fileServer.property;
                response.fileApiCallback = fileServer.constructCallback(request, user, definitionId);
                response.apiCallback = this.startCallback(definition);
            }
        }
        catch (error) {
            response.error = String(error);
        }
        // console.log(this.constructor.name, "upload response")
        res.send(response);
    };
}

const SocketStreamsDir = "./temporary/streams/Sockets";
class StreamUnix {
    constructor(stream, id, onSocket, type = 'stream') {
        // console.log("UnixStream", id, type)
        this.id = id;
        this.type = type;
        try { // to delete previous file
            fs__default["default"].mkdirSync(this.socketDir, { recursive: true });
            fs__default["default"].statSync(this.socketDir);
            fs__default["default"].statSync(this.socketPath);
            fs__default["default"].unlinkSync(this.socketPath);
        }
        catch (err) { }
        const server = net__default["default"].createServer(onSocket);
        stream.on('finish', () => {
            // console.log(this.constructor.name, "finish")
            server.close();
        });
        stream.on('error', (error) => {
            console.error(this.constructor.name, "error", error);
            server.close();
        });
        // console.log("socketPath", this.socketPath)
        server.listen(this.socketPath);
    }
    id;
    get socketDir() {
        return path__default["default"].resolve(SocketStreamsDir, this.type); //)
    }
    get socketPath() {
        return `${this.socketDir}/${this.id}.sock`;
    }
    type;
    get url() { return `unix:${this.socketPath}`; }
}
const StreamInput = (stream, id, type = 'input') => {
    // console.log("StreamInput", id, type)
    return new StreamUnix(stream, id, (socket) => { stream.pipe(socket); }, type);
};
const StreamOutput = (stream, id, type = 'output') => {
    // console.log("StreamOutput", id, type)
    return new StreamUnix(stream, id, (socket) => { socket.pipe(stream); }, type);
};

const wrtc = require('wrtc');
const { RTCPeerConnection } = wrtc;
const { RTCAudioSink, RTCVideoSink } = wrtc.nonstandard;
const FilterGraphPadding = 6;
const StreamPadding = 4;
const TIME_TO_CONNECTED = 10000;
const TIME_TO_HOST_CANDIDATES = 2000;
const TIME_TO_RECONNECTED = 10000;
class WebrtcConnection extends EventEmitter__default["default"] {
    constructor(id, outputPrefix, commandOutput) {
        super();
        this.id = id;
        this.state = 'open';
        if (commandOutput)
            this.commandOutput = commandOutput;
        if (outputPrefix)
            this.outputPrefix = outputPrefix;
        this.onIceConnectionStateChange = this.onIceConnectionStateChange.bind(this);
        this.onAudioData = this.onAudioData.bind(this);
        this.onFrameData = this.onFrameData.bind(this);
        this.beforeOffer();
    }
    async applyAnswer(answer) {
        await this.peerConnection.setRemoteDescription(answer);
    }
    beforeOffer() {
        const audioSink = this.createAudioSink();
        const videoSink = this.createVideoSink();
        videoSink.addEventListener('frame', this.onFrameData);
        audioSink.addEventListener('data', this.onAudioData);
        const { close } = this.peerConnection;
        const { stream } = this;
        stream?.audio.on('end', () => {
            audioSink.removeEventListener('data', this.onAudioData);
        });
        this.peerConnection.close = function () {
            audioSink.stop();
            videoSink.stop();
            if (!stream)
                return;
            const { audio, video, end } = stream;
            if (end)
                return;
            if (audio)
                audio.end();
            video.end();
            return close.apply(this);
        };
    }
    createAudioSink() {
        const audioTransceiver = this.peerConnection.addTransceiver('audio');
        return new RTCAudioSink(audioTransceiver.receiver.track);
    }
    createVideoSink() {
        const videoTransceiver = this.peerConnection.addTransceiver('video');
        return new RTCVideoSink(videoTransceiver.receiver.track);
    }
    close() {
        this.peerConnection.removeEventListener('iceconnectionstatechange', this.onIceConnectionStateChange);
        if (this.connectionTimer) {
            clearTimeout(this.connectionTimer);
            this.connectionTimer = undefined;
        }
        if (this.reconnectionTimer) {
            clearTimeout(this.reconnectionTimer);
            this.reconnectionTimer = undefined;
        }
        this.peerConnection.close();
        this.state = 'closed';
        this.emit('closed');
    }
    connectionTimer = setTimeout(() => {
        if (this.peerConnection.iceConnectionState !== 'connected'
            && this.peerConnection.iceConnectionState !== 'completed') {
            this.close();
        }
    }, TIME_TO_CONNECTED);
    async doOffer() {
        // console.log("doOffer")
        const offer = await this.peerConnection.createOffer();
        await this.peerConnection.setLocalDescription(offer);
        try {
            await this.waitUntilIceGatheringStateComplete();
        }
        catch (error) {
            this.close();
            throw error;
        }
    }
    get iceConnectionState() {
        return this.peerConnection.iceConnectionState;
    }
    id;
    inputAudio(audio) {
        return {
            source: StreamInput(audio, this.id, 'audio').url,
            options: { f: 's16le', ar: '48k', ac: 1 }
        };
    }
    inputVideo(video, size) {
        const { width, height } = size;
        return {
            source: StreamInput(video, this.id, 'video').url,
            options: {
                f: 'rawvideo',
                pix_fmt: 'yuv420p',
                s: `${width}x${height}`,
                r: '30',
            }
        };
    }
    get localDescription() {
        const description = this.peerConnection.localDescription;
        if (!description)
            return description;
        const { sdp, ...rest } = description;
        return { ...rest, sdp: sdp.replace(/\r\na=ice-options:trickle/g, '') };
    }
    onAudioData({ samples: { buffer } }) {
        // console.log("onAudioData...")
        if (!this.stream || this.stream.end)
            return;
        this.stream.audio.push(Buffer.from(buffer));
        // console.log("onAudioData!")
    }
    onFrameData(frameData) {
        // console.log("onFrameData...")
        const { frame: { width, height, data } } = frameData;
        const stream = this.streamForSize({ width, height });
        this.streams.forEach(item => {
            if (item !== stream && !item.end) {
                item.end = true;
                if (item.audio)
                    item.audio.end();
                item.video.end();
            }
        });
        stream.video.push(Buffer.from(data));
        // console.log("onFrameData!")
    }
    onIceConnectionStateChange() {
        // console.log(this.constructor.name, "onIceConnectionStateChange...")
        if (['connected', 'completed'].includes(this.peerConnection.iceConnectionState)) {
            if (this.connectionTimer) {
                clearTimeout(this.connectionTimer);
                this.connectionTimer = undefined;
            }
            if (this.reconnectionTimer) {
                clearTimeout(this.reconnectionTimer);
                this.reconnectionTimer = undefined;
            }
        }
        else if (this.peerConnection.iceConnectionState === 'disconnected'
            || this.peerConnection.iceConnectionState === 'failed') {
            if (!this.connectionTimer && !this.reconnectionTimer) {
                this.reconnectionTimer = setTimeout(() => { this.close(); }, TIME_TO_RECONNECTED);
            }
        }
        // console.log(this.constructor.name, "onIceConnectionStateChange!")
    }
    commandOutput = moviemasher_js.outputDefaultHls();
    outputPrefix = './temporary/streams/webrtc';
    _peerConnection;
    get peerConnection() {
        if (this._peerConnection)
            return this._peerConnection;
        const connection = new RTCPeerConnection({ sdpSemantics: 'unified-plan' });
        connection.addEventListener('iceconnectionstatechange', this.onIceConnectionStateChange);
        this._peerConnection = connection;
        return connection;
    }
    reconnectionTimer;
    get remoteDescription() {
        return this.peerConnection.remoteDescription;
    }
    get signalingState() {
        return this.peerConnection.signalingState;
    }
    state;
    get stream() { return this.streams[0]; }
    streamForSize(size) {
        const { width, height } = size;
        const currentStream = this.stream;
        if (currentStream && moviemasher_js.sizesEqual(currentStream.size, size))
            return currentStream;
        console.log("streamForSize", width, height);
        const prefix = path__default["default"].resolve(this.outputPrefix, this.id);
        fs__default["default"].mkdirSync(prefix, { recursive: true });
        const video = new stream.PassThrough();
        const audio = new stream.PassThrough();
        let destination = '';
        const { commandOutput } = this;
        const streamsPrefix = String(this.streams.length).padStart(StreamPadding, '0');
        switch (commandOutput.format) {
            case moviemasher_js.OutputFormat.Hls: {
                destination = `${prefix}/${streamsPrefix}-${size}.m3u8`;
                const { options } = commandOutput;
                if (options && !Array.isArray(options)) {
                    options.hls_segment_filename = `${prefix}/${size}-%0${FilterGraphPadding}d.ts`;
                }
                break;
            }
            case moviemasher_js.OutputFormat.Flv: {
                destination = `${prefix}/${streamsPrefix}-${size}.flv`;
                break;
            }
            case moviemasher_js.OutputFormat.Rtmp: {
                destination = 'rtmps://...';
                break;
            }
            // case OutputFormat.Pipe: {
            //   const combined = new PassThrough()
            //   destination = StreamOutput(combined, this.id).url
            // }
        }
        console.log("streamForSize commandOutput", commandOutput);
        const command = runningCommandInstance(this.id, {
            inputs: [
                this.inputVideo(video, size), this.inputAudio(audio)
            ],
            commandFilters: [],
            output: commandOutput, avType: moviemasher_js.AVType.Both
        });
        const webrtcStream = {
            destination,
            size,
            video,
            audio,
            command,
        };
        this.streams.unshift(webrtcStream);
        webrtcStream.command.run(destination);
        return webrtcStream;
    }
    streams = [];
    toJSON() {
        return {
            id: this.id, state: this.state,
            iceConnectionState: this.iceConnectionState,
            localDescription: this.localDescription,
            remoteDescription: this.remoteDescription,
            signalingState: this.signalingState
        };
    }
    async waitUntilIceGatheringStateComplete() {
        if (this.peerConnection.iceGatheringState === 'complete')
            return;
        const promise = new Promise((resolve, reject) => {
            const onIceCandidate = (object) => {
                // console.log("onIceCandidate", object)
                if (!object.candidate) {
                    clearTimeout(timeout);
                    this.peerConnection.removeEventListener('icecandidate', onIceCandidate);
                    resolve();
                }
            };
            const timeout = setTimeout(() => {
                this.peerConnection.removeEventListener('icecandidate', onIceCandidate);
                reject(new Error(`Timed out waiting for host candidates ${this.peerConnection}`));
            }, TIME_TO_HOST_CANDIDATES);
            this.peerConnection.addEventListener('icecandidate', onIceCandidate);
        });
        await promise;
    }
    static close() {
        this.getConnections().forEach(connection => { this.deleteConnection(connection); });
    }
    static connectionsById = new Map();
    static callbacksByConnection = new Map();
    static create(id, outputPrefix, commandOutput) {
        const connection = new WebrtcConnection(id, outputPrefix, commandOutput);
        // console.log(this.constructor.name, "createConnection", connection.constructor.name, id)
        const closedListener = () => { this.deleteConnection(connection); };
        this.callbacksByConnection.set(connection, closedListener);
        connection.once('closed', closedListener);
        this.connectionsById.set(connection.id, connection);
        return connection;
    }
    static deleteConnection(connection) {
        this.connectionsById.delete(connection.id);
        const closedListener = this.callbacksByConnection.get(connection);
        // console.log(this.constructor.name, "deleteConnection", connection.id, !!closedListener)
        if (!closedListener)
            return;
        this.callbacksByConnection.delete(connection);
        connection.removeListener('closed', closedListener);
    }
    static getConnection(id) {
        return this.connectionsById.get(id) || null;
    }
    static getConnections() {
        return [...this.connectionsById.values()];
    }
    static toJSON() {
        return this.getConnections().map(connection => connection.toJSON());
    }
}

const directoryLatest = (directory, extension) => {
    if (!fs__default["default"].existsSync(directory))
        return;
    const files = fs__default["default"].readdirSync(directory);
    const filesWithExt = files.filter(file => file.endsWith(extension)).sort();
    const count = filesWithExt.length;
    const file = count && filesWithExt[count - 1];
    if (!file)
        return;
    return `${directory}/${file}`;
};
const Directory = {
    latest: directoryLatest
};

// const StreamingProcessClearPng = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVQI12NgAAIAAAUAAeImBZsAAAAASUVORK5CYII="
class StreamingProcessClass extends EventEmitter__default["default"] {
    constructor(args) {
        super();
        this.args = args;
        const { id } = args;
        this.id = id;
        this.state = 'open';
    }
    args;
    close() {
        this.state = 'closed';
        this.emit('closed');
    }
    command;
    cut(args) {
        const { cacheDirectory, filePrefix, defaultDirectory, validDirectories, temporaryDirectory } = this.args;
        const { mashObjects, definitionObjects } = args;
        const preloader = new NodeLoader(temporaryDirectory, cacheDirectory, filePrefix, defaultDirectory, validDirectories);
        const mashes = mashObjects.map(mashObject => {
            return moviemasher_js.mashInstance({ ...mashObject, definitionObjects, preloader });
        });
        const commandOutput = { ...this.args.commandOutput, options: this.currentOptions };
        const streamArgs = { commandOutput, cacheDirectory, mashes };
        const output = new moviemasher_js.VideoStreamOutputClass(streamArgs);
        const videoRate = output.args.commandOutput.videoRate;
        const { pathPrefix, destination } = this;
        fs__default["default"].mkdirSync(pathPrefix, { recursive: true });
        try {
            if (this.command) {
                // console.log(this.constructor.name, "cut deleting existing command")
                runningCommandDelete(this.command.id);
                // this.command.removeAllListeners('error')
            }
            output.streamingDescription().then(streamingDescription => {
                const { commandOutput, inputs } = streamingDescription;
                // streams require at least one real input
                if (!inputs?.length) {
                    const input = {
                        source: './img/c.png', options: { r: videoRate, loop: 1 }
                    };
                    streamingDescription.inputs = [input];
                }
                // TODO: there shouldn't be any relative paths at this point, but we added one above!
                const prefix = '../example-express-react';
                streamingDescription.inputs?.forEach(input => {
                    const { source } = input;
                    if (!source)
                        throw 'no source';
                    if (!moviemasher_js.isString(source))
                        return;
                    if (source.includes('://'))
                        return;
                    const resolved = path__default["default"].resolve(prefix, source);
                    const url = `file://${resolved}`;
                    // console.log(this.constructor.name, "update resolved", source, 'to', url)
                    const exists = fs__default["default"].existsSync(source);
                    if (!exists) {
                        console.error(this.constructor.name, "could not find", source, url);
                        throw `NOT FOUND ${url}`;
                    }
                    input.source = url;
                });
                const commandOptions = {
                    ...streamingDescription, output: commandOutput
                };
                this.command = runningCommandInstance(idUnique(), commandOptions);
                this.command.addListener('error', this.error.bind(this));
                this.command.run(destination);
            });
        }
        catch (error) {
            console.error(this.constructor.name, "update CATCH", error);
            return { error: String(error) };
        }
        return {};
    }
    defaultContent() {
        const source = '../shared/image/favicon.ico';
        const contentId = 'image';
        const definitionObject = {
            source, id: contentId, type: moviemasher_js.DefinitionType.Image, url: source
        };
        const clip = { contentId, width: 0.2 };
        const mashObject = { tracks: [{ clips: [clip] }] };
        const definitionObjects = [definitionObject];
        const mashObjects = [mashObject];
        const args = { mashObjects, definitionObjects };
        return args;
    }
    get destination() { return `${this.pathPrefix}/${this.args.file}`; }
    error(error) {
        if (String(error).includes('SIGKILL')) {
            return;
        }
        console.error("StreamingProcessClass", "errorCallback", error);
        this.cut(this.defaultContent());
    }
    id;
    get currentOptions() {
        const { options, format } = this.args.commandOutput;
        if (format !== moviemasher_js.OutputFormat.Hls)
            return options;
        const { id, pathPrefix } = this;
        const hlsFile = directoryLatest(pathPrefix, moviemasher_js.ExtHls);
        if (hlsFile) {
            options.hls_flags ||= '';
            options.hls_flags += `${options.hls_flags ? '+' : ''}append_list`;
            const number = this.latestTsNumber;
            if (moviemasher_js.isNumber(number))
                options.start_number = number + 1;
        }
        const { hls_segment_filename } = options;
        if (moviemasher_js.isString(hls_segment_filename)) {
            if (!hls_segment_filename.includes('/')) {
                options.hls_segment_filename = `${pathPrefix}/${hls_segment_filename}`;
            }
        }
        return options;
    }
    get latestTsNumber() {
        const file = directoryLatest(this.pathPrefix, moviemasher_js.ExtTs);
        if (!file)
            return;
        return Number(path__default["default"].basename(file, `.${moviemasher_js.ExtTs}`));
    }
    get pathPrefix() { return path__default["default"].resolve(this.args.directory, this.id); }
    state;
    toJSON() {
        return { id: this.id, state: this.state };
    }
}

const connectionsById = new Map();
const callbacksByConnection = new Map();
const streamingProcessDeleteAll = () => {
    [...connectionsById.values()].forEach(instance => { streamingProcessDelete(instance); });
};
const streamingProcessCreate = (args) => {
    const connection = new StreamingProcessClass(args);
    const closedListener = () => { streamingProcessDelete(connection); };
    callbacksByConnection.set(connection, closedListener);
    connection.once('closed', closedListener);
    connectionsById.set(connection.id, connection);
    return connection;
};
const streamingProcessDelete = (connection) => {
    connectionsById.delete(connection.id);
    const closedListener = callbacksByConnection.get(connection);
    if (!closedListener)
        return;
    callbacksByConnection.delete(connection);
    connection.removeListener('closed', closedListener);
};
const streamingProcessGet = (id) => {
    return connectionsById.get(id) || null;
};
const StreamingProcessFactory = {
    deleteAll: streamingProcessDeleteAll,
    delete: streamingProcessDelete,
    get: streamingProcessGet,
    create: streamingProcessCreate,
};

const NodeMediaServer = require('node-media-server');
class StreamingServerClass extends ServerClass {
    args;
    constructor(args) {
        super(args);
        this.args = args;
    }
    cut = (req, res) => {
        const request = req.body;
        const { id, mashObjects, definitionObjects } = request;
        const streamingProcess = streamingProcessGet(id);
        if (!streamingProcess) {
            res.send({ error: 'stream not found' });
            return;
        }
        try {
            console.log(moviemasher_js.Endpoints.streaming.cut, 'request', request);
            const cutArgs = { definitionObjects, mashObjects };
            const updated = streamingProcess.cut(cutArgs);
            const response = updated;
            // console.log(Endpoints.streaming.cut, 'response', response)
            res.send(response);
        }
        catch (error) {
            res.send({ error: String(error) });
            console.error(error);
        }
    };
    delete = (req, res) => {
        const { id } = req.body;
        const connection = WebrtcConnection.getConnection(id);
        if (!connection) {
            res.send({ error: `no connection ${id}` });
            return;
        }
        connection.close();
        const response = {};
        res.send(response);
    };
    fileServer;
    local = (req, res) => {
        const { id } = req.body;
        const connection = WebrtcConnection.getConnection(id);
        if (!connection) {
            res.send({ error: `no connection ${id}` });
            return;
        }
        const { localDescription } = connection;
        if (!localDescription)
            return res.send({ error: `no localDescription for connection ${id}` });
        const description = connection.toJSON().localDescription;
        if (!description)
            return res.send({ error: `no local description for connection ${id}` });
        const response = { localDescription: description };
        res.send(response);
    };
    remote = async (req, res) => {
        const request = req.body;
        console.log(moviemasher_js.Endpoints.streaming.remote, 'request', request);
        const { id, localDescription } = request;
        const connection = WebrtcConnection.getConnection(id);
        if (!connection) {
            res.send({ error: `no connection ${id}` });
            return;
        }
        try {
            await connection.applyAnswer(localDescription);
            const { remoteDescription } = connection;
            if (!remoteDescription)
                return res.send({ error: `no remoteDescription for connection ${id}` });
            const description = connection.toJSON().remoteDescription;
            if (!description)
                return res.send({ error: `no remote description for connection ${id}` });
            const response = { localDescription: description };
            res.send(response);
        }
        catch (error) {
            res.send({ error: String(error) });
            console.error(error);
        }
    };
    id = 'streaming';
    preload = (req, res) => {
        req.body;
        const response = {};
        res.send(response);
    };
    // TODO: support other output besides HLS file
    start = (req, res) => {
        const request = req.body;
        console.log(moviemasher_js.Endpoints.streaming.start, 'request', request);
        const { width, height, videoRate, format } = request;
        const streamingFormat = format || moviemasher_js.StreamingFormat.Hls;
        const id = idUnique();
        const formatOptions = this.args.streamingFormatOptions[streamingFormat];
        const { commandOutput, directory, file } = formatOptions;
        const overrides = { ...commandOutput };
        if (width)
            overrides.width = width;
        if (height)
            overrides.height = height;
        if (videoRate)
            overrides.videoRate = videoRate;
        const streamingCommandOutput = moviemasher_js.outputDefaultStreaming(overrides);
        const { width: outputWidth, height: outputHeight, videoRate: outputVideoRate, options, } = streamingCommandOutput;
        const response = {
            width: outputWidth,
            height: outputHeight,
            videoRate: outputVideoRate,
            format: streamingFormat,
            id, readySeconds: 10
        };
        switch (streamingFormat) {
            case moviemasher_js.StreamingFormat.Hls: {
                const { hls_time } = options;
                if (moviemasher_js.isPositive(hls_time))
                    response.readySeconds = hls_time;
            }
        }
        try {
            const user = this.userFromRequest(req);
            const { cacheDirectory, temporaryDirectory } = this.args;
            const filePrefix = this.fileServer.args.uploadsPrefix;
            const streamingDirectory = directory;
            const streamingProcessArgs = {
                filePrefix, defaultDirectory: user, validDirectories: ['shared'],
                cacheDirectory, id, directory: streamingDirectory,
                file, commandOutput: streamingCommandOutput, temporaryDirectory
            };
            const connection = streamingProcessCreate(streamingProcessArgs);
            connection.cut(connection.defaultContent());
        }
        catch (error) {
            response.error = String(error);
        }
        res.send(response);
    };
    startMediaServer() {
        ({ app: this.args.appName });
        const { videoCodec, width, height, audioCodec, audioBitrate, audioChannels, audioRate, format } = this.args.streamingFormatOptions[moviemasher_js.StreamingFormat.Hls].commandOutput;
        // const flags = options && `[${Object.entries(options).map(([k, v]) => `${k}=${v}`).join(':')}]`
        switch (format) {
            case moviemasher_js.OutputFormat.Hls: {
                // if (flags) task.hlsFlags = flags
                break;
            }
            // case StreamingFormat.Rtmp: {
            //   task.rtmp = true
            //   task.rtmpApp = 'stream'
            //   break
            // }
            // case 'mp4': {
            //   task.dash = true
            //   if (flags) task.dashFlags = flags
            //   break // [f=dash:window_size=3:extra_window_size=5]
            // }
        }
        const acParam = [];
        if (audioBitrate)
            acParam.push('-ab', String(audioBitrate));
        if (audioChannels)
            acParam.push('-ac', String(audioChannels));
        if (audioRate)
            acParam.push('-ar', String(audioRate));
        const vcParam = [];
        if (width && height)
            vcParam.push('-s', `${width}x${height}`);
        const config = {
            // rtmp: this.args.rtmpOptions,
            http: this.args.httpOptions,
            // trans: {
            //   ffmpeg: '/usr/local/bin/ffmpeg',
            //   tasks: [task]
            // }
        };
        const nms = new NodeMediaServer(config);
        nms.run();
    }
    startServer(app, activeServers) {
        super.startServer(app, activeServers);
        this.fileServer = activeServers.file;
        app.post(moviemasher_js.Endpoints.streaming.start, this.start);
        app.post(moviemasher_js.Endpoints.streaming.preload, this.preload);
        app.post(moviemasher_js.Endpoints.streaming.status, this.status);
        app.post(moviemasher_js.Endpoints.streaming.cut, this.cut);
        app.post(moviemasher_js.Endpoints.streaming.local, this.local);
        app.post(moviemasher_js.Endpoints.streaming.remote, this.remote);
        app.post(moviemasher_js.Endpoints.streaming.webrtc, this.webrtc);
        app.post(moviemasher_js.Endpoints.streaming.delete, this.delete);
        app.get('/webrtc/:id', (req, res) => {
            // console.log('GET webrtc/:id')
            const { id } = req.params;
            const connection = WebrtcConnection.getConnection(id);
            if (!connection) {
                res.send({ error: `no connection ${id}` });
                return;
            }
            res.send(connection);
        });
        app.get(`/hls/:id/*.${moviemasher_js.ExtTs}`, async (req, res) => {
            const hlsFormatOptions = this.args.streamingFormatOptions.hls;
            const { params, path: requestPath } = req;
            const fileName = path__default["default"].basename(requestPath);
            const { id } = params;
            const file = `${hlsFormatOptions.directory}/${id}/${fileName}`;
            // console.log("file", file)
            try {
                res.send(fs__default["default"].readFileSync(file));
            }
            catch (error) {
                // console.error(error)
                res.sendStatus(500);
            }
        });
        app.get(`/hls/:id/*.${moviemasher_js.ExtHls}`, async (req, res) => {
            const { id } = req.params;
            const hlsFormatOptions = this.args.streamingFormatOptions.hls;
            try {
                const filePath = directoryLatest(path__default["default"].join(hlsFormatOptions.directory, id), moviemasher_js.ExtHls);
                if (!filePath) {
                    console.error(`404 /hls/:id/*.${moviemasher_js.ExtHls}`, id);
                    res.sendStatus(404);
                    return;
                }
                res.send(fs__default["default"].readFileSync(filePath));
            }
            catch (error) {
                console.error(error);
                res.sendStatus(500);
            }
        });
        this.startMediaServer();
    }
    status = (req, res) => {
        const { body } = req;
        const { id } = body;
        const response = {};
        const streamingProcess = streamingProcessGet(id);
        if (streamingProcess) {
            const { format } = streamingProcess.args.commandOutput;
            const streamingFormat = format;
            if (this.streamReady(id, streamingFormat)) {
                response.streamUrl = this.streamUrl(id, streamingFormat);
            }
        }
        else {
            response.error = 'stream not found';
        }
        res.send(response);
    };
    stopServer() { WebrtcConnection.close(); }
    streamReady(id, streamingFormat) {
        const formatOptions = this.args.streamingFormatOptions[streamingFormat];
        const paths = [];
        switch (streamingFormat) {
            case moviemasher_js.StreamingFormat.Hls: {
                paths.push(path__default["default"].resolve(formatOptions.directory, id, formatOptions.segmentFile));
                paths.push(path__default["default"].resolve(formatOptions.directory, id, formatOptions.file));
                break;
            }
            case moviemasher_js.StreamingFormat.Rtmp:
            default: {
                paths.push(path__default["default"].resolve(formatOptions.directory, id, formatOptions.file));
                break;
            }
        }
        if (!paths.length)
            return false;
        return paths.every(file => fs__default["default"].existsSync(file));
    }
    streamUrl(id, streamingFormat) {
        const formatOptions = this.args.streamingFormatOptions[streamingFormat];
        const { url, file } = formatOptions;
        return `${url}/${id}/${file}`;
    }
    webrtc = async (req, res) => {
        try {
            const request = req.body;
            console.log(moviemasher_js.Endpoints.streaming.webrtc, 'request', request);
            const hlsFormatOptions = this.args.streamingFormatOptions[moviemasher_js.StreamingFormat.Hls];
            const connection = WebrtcConnection.create(idUnique(), this.args.webrtcStreamingDir, hlsFormatOptions.commandOutput);
            await connection.doOffer();
            const { localDescription, id } = connection;
            if (!localDescription) {
                res.send({ error: 'could not create connection' });
                return;
            }
            const response = { localDescription, id };
            res.send(response);
        }
        catch (error) {
            res.send({ error: String(error) });
            console.error(error);
        }
    };
}

class WebServerClass extends ServerClass {
    args;
    constructor(args) {
        super(args);
        this.args = args;
    }
    startServer(app, activeServers) {
        super.startServer(app, activeServers);
        Object.entries(this.args.sources).forEach(([url, fileOrDir]) => {
            const resolved = path__default["default"].resolve(fileOrDir);
            const exists = fs__default["default"].existsSync(resolved);
            const directory = exists && fs__default["default"].lstatSync(resolved).isDirectory();
            if (!exists)
                throw `${this.constructor.name}.startServer ${resolved}`;
            const index = directory ? 'index.html' : path__default["default"].basename(resolved);
            const indexDir = directory ? resolved : path__default["default"].dirname(resolved);
            app.use(url, Express__default["default"].static(indexDir, { index }));
            console.debug(this.constructor.name, "serving", url, "from", indexDir, "with", index, "index");
        });
    }
}

class Host {
    constructor(object) { this.args = object; }
    args;
    start() {
        const { corsOptions, host, port, api, file, data, rendering, streaming, web } = this.args;
        const HostServers = {};
        if (api)
            HostServers[moviemasher_js.ServerType.Api] = new ApiServerClass(api);
        if (data)
            HostServers[moviemasher_js.ServerType.Data] = new DataServerClass(data);
        if (file)
            HostServers[moviemasher_js.ServerType.File] = new FileServerClass(file);
        if (rendering)
            HostServers[moviemasher_js.ServerType.Rendering] = new RenderingServerClass(rendering);
        if (streaming)
            HostServers[moviemasher_js.ServerType.Streaming] = new StreamingServerClass(streaming);
        if (web)
            HostServers[moviemasher_js.ServerType.Web] = new WebServerClass(web);
        const servers = Object.values(HostServers);
        if (!servers.length) {
            console.warn(this.constructor.name, "nothing configured");
            return;
        }
        const app = Express__default["default"]();
        app.use(Express__default["default"].json());
        if (corsOptions)
            app.use(cors__default["default"](corsOptions));
        servers.forEach(server => { server.startServer(app, HostServers); });
        const server = app.listen(port, host, () => { console.log(`Listening on port ${port}`); });
        server.once('close', () => { servers.forEach(server => server.stopServer()); });
    }
}

exports.ApiServerClass = ApiServerClass;
exports.Authenticator = Authenticator;
exports.BasenameCache = BasenameCache;
exports.BasenameDefinition = BasenameDefinition;
exports.BasenameRendering = BasenameRendering;
exports.DataServerClass = DataServerClass;
exports.Directory = Directory;
exports.ExtensionCommands = ExtensionCommands;
exports.ExtensionLoadedInfo = ExtensionLoadedInfo;
exports.FileServerClass = FileServerClass;
exports.FileServerFilename = FileServerFilename;
exports.Host = Host;
exports.HostDefaultOptions = HostDefaultOptions;
exports.HostDefaultPort = HostDefaultPort;
exports.NodeLoader = NodeLoader;
exports.Probe = Probe;
exports.RenderingProcessClass = RenderingProcessClass;
exports.RenderingServerClass = RenderingServerClass;
exports.RunningCommandClass = RunningCommandClass;
exports.ServerClass = ServerClass;
exports.StreamInput = StreamInput;
exports.StreamOutput = StreamOutput;
exports.StreamUnix = StreamUnix;
exports.StreamingProcessClass = StreamingProcessClass;
exports.StreamingProcessFactory = StreamingProcessFactory;
exports.StreamingServerClass = StreamingServerClass;
exports.WebServerClass = WebServerClass;
exports.WebrtcConnection = WebrtcConnection;
exports.commandArgsString = commandArgsString;
exports.commandErrors = commandErrors;
exports.commandExpandComplex = commandExpandComplex;
exports.commandInstance = commandInstance;
exports.commandPath = commandPath;
exports.commandProcess = commandProcess;
exports.commandQuoteComplex = commandQuoteComplex;
exports.definitionTypeFromRaw = definitionTypeFromRaw;
exports.directoryLatest = directoryLatest;
exports.expandCommand = expandCommand;
exports.expandFile = expandFile;
exports.expandFileOrScript = expandFileOrScript;
exports.expandPath = expandPath;
exports.expandToJson = expandToJson;
exports.idUnique = idUnique;
exports.renderingClipFromDefinition = renderingClipFromDefinition;
exports.renderingCommandOutputs = renderingCommandOutputs;
exports.renderingDefinitionObject = renderingDefinitionObject;
exports.renderingInput = renderingInput;
exports.renderingInputFromRaw = renderingInputFromRaw;
exports.renderingOutputFile = renderingOutputFile;
exports.renderingProcessInstance = renderingProcessInstance;
exports.renderingSource = renderingSource;
exports.runningCommandDelete = runningCommandDelete;
exports.runningCommandGet = runningCommandGet;
exports.runningCommandInstance = runningCommandInstance;
exports.streamingProcessCreate = streamingProcessCreate;
exports.streamingProcessDelete = streamingProcessDelete;
exports.streamingProcessDeleteAll = streamingProcessDeleteAll;
exports.streamingProcessGet = streamingProcessGet;
