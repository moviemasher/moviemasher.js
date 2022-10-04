"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateTest = exports.generateTests = exports.generateIds = exports.GenerateDefinitionObjects = exports.generateArgsStatic = exports.generateArgsDynamic = exports.GenerateTestsDefault = exports.GenerateOptionsDefault = exports.generateTestArgs = exports.GenerateDelimiter = exports.GenerateIdDelimiter = exports.GenerateArgs = exports.GenerateArg = exports.isGenerateOpacity = exports.isGenerateConstrain = exports.isGenerateSize = exports.isGeneratePoint = void 0;
const moviemasher_js_1 = require("@moviemasher/moviemasher.js");
var GeneratePoint;
(function (GeneratePoint) {
    GeneratePoint["TL"] = "TL";
    GeneratePoint["BR"] = "BR";
    GeneratePoint["TR"] = "TR";
    GeneratePoint["BL"] = "BL";
    GeneratePoint["M"] = "M";
})(GeneratePoint || (GeneratePoint = {}));
const GeneratePoints = Object.values(GeneratePoint);
const isGeneratePoint = (value) => {
    return (0, moviemasher_js_1.isPopulatedString)(value) && GeneratePoints.includes(value);
};
exports.isGeneratePoint = isGeneratePoint;
var GenerateSize;
(function (GenerateSize) {
    GenerateSize["H"] = "H";
    GenerateSize["F"] = "F";
    GenerateSize["D"] = "D";
    GenerateSize["Q"] = "Q";
    GenerateSize["Z"] = "Z";
})(GenerateSize || (GenerateSize = {}));
const GenerateSizes = Object.values(GenerateSize);
const isGenerateSize = (value) => {
    return (0, moviemasher_js_1.isPopulatedString)(value) && GenerateSizes.includes(value);
};
exports.isGenerateSize = isGenerateSize;
var GenerateConstrain;
(function (GenerateConstrain) {
    GenerateConstrain["C"] = "C";
    GenerateConstrain["U"] = "U";
})(GenerateConstrain || (GenerateConstrain = {}));
const GenerateConstrains = Object.values(GenerateConstrain);
const isGenerateConstrain = (value) => {
    return (0, moviemasher_js_1.isPopulatedString)(value) && GenerateConstrains.includes(value);
};
exports.isGenerateConstrain = isGenerateConstrain;
var GenerateOpacity;
(function (GenerateOpacity) {
    GenerateOpacity["H"] = "50";
    GenerateOpacity["F"] = "100";
    GenerateOpacity["Z"] = "0";
})(GenerateOpacity || (GenerateOpacity = {}));
const GenerateOpacities = Object.values(GenerateOpacity);
const isGenerateOpacity = (value) => {
    return (0, moviemasher_js_1.isPopulatedString)(value) && GenerateOpacities.includes(value);
};
exports.isGenerateOpacity = isGenerateOpacity;
var GenerateArg;
(function (GenerateArg) {
    GenerateArg["Content"] = "content";
    GenerateArg["Container"] = "container";
    GenerateArg["ContentSize"] = "contentSize";
    GenerateArg["ContentPoint"] = "contentPoint";
    GenerateArg["ContainerSize"] = "containerSize";
    GenerateArg["ContainerPoint"] = "containerPoint";
    GenerateArg["Opacity"] = "opacity";
    GenerateArg["Constrain"] = "constrain";
})(GenerateArg = exports.GenerateArg || (exports.GenerateArg = {}));
exports.GenerateArgs = Object.values(GenerateArg);
const textOptions = {
    string: "Valken",
    intrinsic: { width: 3375, height: 1000, x: 130, y: 0 },
    fontId: "font.valken"
};
const isRenderTest = (value) => {
    return (0, moviemasher_js_1.isPopulatedArray)(value) && (0, moviemasher_js_1.isString)(value[0]);
};
function assertRenderTest(value) {
    if (!isRenderTest(value))
        (0, moviemasher_js_1.throwError)(value, 'RenderTest');
}
const GenerateTweenDelimiter = '-';
exports.GenerateIdDelimiter = '_';
exports.GenerateDelimiter = 'in';
const MashPointsDefault = {
    [GeneratePoint.TL]: { x: 0, y: 0 },
    [GeneratePoint.TR]: { x: 1, y: 0 },
    [GeneratePoint.BR]: { x: 1, y: 1 },
    [GeneratePoint.BL]: { x: 0, y: 1 },
    [GeneratePoint.M]: { x: 0.5, y: 0.5 },
};
const MashSizesDefault = {
    [GenerateSize.Z]: { width: 0, height: 0 },
    [GenerateSize.F]: { width: 1, height: 1 },
    [GenerateSize.D]: { width: 2, height: 2 },
    [GenerateSize.Q]: { width: 0.25, height: 0.25 },
    [GenerateSize.H]: { width: 0.5, height: 0.5 },
};
const MashOpacityDefault = {
    [GenerateOpacity.F]: { opacity: 1 },
    [GenerateOpacity.H]: { opacity: 0.5 },
    [GenerateOpacity.Z]: { opacity: 0.0 },
};
const generateClips = (testId, size = moviemasher_js_1.SizePreview, frames = moviemasher_js_1.Duration.Unknown, labels = false) => {
    const generateOptions = (0, exports.generateTestArgs)(testId);
    const renderTestObject = Object.fromEntries(exports.GenerateArgs.map(renderTestOption => {
        const option = generateOptions[renderTestOption];
        (0, moviemasher_js_1.assertPopulatedString)(option);
        const renderTests = exports.GenerateTestsDefault[renderTestOption];
        const renderTest = renderTests.find(test => test[0] === option);
        assertRenderTest(renderTest);
        return [renderTestOption, renderTest];
    }));
    const { content: [contentLabel, contentId, contentObject], contentPoint: [contentPointName, contentPoint], contentSize: [contentDimensionName, contentDimensions], container: [containerLabel, containerId, containerObject], containerPoint: [containerPointName, containerPoint], containerSize: [containerDimensionName, containerDimensions], constrain: [constrainedLabel, constrained], opacity: [opacityLabel, opacity], } = renderTestObject;
    const { width, height } = size;
    const textHeight = 0.1;
    const debug = {
        fontId: 'font.valken', height: textHeight,
        x: 0, y: 0.5, lock: 'H',
        intrinsic: { x: 0, y: 0, width: width / textHeight, height }
    };
    const debugClip = {
        containerId: 'com.moviemasher.container.text',
        content: { color: moviemasher_js_1.colorBlack },
        sizing: 'preview',
        timing: 'custom',
        frames,
        definitionId: moviemasher_js_1.clipDefault.id,
    };
    (0, moviemasher_js_1.assertPoint)(containerPoint);
    (0, moviemasher_js_1.assertPoint)(contentPoint);
    const clip = {
        frames, containerId, contentId,
        definitionId: moviemasher_js_1.clipDefault.id,
        content: {
            ...contentPoint, ...contentDimensions, ...contentObject,
            lock: ''
        },
        container: {
            ...containerPoint, ...containerDimensions,
            ...containerObject, ...opacity,
            ...constrained,
        }
    };
    const objects = [clip];
    if (labels) {
        const labelClip = {
            ...debugClip, container: { ...debug, string: testId }
        };
        objects.push(labelClip);
    }
    return objects;
};
const pointsContainerObject = (...points) => {
    const [point, pointEnd] = points;
    (0, moviemasher_js_1.assertPoint)(point);
    if (!(0, moviemasher_js_1.isPoint)(pointEnd))
        return { ...point };
    return { ...point, xEnd: pointEnd.x, yEnd: pointEnd.y };
};
const pointTest = (...mashPoints) => {
    const points = mashPoints.map(mashPoint => MashPointsDefault[mashPoint]);
    return [mashPoints.join(GenerateTweenDelimiter), pointsContainerObject(...points)];
};
const opacitiesContainerObject = (...opacities) => {
    const [opacity, opacityEnd] = opacities;
    (0, moviemasher_js_1.assertContainerObject)(opacity);
    if (!(0, moviemasher_js_1.isContainerObject)(opacityEnd))
        return { ...opacity };
    return { ...opacity, opacityEnd: opacityEnd.opacity };
};
const opacityTest = (...mashOpacity) => {
    const opacities = mashOpacity.map(mashPoint => MashOpacityDefault[mashPoint]);
    return [mashOpacity.join(GenerateTweenDelimiter), opacitiesContainerObject(...opacities)];
};
const sizesContainerObject = (...sizes) => {
    const [size, sizeEnd] = sizes;
    (0, moviemasher_js_1.assertSize)(size);
    if (!(0, moviemasher_js_1.isSize)(sizeEnd))
        return { ...size };
    return { ...size, widthEnd: sizeEnd.width, heightEnd: sizeEnd.height };
};
const sizeTest = (...mashSizes) => {
    const sizes = mashSizes.map(mashSize => MashSizesDefault[mashSize]);
    return [mashSizes.join(GenerateTweenDelimiter), sizesContainerObject(...sizes)];
};
const generateTestArgs = (id) => {
    const delimiter = [exports.GenerateIdDelimiter, exports.GenerateDelimiter, exports.GenerateIdDelimiter].join('');
    const [contentIds, containerIds] = id.split(delimiter);
    const [content, contentPoint = GeneratePoint.M, contentSize = GenerateSize.F] = contentIds.split(exports.GenerateIdDelimiter);
    const [container, constrain, containerPoint, containerSize, opacity] = containerIds.split(exports.GenerateIdDelimiter);
    return {
        content, contentPoint, contentSize,
        container, constrain, containerPoint, containerSize, opacity
    };
};
exports.generateTestArgs = generateTestArgs;
exports.GenerateOptionsDefault = {
    container: "R", containerPoint: GeneratePoint.M, containerSize: GenerateSize.F,
    content: "BL", contentPoint: GeneratePoint.TL, contentSize: GenerateSize.F,
    constrain: GenerateConstrain.C, opacity: GenerateOpacity.F,
};
exports.GenerateTestsDefault = {
    [GenerateArg.Container]: [
        ["R", 'com.moviemasher.container.default', {}],
        ["K", "kitten", {}],
        // ["S", 'com.moviemasher.container.test', {}],
        // ["B", 'com.moviemasher.container.broadcast', {}],
        ["S", 'com.moviemasher.container.chat', {}],
        ["T", 'com.moviemasher.container.text', textOptions],
        // ["P", "puppy" , {}],
    ],
    [GenerateArg.Content]: [
        ["BL", "com.moviemasher.content.default", { color: moviemasher_js_1.colorBlue }],
        ["P", "puppy", {}],
        ["RGB", "rgb", {}],
        ["V", "video", {}],
        // ["BK", "com.moviemasher.content.default", { color: colorBlack }],
        // ["RE", "com.moviemasher.content.default", { color: colorRed }],
        // ["WH", "com.moviemasher.content.default", { color: colorWhite }],
        ["BL-RE", "com.moviemasher.content.default", { colorEnd: moviemasher_js_1.colorRed, color: moviemasher_js_1.colorBlue }],
        // ["K", "kitten", {}],
    ],
    [GenerateArg.ContainerPoint]: [
        pointTest(GeneratePoint.TL),
        pointTest(GeneratePoint.TL, GeneratePoint.BR),
        pointTest(GeneratePoint.BR, GeneratePoint.M),
        pointTest(GeneratePoint.M),
    ],
    [GenerateArg.ContentPoint]: [
        pointTest(GeneratePoint.TL),
        pointTest(GeneratePoint.TL, GeneratePoint.BR),
        pointTest(GeneratePoint.BR, GeneratePoint.M),
        pointTest(GeneratePoint.M),
    ],
    [GenerateArg.ContainerSize]: [
        sizeTest(GenerateSize.F),
        sizeTest(GenerateSize.Q),
        sizeTest(GenerateSize.Q, GenerateSize.F),
        sizeTest(GenerateSize.F, GenerateSize.H),
        sizeTest(GenerateSize.H),
    ],
    [GenerateArg.ContentSize]: [
        sizeTest(GenerateSize.F),
        sizeTest(GenerateSize.F, GenerateSize.D),
        sizeTest(GenerateSize.D, GenerateSize.F),
    ],
    [GenerateArg.Opacity]: [
        opacityTest(GenerateOpacity.F),
        opacityTest(GenerateOpacity.F, GenerateOpacity.Z),
        opacityTest(GenerateOpacity.H),
    ],
    [GenerateArg.Constrain]: [
        [GenerateConstrain.C, {}],
        [GenerateConstrain.U, Object.fromEntries(moviemasher_js_1.Directions.map(direction => [`off${direction}`, true]))]
    ],
};
const generateArgsDynamic = (renderTestOption) => {
    const tests = exports.GenerateTestsDefault[renderTestOption];
    const tweenTests = tests.filter(test => test[0].includes(GenerateTweenDelimiter));
    return tweenTests.map(test => test[0]);
};
exports.generateArgsDynamic = generateArgsDynamic;
const generateArgsStatic = (renderTestOption) => {
    const tests = exports.GenerateTestsDefault[renderTestOption];
    const tweenTests = tests.filter(test => !test[0].includes(GenerateTweenDelimiter));
    return tweenTests.map(test => test[0]);
};
exports.generateArgsStatic = generateArgsStatic;
exports.GenerateDefinitionObjects = [
    {
        "id": "puppy",
        "type": "image",
        "source": "../shared/image/puppy/image.jpg",
        "width": 3024, "height": 4032
    },
    {
        "id": "rgb",
        "type": "video",
        "source": "../shared/video/rgb.mp4",
    },
    {
        "id": "kitten",
        "type": "image",
        "source": "../shared/image/kitten/image.jpg",
        "width": 4592, "height": 3056
    },
    {
        "id": "font.valken",
        "type": "font",
        "label": "Valken",
        "url": "../shared/font/valken/valken.woff2",
        "source": "../shared/font/valken/valken.ttf"
    },
    {
        "type": "video",
        "label": "Video", "id": "video",
        "url": "../shared/video/dance.mp4",
        "source": "../shared/video/dance.mp4"
    }
];
const generateIds = (generateOptions = {}) => {
    const limitedOptions = (option, ids) => {
        const renderTests = exports.GenerateTestsDefault[option];
        const idsOrNot = ids || generateOptions[option];
        const idArray = (0, moviemasher_js_1.isPopulatedString)(idsOrNot) ? [idsOrNot] : idsOrNot;
        if (!(0, moviemasher_js_1.isPopulatedArray)(idArray))
            return renderTests;
        return renderTests.filter(renderTest => idArray.includes(String(renderTest[0])));
    };
    const mashIds = [];
    const limitedContents = limitedOptions(GenerateArg.Content);
    (0, moviemasher_js_1.assertPopulatedArray)(limitedContents, 'limitedContents');
    limitedContents.forEach(([contentLabel, contentId]) => {
        const isColor = contentId === "com.moviemasher.content.default";
        const limitedContainers = limitedOptions(GenerateArg.Container);
        (0, moviemasher_js_1.assertPopulatedArray)(limitedContainers, 'limitedContainers');
        limitedContainers.forEach(([containerLabel]) => {
            const limitedContainerPoints = limitedOptions(GenerateArg.ContainerPoint);
            const point = isColor ? GeneratePoint.M : undefined;
            const limitedContentPoints = limitedOptions(GenerateArg.ContentPoint, point);
            (0, moviemasher_js_1.assertPopulatedArray)(limitedContentPoints, 'limitedContentPoints');
            limitedContentPoints.forEach(([contentPointName]) => {
                const size = isColor ? GenerateSize.F : undefined;
                const limitedContentSizes = limitedOptions(GenerateArg.ContentSize, size);
                (0, moviemasher_js_1.assertPopulatedArray)(limitedContentSizes, 'limitedContentSizes');
                limitedContentSizes.forEach(([contentDimensionName]) => {
                    const limitedOpacities = limitedOptions(GenerateArg.Opacity);
                    (0, moviemasher_js_1.assertPopulatedArray)(limitedOpacities, 'limitedOpacities');
                    limitedOpacities.forEach(([opacityLabel]) => {
                        const limitedContainerSizes = limitedOptions(GenerateArg.ContainerSize);
                        (0, moviemasher_js_1.assertPopulatedArray)(limitedContainerSizes, 'limitedContainerSizes');
                        limitedContainerSizes.forEach(([containerDimensionName]) => {
                            (0, moviemasher_js_1.assertPopulatedArray)(limitedContainerPoints, 'limitedContainerPoints');
                            limitedContainerPoints.forEach(([containerPointName]) => {
                                const containerCentered = containerPointName === GeneratePoint.M;
                                const constrain = containerCentered ? GenerateConstrain.U : undefined;
                                const limitedConstrains = limitedOptions(GenerateArg.Constrain, constrain);
                                limitedConstrains.forEach(([constrainedLabel]) => {
                                    const names = [contentLabel];
                                    if (!isColor)
                                        names.push(contentPointName, contentDimensionName);
                                    names.push(exports.GenerateDelimiter, containerLabel);
                                    names.push(constrainedLabel, containerPointName, containerDimensionName, opacityLabel);
                                    const testId = names.join(exports.GenerateIdDelimiter);
                                    (0, moviemasher_js_1.assertPopulatedString)(testId);
                                    mashIds.push(testId);
                                });
                            });
                        });
                    });
                });
            });
        });
    });
    return mashIds;
};
exports.generateIds = generateIds;
const generateTests = (generateOptions, testId = 'all', size = moviemasher_js_1.SizePreview, frames = 10, labels = false) => {
    const ids = (0, exports.generateIds)(generateOptions);
    const clips = [];
    const labelClips = [];
    ids.forEach(id => {
        const [clip, labelClip] = generateClips(id, size, frames, labels);
        clips.push(clip);
        if (labelClip)
            labelClips.push(labelClip);
    });
    const tracks = [{ clips }];
    if (labels)
        tracks.push({ clips: labelClips, dense: true });
    const mash = {
        id: testId, backcolor: '#666666', tracks
    };
    return [testId, mash];
};
exports.generateTests = generateTests;
const generateTest = (testId, size = moviemasher_js_1.SizePreview, frames = moviemasher_js_1.Duration.Unknown, labels = false) => {
    const [clip, labelClip] = generateClips(testId, size, frames, labels);
    const tracks = [{ clips: [clip] }];
    if (labelClip)
        tracks.push({ clips: [labelClip], dense: true });
    const mash = {
        id: testId, backcolor: '#666666', tracks
    };
    return [testId, mash];
};
exports.generateTest = generateTest;
