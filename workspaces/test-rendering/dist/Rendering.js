"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.renderingTestIdPromise = exports.renderingTestPromise = exports.renderingMashTestPromise = exports.renderingProcessArgs = exports.renderingProcessInput = exports.renderingTestIdsPromise = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const moviemasher_js_1 = require("@moviemasher/moviemasher.js/umd/moviemasher.js");
const server_express_1 = require("@moviemasher/server-express");
const Generate_1 = require("./Generate");
const TestRenderOutput_1 = require("./TestRenderOutput");
const renderingTestIdsPromise = (ids, suffix, output) => {
    const id = `all-${suffix}`;
    const fileName = (0, server_express_1.renderingOutputFile)(0, output);
    const sources = ids.map(id => {
        const resolved = path_1.default.resolve(path_1.default.join(TestRenderOutput_1.TestRenderOutput, id, fileName));
        (0, moviemasher_js_1.assertTrue)(fs_1.default.existsSync(resolved), resolved);
        return resolved;
    });
    const destination = path_1.default.resolve(path_1.default.join(TestRenderOutput_1.TestRenderOutput, id, fileName));
    // console.log("renderingTestIdsPromise", sources.length, destination)
    if (!sources.length)
        return Promise.resolve();
    return fs_1.default.promises.mkdir(path_1.default.dirname(destination), { recursive: true }).then(() => {
        return new Promise((resolve, reject) => {
            const command = (0, server_express_1.commandProcess)();
            command.on('error', (...args) => {
                reject({ error: args.join(",") });
            });
            command.on('end', () => { resolve(); });
            try {
                sources.forEach(source => command.mergeAdd(source));
                command.mergeToFile(destination);
            }
            catch (error) {
                reject({ error });
            }
        }).then(() => {
            const dirName = path_1.default.dirname(destination);
            const extName = path_1.default.extname(destination);
            const baseName = path_1.default.basename(destination, extName);
            const infoPath = path_1.default.join(dirName, `${baseName}.${server_express_1.ExtensionLoadedInfo}`);
            return server_express_1.Probe.promise(TestRenderOutput_1.TestTemporary, destination, infoPath).then(moviemasher_js_1.EmptyMethod);
        });
    });
};
exports.renderingTestIdsPromise = renderingTestIdsPromise;
const renderingPromise = (renderingArgs) => {
    // const { outputs } = renderingArgs
    // console.log("renderingPromise", renderingArgs)
    const renderingProcess = (0, server_express_1.renderingProcessInstance)(renderingArgs);
    // console.log("renderingPromise calling runPromise")
    const runPromise = renderingProcess.runPromise();
    const checkPromise = runPromise.then(runResult => {
        const { results } = runResult;
        results.forEach(result => {
            const { destination, error } = result;
            (0, moviemasher_js_1.assertTrue)(!error, 'no render error');
            if ((0, moviemasher_js_1.isPopulatedString)(destination)) {
                const fileExists = renderingFileExists(destination);
                (0, moviemasher_js_1.assertTrue)(fileExists, destination);
            }
        });
    });
    return checkPromise.catch(result => {
        const error = (0, moviemasher_js_1.isObject)(result) ? result.error : result;
        const errorMessage = (0, moviemasher_js_1.isPopulatedString)(error) ? error : String(result);
        if (errorMessage)
            console.trace("errorMessage", errorMessage);
        (0, moviemasher_js_1.assertTrue)(!errorMessage, 'no caught error');
    });
};
const renderingFilePath = (path) => {
    const regExp = /%0([0-9])d/;
    const matches = path.match(regExp);
    if (matches) {
        return path.replace(regExp, '0'.repeat(Number(matches[1]) - 1) + '1');
    }
    return path;
};
const renderingFileExists = (filePath) => {
    const checkPath = renderingFilePath(filePath);
    const fileExists = fs_1.default.existsSync(checkPath);
    return fileExists;
};
const renderingProcessInput = (id) => {
    return {
        cacheDirectory: TestRenderOutput_1.TestRenderCache,
        outputDirectory: `${TestRenderOutput_1.TestRenderOutput}/${id}`,
        filePrefix: TestRenderOutput_1.TestFilePrefix,
        defaultDirectory: 'shared',
        validDirectories: [path_1.default.resolve(TestRenderOutput_1.TestRenderOutput)],
    };
};
exports.renderingProcessInput = renderingProcessInput;
const renderingProcessArgs = (id) => {
    const options = {
        mash: {}, outputs: [], definitions: [], upload: false
    };
    const definedId = id || (0, moviemasher_js_1.idGenerateString)();
    const testArgs = (0, exports.renderingProcessInput)(definedId);
    const args = {
        ...testArgs, ...options, id: definedId,
        temporaryDirectory: TestRenderOutput_1.TestTemporary,
    };
    return args;
};
exports.renderingProcessArgs = renderingProcessArgs;
const renderingMashTestPromise = (mashTest, upload, ...outputs) => {
    const [id, mashObject] = mashTest;
    const { tracks } = mashObject;
    (0, moviemasher_js_1.assertPopulatedArray)(tracks);
    const { clips } = tracks[0];
    (0, moviemasher_js_1.assertPopulatedArray)(clips);
    const options = {
        mash: mashObject, definitions: Generate_1.GenerateDefinitionObjects,
        outputs, upload
    };
    const input = (0, exports.renderingProcessInput)(id);
    const processArgs = {
        temporaryDirectory: TestRenderOutput_1.TestTemporary,
        ...input, id, ...options
    };
    return renderingPromise(processArgs);
};
exports.renderingMashTestPromise = renderingMashTestPromise;
const renderingTestPromise = (suffix, options, output) => {
    let promise = Promise.resolve();
    const ids = (0, Generate_1.generateIds)(options);
    ids.forEach(id => {
        promise = promise.then(() => { return (0, exports.renderingTestIdPromise)(id, output); });
    });
    promise = promise.then(() => {
        return (0, exports.renderingTestIdsPromise)(ids, suffix, output);
    });
    return promise;
};
exports.renderingTestPromise = renderingTestPromise;
const renderingTestIdPromise = (id, videoOutput, labels = false, duration = moviemasher_js_1.Duration.Unknown) => {
    (0, moviemasher_js_1.assertPopulatedString)(id);
    const mashTest = (0, Generate_1.generateTest)(id, moviemasher_js_1.SizePreview, duration, labels);
    return (0, exports.renderingMashTestPromise)(mashTest, false, videoOutput);
};
exports.renderingTestIdPromise = renderingTestIdPromise;
