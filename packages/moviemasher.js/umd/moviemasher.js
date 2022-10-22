(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.MovieMasher = {}));
})(this, (function (exports) { 'use strict';

  const isCustomEvent = (value) => (value instanceof CustomEvent);

  const throwError = (value, expected, name = "value") => {
      const type = typeof value;
      const typeName = type === 'object' ? value.constructor.name : type;
      console.error("throwError", value);
      throw new Error(`${name} is "${value}" (${typeName}) instead of ${expected}`);
  };

  const isObject = (value) => typeof value === 'object';
  function assertObject(value, name) {
      if (!isObject(value))
          throwError(value, 'Object', name);
  }
  const isString = (value) => (typeof value === 'string');
  function assertString(value, name) {
      if (!isString(value))
          throwError(value, 'String', name);
  }
  const isUndefined = (value) => typeof value === 'undefined';
  const isNumberOrNaN = (value) => typeof value === 'number';
  function assertNumber(value, name) {
      if (!isNumberOrNaN(value))
          throwError(value, 'Number', name);
  }
  const isBoolean = (value) => typeof value === 'boolean';
  function assertBoolean(value, name) {
      if (!isBoolean(value))
          throwError(value, "Boolean", name);
  }
  const isMethod = (value) => typeof value === 'function';
  const isDefined = (value) => !isUndefined(value);
  function assertDefined(value, name) {
      if (!isDefined(value))
          throwError(value, 'defined', name);
  }
  const isNan = (value) => isNumberOrNaN(value) && Number.isNaN(value);
  const isNumber = (value) => isNumberOrNaN(value) && !Number.isNaN(value);
  const isInteger = (value) => Number.isInteger(value);
  const isFloat = (value) => isNumber(value) && !isInteger(value);
  const isPositive = (value) => isNumber(value) && value >= 0;
  function assertPositive(value, name) {
      if (!isPositive(value))
          throwError(value, '>= 0', name);
  }
  const isBelowOne = (value) => isNumber(value) && value < 1;
  const isAboveZero = (value) => isNumber(value) && value > 0;
  function assertAboveZero(value, name) {
      if (!isAboveZero(value))
          throwError(value, '> zero', name);
  }
  const isArray = (value) => (isDefined(Array.isArray) ? Array.isArray(value) : value instanceof Array);
  function assertArray(value, name) {
      if (!isArray(value))
          throwError(value, 'Array', name);
  }
  const length = (value) => !!value.length;
  const isPopulatedString = (value) => isString(value) && length(String(value));
  function assertPopulatedString(value, name = 'value') {
      if (!isPopulatedString(value))
          throwError(value, 'populated string', name);
  }
  const isPopulatedArray = (value) => (isArray(value) && length(value));
  function assertPopulatedArray(value, name = 'value') {
      if (!isPopulatedArray(value))
          throwError(value, 'populated array', name);
  }
  const isPopulatedObject = (value) => (isObject(value) && length(Object.keys(value)));
  function assertPopulatedObject(value, name = 'value') {
      if (!isPopulatedObject(value))
          throwError(value, 'populated array', name);
  }
  const isNumeric = (value) => ((isNumber(value) || isPopulatedString(value)) && !isNan(Number(value)));
  function assertTrue(value, name = 'value') {
      if (!value)
          throwError(value, 'true', name);
  }
  const isRgb = (value) => {
      return isObject(value) && "r" in value && "g" in value && "b" in value;
  };
  function assertRgb(value, name) {
      if (!isRgb(value))
          throwError(value, 'Rgb', name);
  }
  const isTime = (value) => {
      return isObject(value) && "isRange" in value;
  };
  function assertTime(value, name) {
      if (!isTime(value))
          throwError(value, "Time", name);
  }
  const isTimeRange = (value) => {
      return isTime(value) && value.isRange;
  };
  function assertTimeRange(value, name) {
      if (!isTimeRange(value))
          throwError(value, "TimeRange", name);
  }
  const isValue = (value) => {
      return isNumber(value) || isString(value);
  };
  const isTrueValue = (value) => {
      if (!isValue(value))
          return false;
      if (isNumeric(value))
          return !!Number(value);
      return isPopulatedString(value);
  };
  function assertValue(value, name) {
      if (!isValue(value))
          throwError(value, "Value", name);
  }
  const isValueObject = (value) => {
      return isObject(value) && Object.values(value).every(value => isValue(value));
  };
  function assertValueObject(value, name) {
      if (!isValueObject(value))
          throwError(value, "ValueObject", name);
  }

  exports.DroppingPosition = void 0;
  (function (DroppingPosition) {
      DroppingPosition["At"] = "at";
      DroppingPosition["After"] = "after";
      DroppingPosition["Before"] = "before";
      DroppingPosition["None"] = "none";
  })(exports.DroppingPosition || (exports.DroppingPosition = {}));
  exports.LayerType = void 0;
  (function (LayerType) {
      LayerType["Mash"] = "mash";
      LayerType["Folder"] = "folder";
  })(exports.LayerType || (exports.LayerType = {}));
  const LayerTypes = Object.values(exports.LayerType);
  const isLayerType = (value) => {
      return LayerTypes.includes(value);
  };
  function assertLayerType(value) {
      if (!isLayerType(value))
          throw new Error('expected LayerType');
  }
  exports.ActionType = void 0;
  (function (ActionType) {
      ActionType["AddClipToTrack"] = "addClipToTrack";
      ActionType["AddEffect"] = "addEffect";
      ActionType["AddLayer"] = "addLayer";
      ActionType["AddTrack"] = "addTrack";
      ActionType["Change"] = "change";
      ActionType["ChangeMultiple"] = "changeMultiple";
      ActionType["ChangeFrame"] = "changeFrame";
      ActionType["ChangeGain"] = "changeGain";
      ActionType["MoveClip"] = "moveClip";
      ActionType["MoveEffect"] = "moveEffect";
      ActionType["MoveLayer"] = "moveLayer";
      ActionType["RemoveClip"] = "removeClip";
      ActionType["RemoveLayer"] = "removeLayer";
  })(exports.ActionType || (exports.ActionType = {}));
  exports.EditType = void 0;
  (function (EditType) {
      EditType["Mash"] = "mash";
      EditType["Cast"] = "cast";
  })(exports.EditType || (exports.EditType = {}));
  const EditTypes = Object.values(exports.EditType);
  const isEditType = (value) => {
      return EditTypes.includes(value);
  };
  function assertEditType(value, name) {
      if (!isEditType(value))
          throwError(value, 'EditType', name);
  }
  exports.AVType = void 0;
  (function (AVType) {
      AVType["Audio"] = "audio";
      AVType["Both"] = "both";
      AVType["Video"] = "video";
  })(exports.AVType || (exports.AVType = {}));
  exports.SelectType = void 0;
  (function (SelectType) {
      SelectType["Cast"] = "cast";
      SelectType["Clip"] = "clip";
      SelectType["Container"] = "container";
      SelectType["Content"] = "content";
      SelectType["Effect"] = "effect";
      SelectType["Layer"] = "layer";
      SelectType["Mash"] = "mash";
      SelectType["None"] = "none";
      SelectType["Track"] = "track";
  })(exports.SelectType || (exports.SelectType = {}));
  const SelectTypes = Object.values(exports.SelectType);
  const isSelectType = (value) => {
      return SelectTypes.includes(value);
  };
  function assertSelectType(value, name) {
      if (!isSelectType(value))
          throwError(value, 'SelectType', name);
  }
  const ClipSelectTypes = [exports.SelectType.Content, exports.SelectType.Container];
  const isClipSelectType = (type) => {
      return isSelectType(type) && ClipSelectTypes.includes(type);
  };
  exports.OutputFormat = void 0;
  (function (OutputFormat) {
      OutputFormat["AudioConcat"] = "wav";
      OutputFormat["Flv"] = "flv";
      OutputFormat["Hls"] = "hls";
      OutputFormat["Jpeg"] = "jpeg";
      OutputFormat["Mdash"] = "mdash";
      OutputFormat["Mp3"] = "mp3";
      OutputFormat["Mp4"] = "mp4";
      OutputFormat["Png"] = "image2";
      OutputFormat["Rtmp"] = "rtmp";
      OutputFormat["VideoConcat"] = "yuv4mpegpipe";
  })(exports.OutputFormat || (exports.OutputFormat = {}));
  exports.StreamingFormat = void 0;
  (function (StreamingFormat) {
      StreamingFormat["Hls"] = "hls";
      StreamingFormat["Mdash"] = "mdash";
      StreamingFormat["Rtmp"] = "rtmp";
  })(exports.StreamingFormat || (exports.StreamingFormat = {}));
  exports.OutputType = void 0;
  (function (OutputType) {
      OutputType["Audio"] = "audio";
      OutputType["Image"] = "image";
      OutputType["ImageSequence"] = "imagesequence";
      OutputType["Video"] = "video";
      OutputType["Waveform"] = "waveform";
  })(exports.OutputType || (exports.OutputType = {}));
  const OutputTypes = Object.values(exports.OutputType);
  exports.FillType = void 0;
  (function (FillType) {
      FillType["Color"] = "color";
      FillType["Fill"] = "fill";
  })(exports.FillType || (exports.FillType = {}));
  const FillTypes = Object.values(exports.FillType);
  const isFillType = (type) => {
      return FillTypes.includes(type);
  };
  exports.GraphFileType = void 0;
  (function (GraphFileType) {
      GraphFileType["Svg"] = "svg";
      GraphFileType["SvgSequence"] = "svgsequence";
      GraphFileType["Txt"] = "txt";
      // Object = 'object'
  })(exports.GraphFileType || (exports.GraphFileType = {}));
  const GraphFileTypes = Object.values(exports.GraphFileType);
  const isGraphFileType = (type) => {
      return isPopulatedString(type) && GraphFileTypes.includes(type);
  };
  exports.LoadType = void 0;
  (function (LoadType) {
      LoadType["Audio"] = "audio";
      LoadType["Font"] = "font";
      LoadType["Image"] = "image";
      LoadType["Video"] = "video";
  })(exports.LoadType || (exports.LoadType = {}));
  const LoadTypes = Object.values(exports.LoadType);
  const isLoadType = (type) => {
      return isPopulatedString(type) && LoadTypes.includes(type);
  };
  function assertLoadType(value, name) {
      if (!isLoadType(value))
          throwError(value, "LoadType", name);
  }
  const UploadTypes = LoadTypes.filter(type => type !== exports.LoadType.Font);
  const isUploadType = (type) => {
      return isLoadType(type) && UploadTypes.includes(type);
  };
  exports.DefinitionType = void 0;
  (function (DefinitionType) {
      DefinitionType["Audio"] = "audio";
      DefinitionType["Clip"] = "clip";
      DefinitionType["Container"] = "container";
      DefinitionType["Content"] = "content";
      DefinitionType["Effect"] = "effect";
      DefinitionType["Filter"] = "filter";
      DefinitionType["Font"] = "font";
      DefinitionType["Image"] = "image";
      DefinitionType["Video"] = "video";
      DefinitionType["VideoSequence"] = "videosequence";
  })(exports.DefinitionType || (exports.DefinitionType = {}));
  const DefinitionTypes = Object.values(exports.DefinitionType);
  const isDefinitionType = (type) => {
      return DefinitionTypes.includes(type);
  };
  function assertDefinitionType(value, message = '') {
      if (!isDefinitionType(value))
          throw new Error(`expected '${value}' to be DefinitionType ${message}`);
  }
  const SizingDefinitionTypes = [exports.DefinitionType.Container, exports.DefinitionType.Image, exports.DefinitionType.Video, exports.DefinitionType.VideoSequence];
  const isSizingDefinitionType = (type) => {
      return isDefinitionType(type) && SizingDefinitionTypes.includes(type);
  };
  const TimingDefinitionTypes = [exports.DefinitionType.Audio, exports.DefinitionType.Video, exports.DefinitionType.VideoSequence];
  const isTimingDefinitionType = (type) => {
      return isDefinitionType(type) && TimingDefinitionTypes.includes(type);
  };
  const ContainerTypes = [exports.DefinitionType.Image, exports.DefinitionType.Container, exports.DefinitionType.VideoSequence];
  const isContainerType = (type) => {
      return isDefinitionType(type) && ContainerTypes.includes(type);
  };
  function assertContainerType(type) {
      if (!isContainerType(type))
          throw new Error("expected ContainerType");
  }
  const ContentTypes = [exports.DefinitionType.Content, exports.DefinitionType.Image, exports.DefinitionType.Video, exports.DefinitionType.VideoSequence, exports.DefinitionType.Audio];
  const isContentType = (type) => {
      return isDefinitionType(type) && ContentTypes.includes(type);
  };
  function assertContentType(type) {
      if (!isContentType(type))
          throw new Error("expected ContentType");
  }
  exports.DataType = void 0;
  (function (DataType) {
      DataType["Boolean"] = "boolean";
      DataType["ContainerId"] = "containerid";
      DataType["ContentId"] = "contentid";
      DataType["DefinitionId"] = "definitionid";
      DataType["FontId"] = "fontid";
      DataType["Frame"] = "frame";
      DataType["Number"] = "number";
      DataType["Percent"] = "percent";
      DataType["Rgb"] = "rgb";
      DataType["String"] = "string";
      DataType["Timing"] = "timing";
      DataType["Sizing"] = "sizing";
  })(exports.DataType || (exports.DataType = {}));
  const DataTypes = Object.values(exports.DataType);
  const isDataType = (type) => {
      return DataTypes.includes(type);
  };
  function assertDataType(value, name) {
      if (!isDataType(value))
          throwError(value, "DataType", name);
  }
  exports.Orientation = void 0;
  (function (Orientation) {
      Orientation["H"] = "H";
      Orientation["V"] = "V";
  })(exports.Orientation || (exports.Orientation = {}));
  const Orientations = Object.values(exports.Orientation);
  const isOrientation = (value) => {
      return isPopulatedString(value) && Orientations.includes(value);
  };
  exports.Direction = void 0;
  (function (Direction) {
      Direction["E"] = "E";
      Direction["N"] = "N";
      Direction["S"] = "S";
      Direction["W"] = "W";
  })(exports.Direction || (exports.Direction = {}));
  const Directions = Object.values(exports.Direction);
  const isDirection = (value) => {
      return Directions.includes(value);
  };
  function assertDirection(value, name) {
      if (!isDirection(value))
          throwError(value, "Direction", name);
  }
  exports.Anchor = void 0;
  (function (Anchor) {
      Anchor["E"] = "E";
      Anchor["N"] = "N";
      Anchor["NE"] = "NE";
      Anchor["NW"] = "NW";
      Anchor["S"] = "S";
      Anchor["SE"] = "SE";
      Anchor["SW"] = "SW";
      Anchor["W"] = "W";
  })(exports.Anchor || (exports.Anchor = {}));
  const Anchors = Object.values(exports.Anchor);
  exports.TriggerType = void 0;
  (function (TriggerType) {
      TriggerType["Init"] = "init";
      TriggerType["Stop"] = "stop";
      TriggerType["Start"] = "start";
  })(exports.TriggerType || (exports.TriggerType = {}));
  const TriggerTypes = Object.values(exports.TriggerType);
  const isTriggerType = (type) => {
      return TriggerTypes.includes(type);
  };
  exports.TransformType = void 0;
  (function (TransformType) {
      TransformType["Scale"] = "scale";
      TransformType["Translate"] = "translate";
  })(exports.TransformType || (exports.TransformType = {}));
  exports.EventType = void 0;
  (function (EventType) {
      EventType["Action"] = "action";
      EventType["Active"] = "active";
      EventType["Added"] = "added";
      EventType["Cast"] = "cast";
      EventType["Draw"] = "draw";
      EventType["Duration"] = "durationchange";
      EventType["Ended"] = "ended";
      EventType["Fps"] = "ratechange";
      EventType["Loaded"] = "loadeddata";
      EventType["Mash"] = "mash";
      EventType["Pause"] = "pause";
      EventType["Play"] = "play";
      EventType["Playing"] = "playing";
      EventType["Render"] = "render";
      EventType["Resize"] = "resize";
      EventType["Save"] = "save";
      EventType["Seeked"] = "seeked";
      EventType["Seeking"] = "seeking";
      EventType["Selection"] = "selection";
      EventType["Time"] = "timeupdate";
      EventType["Track"] = "track";
      EventType["Volume"] = "volumechange";
      EventType["Waiting"] = "waiting";
  })(exports.EventType || (exports.EventType = {}));
  const EventTypes = Object.values(exports.EventType);
  const isEventType = (type) => {
      return EventTypes.includes(type);
  };
  exports.MoveType = void 0;
  (function (MoveType) {
      MoveType["Audio"] = "audio";
      MoveType["Effect"] = "effect";
      MoveType["Video"] = "video";
  })(exports.MoveType || (exports.MoveType = {}));
  exports.MasherAction = void 0;
  (function (MasherAction) {
      MasherAction["Redo"] = "redo";
      MasherAction["Remove"] = "remove";
      MasherAction["Render"] = "render";
      MasherAction["Save"] = "save";
      MasherAction["Undo"] = "undo";
  })(exports.MasherAction || (exports.MasherAction = {}));
  exports.GraphType = void 0;
  (function (GraphType) {
      GraphType["Mash"] = "mash";
      GraphType["Cast"] = "cast";
  })(exports.GraphType || (exports.GraphType = {}));
  exports.ServerType = void 0;
  (function (ServerType) {
      ServerType["Api"] = "api";
      ServerType["Data"] = "data";
      ServerType["File"] = "file";
      ServerType["Rendering"] = "rendering";
      ServerType["Streaming"] = "streaming";
      ServerType["Web"] = "web";
  })(exports.ServerType || (exports.ServerType = {}));
  const ServerTypes = Object.values(exports.ServerType);
  exports.Duration = void 0;
  (function (Duration) {
      Duration[Duration["Unknown"] = -1] = "Unknown";
      Duration[Duration["Unlimited"] = -2] = "Unlimited";
      Duration[Duration["None"] = 0] = "None";
  })(exports.Duration || (exports.Duration = {}));
  exports.Timing = void 0;
  (function (Timing) {
      Timing["Custom"] = "custom";
      Timing["Content"] = "content";
      Timing["Container"] = "container";
  })(exports.Timing || (exports.Timing = {}));
  const Timings = Object.values(exports.Timing);
  exports.Sizing = void 0;
  (function (Sizing) {
      Sizing["Preview"] = "preview";
      Sizing["Content"] = "content";
      Sizing["Container"] = "container";
  })(exports.Sizing || (exports.Sizing = {}));
  const Sizings = Object.values(exports.Sizing);

  const ApiVersion = "5.1.1";

  const EndpointsApi = {
      servers: '',
      callbacks: '',
  };
  const EndpointsEncode = {
      start: '',
      status: '',
      // stop: '',
  };
  const EndpointsRendering = { ...EndpointsEncode, upload: '' };
  const EndpointsCrud = {
      delete: '',
      get: '',
      put: '',
      retrieve: '',
  };
  const EndpointsData = {
      cast: { ...EndpointsCrud, default: '' },
      mash: { ...EndpointsCrud, default: '' },
      stream: { ...EndpointsCrud },
      definition: { ...EndpointsCrud },
  };
  const EndpointsStreaming = {
      ...EndpointsEncode,
      ...EndpointsCrud,
      preload: '',
      cut: '',
      webrtc: '',
      rtmp: '',
      remote: '',
      local: '',
  };
  const EndpointsFile = {
      store: '',
  };
  const Endpoints = {
      [exports.ServerType.Api]: EndpointsApi,
      [exports.ServerType.Data]: EndpointsData,
      [exports.ServerType.File]: EndpointsFile,
      [exports.ServerType.Rendering]: EndpointsRendering,
      [exports.ServerType.Streaming]: EndpointsStreaming,
  };
  // populate Endpoints with key paths...
  Object.entries(Endpoints).forEach(([serverType, server]) => {
      if (isObject(server))
          Object.entries(server).forEach(([key1, value1]) => {
              if (isString(value1))
                  server[key1] = `/${serverType}/${key1}`;
              else
                  Object.entries(value1).forEach(([key2, value2]) => {
                      if (!value2)
                          value1[key2] = `/${serverType}/${key1}/${key2}`;
                  });
          });
  });

  const Factories = {};

  const Factory = Factories;

  const ExtHls = 'm3u8';
  const ExtTs = 'ts';
  const ExtRtmp = 'flv';
  const ExtDash = 'dash';
  const ExtJpeg = 'jpg';
  const ExtPng = 'png';
  const ExtJson = 'json';
  const ExtText = 'txt';
  const OutputFilterGraphPadding = 6;
  const EmptyMethod = () => { };
  // xmlns
  const NamespaceSvg = 'http://www.w3.org/2000/svg';
  // xmlns:xhtml
  const NamespaceXhtml = 'http://www.w3.org/1999/xhtml';
  // xmlns:xlink
  const NamespaceLink = 'http://www.w3.org/1999/xlink';
  const IdPrefix = 'com.moviemasher.';
  const IdSuffix = '.default';
  const ClassDisabled = 'disabled';
  const ClassButton = 'button';
  const ClassCollapsed = 'collapsed';
  const ClassSelected = 'selected';
  const ClassDropping = 'dropping';
  const ClassDroppingBefore = 'dropping-before';
  const ClassDroppingAfter = 'dropping-after';

  const isDefinitionObject = (value) => {
      return isObject(value) && "id" in value && (!value.type || isDefinitionType(value.type));
  };
  const isDefinition = (value) => {
      return isObject(value) && isDefinitionType(value.type) && "instanceFromObject" in value;
  };
  function assertDefinition(value, name) {
      if (!isDefinition(value))
          throwError(value, 'Definition', name);
  }

  class Defined {
      static byId = new Map();
      static byIdAdd(definition) {
          const definitions = Array.isArray(definition) ? definition : [definition];
          definitions.forEach(definition => this.byId.set(definition.id, definition));
      }
      static byType(type) {
          const list = this.definitionsByType.get(type);
          if (list)
              return list;
          const definitions = Factory[type].defaults || [];
          this.definitionsByType.set(type, definitions);
          // this.byIdAdd(definitions)
          return definitions;
      }
      static define(...objects) {
          return objects.map(object => this.fromObject(object));
      }
      static definitionDelete(definition) {
          const { type, id } = definition;
          const definitions = this.byType(type);
          const index = definitions.findIndex(definition => id === definition.id);
          // console.log(this.name, "definitionDelete", type, id, index)
          if (index < 0)
              return;
          definitions.splice(index, 1);
      }
      static definitionsByType = new Map();
      static definitionsType(id) {
          const type = id.split('.').slice(-2).shift();
          return isDefinitionType(type) ? type : undefined;
      }
      static fromId(id) {
          if (this.installed(id))
              return this.byId.get(id);
          const definitionType = this.definitionsType(id);
          assertDefinitionType(definitionType, `in Defined.fromId('${id}')`);
          return Factory[definitionType].definitionFromId(id);
      }
      static fromObject(object) {
          const { id, type } = object;
          assertPopulatedString(id);
          if (this.installed(id) || this.predefined(id))
              return this.fromId(id);
          const definitionType = type || this.definitionsType(id);
          assertDefinitionType(definitionType);
          return this.install(Factory[definitionType].definition(object));
      }
      static get ids() { return [...this.byId.keys()]; }
      static install(definition) {
          const { type, id } = definition;
          // console.log(this.name, "install", JSON.stringify(definition))
          if (this.installed(id)) {
              // console.log(this.constructor.name, "install REINSTALL", type, id)
              this.uninstall(definition);
              return this.updateDefinition(this.fromId(id), definition);
          }
          // console.log(this.constructor.name, "install", type, id)
          this.byIdAdd(definition);
          this.byType(type).push(definition);
          return definition;
      }
      static installed(id) { return this.byId.has(id); }
      static predefined(id) {
          if (id.startsWith(IdPrefix))
              return true;
          const definitionType = this.definitionsType(id);
          if (!definitionType)
              return false;
          const array = this.byType(definitionType);
          return array.some(definition => definition.id === id);
      }
      static undefineAll() {
          // console.log(this.name, "undefineAll")
          // TODO: be more graceful - tell definitions they are being destroyed...
          this.byId = new Map();
          this.definitionsByType = new Map();
      }
      static updateDefinition(oldDefinition, newDefinition) {
          // console.log(this.name, "updateDefinition", oldDefinition.type, oldDefinition.id, "->", newDefinition.type, newDefinition.id)
          this.uninstall(oldDefinition);
          this.install(newDefinition);
          return newDefinition;
      }
      static updateDefinitionId(oldId, newId) {
          // console.log(this.name, "updateDefinitionId", oldId, "->", newId)
          const definition = this.byId.get(oldId);
          assertDefinition(definition);
          this.byId.delete(oldId);
          this.byId.set(newId, definition);
      }
      static uninstall(definition) {
          this.definitionDelete(definition);
          const { id } = definition;
          this.byId.delete(id);
          return definition;
      }
  }

  const colorRgbKeys = 'rgb'.split('');
  const colorRgbaKeys = [...colorRgbKeys, 'a'];
  const colorTransparent = '#00000000';
  const colorBlack = '#000000';
  const colorWhite = '#FFFFFF';
  const colorWhiteTransparent = '#FFFFFF00';
  const colorBlackTransparent = '#00000000';
  const colorWhiteOpaque = '#FFFFFFFF';
  const colorBlackOpaque = '#000000FF';
  const colorGreen = '#00FF00';
  const colorYellow = '#FFFF00';
  const colorRed = '#FF0000';
  const colorBlue = '#0000FF';
  exports.Color = void 0;
  (function (Color) {
      Color["Transparent"] = "#00000000";
      Color["Black"] = "#000000";
      Color["White"] = "#FFFFFF";
      Color["WhiteTransparent"] = "#FFFFFF00";
      Color["BlackTransparent"] = "#00000000";
      Color["WhiteOpaque"] = "#FFFFFFFF";
      Color["BlackOpaque"] = "#000000FF";
      Color["Green"] = "#00FF00";
      Color["Yellow"] = "#FFFF00";
      Color["Red"] = "#FF0000";
      Color["Blue"] = "#0000FF";
  })(exports.Color || (exports.Color = {}));
  const Colors = Object.values(exports.Color);
  const colorName = (color) => {
      for (const entry of Object.entries(exports.Color)) {
          const [key, value] = entry;
          if (value === color)
              return key;
      }
      return '';
  };
  const rgbValue = (value) => (Math.min(255, Math.max(0, Math.floor(Number(value)))));
  const rgbNumeric = (rgb) => ({
      r: rgbValue(rgb.r), g: rgbValue(rgb.g), b: rgbValue(rgb.b)
  });
  const yuvNumeric = (rgb) => ({
      y: rgbValue(rgb.y), u: rgbValue(rgb.u), v: rgbValue(rgb.v)
  });
  const colorYuvToRgb = (yuv) => {
      const floats = yuvNumeric(yuv);
      return rgbNumeric({
          r: floats.y + 1.4075 * (floats.v - 128),
          g: floats.y - 0.3455 * (floats.u - 128) - (0.7169 * (floats.v - 128)),
          b: floats.y + 1.7790 * (floats.u - 128)
      });
  };
  const colorRgbToHex = (rgb) => {
      let r = rgb.r.toString(16);
      let g = rgb.g.toString(16);
      let b = rgb.b.toString(16);
      if (r.length < 2)
          r = `0${r}`;
      if (g.length < 2)
          g = `0${g}`;
      if (b.length < 2)
          b = `0${b}`;
      return `#${r}${g}${b}`;
  };
  const colorRgbaToHex = (object) => {
      let r = object.r.toString(16);
      let g = object.g.toString(16);
      let b = object.b.toString(16);
      let a = Math.round(255 * Number(object.a)).toString(16);
      if (r.length < 2)
          r = `0${r}`;
      if (g.length < 2)
          g = `0${g}`;
      if (b.length < 2)
          b = `0${b}`;
      if (a.length < 2)
          a = `0${a}`;
      return `#${r}${g}${b}${a}`;
  };
  const colorYuvDifference = (fromYuv, toYuv, similarity, blend) => {
      const du = fromYuv.u - toYuv.u;
      const dv = fromYuv.v - toYuv.v;
      const diff = Math.sqrt((du * du + dv * dv) / (255.0 * 255.0));
      if (blend > 0.0001) {
          return Math.min(1.0, Math.max(0.0, (diff - similarity) / blend)) * 255.0;
      }
      return (diff > similarity) ? 255 : 0;
  };
  const colorYuvBlend = (yuvs, yuv, similarity, blend) => {
      let diff = 0.0;
      const blendYuv = yuvNumeric(yuv);
      yuvs.forEach(yuvObject => {
          const numericYuv = yuvNumeric(yuvObject);
          const du = numericYuv.u - blendYuv.u;
          const dv = numericYuv.v - blendYuv.v;
          diff += Math.sqrt((du * du + dv * dv) / (255.0 * 255.0));
      });
      diff /= yuvs.length;
      if (blend > 0.0001) {
          return Math.min(1.0, Math.max(0.0, (diff - similarity) / blend)) * 255.0;
      }
      return (diff > similarity) ? 255 : 0;
  };
  const colorRgbToYuv = (rgb) => {
      const ints = rgbNumeric(rgb);
      return {
          y: ints.r * 0.299000 + ints.g * 0.587000 + ints.b * 0.114000,
          u: ints.r * -0.168736 + ints.g * -0.331264 + ints.b * 0.500000 + 128,
          v: ints.r * 0.500000 + ints.g * -0.418688 + ints.b * -0.081312 + 128
      };
  };
  const colorRgbRegex = /^rgb\((\d{1,3}),(\d{1,3}),(\d{1,3})\)$/;
  const colorRgbaRegex = /^rgba\((\d{1,3}),(\d{1,3}),(\d{1,3}),(\d*(?:\.\d+)?)\)$/;
  const colorHexRegex = /^#([A-Fa-f0-9]{3,4}){1,2}$/;
  const colorStrip = (color) => color.toLowerCase().replaceAll(/[\s]/g, '');
  const colorValid = (color) => {
      const stripped = colorStrip(color);
      if (colorValidHex(stripped) || colorValidRgba(stripped) || colorValidRgb(stripped))
          return true;
      const style = new Option().style;
      style.color = color;
      const styleStripped = colorStrip(style.color);
      if (!styleStripped)
          return false;
      if (colorValidRgba(stripped) || colorValidRgb(stripped))
          return true;
      return styleStripped === stripped;
  };
  const colorValidHex = (value) => colorHexRegex.test(value);
  const colorValidRgba = (value) => colorRgbaRegex.test(value);
  const colorValidRgb = (value) => colorRgbRegex.test(value);
  const getChunksFromString = (st, chunkSize) => st.match(new RegExp(`.{${chunkSize}}`, "g"));
  const hex256 = (hexStr) => parseInt(hexStr.repeat(2 / hexStr.length), 16);
  const colorAlpha = (value) => {
      if (!isPositive(value))
          return 1.0;
      return Math.max(0, Math.min(1.0, value / 255));
  };
  const colorHexToRgba = (hex) => {
      if (!colorValidHex(hex))
          return colorRgba;
      const chunkSize = Math.floor((hex.length - 1) / 3);
      const hexArr = getChunksFromString(hex.slice(1), chunkSize);
      if (!hexArr)
          return colorRgba;
      const [r, g, b, a] = hexArr.map(hex256);
      return { r, g, b, a: colorAlpha(a) };
  };
  const colorHexToRgb = (hex) => {
      if (!colorValidHex(hex))
          return colorRgb;
      const chunkSize = Math.floor((hex.length - 1) / 3);
      const hexArr = getChunksFromString(hex.slice(1), chunkSize);
      if (!hexArr)
          return colorRgb;
      const [r, g, b] = hexArr.map(hex256);
      return { r, g, b };
  };
  const colorRgbaToRgba = (value) => {
      const color = colorStrip(value);
      const rgbaMatch = color.match(colorRgbaRegex);
      if (!rgbaMatch)
          return colorRgba;
      return {
          r: Number(rgbaMatch[1]),
          g: Number(rgbaMatch[2]),
          b: Number(rgbaMatch[3]),
          a: Number(rgbaMatch[4]),
      };
  };
  const colorToRgb = (value) => {
      const color = colorStrip(value);
      if (colorValidHex(color))
          return colorHexToRgb(color);
      const rgbMatch = color.match(colorRgbRegex);
      if (!rgbMatch)
          return colorRgb;
      return {
          r: Number(rgbMatch[1]),
          g: Number(rgbMatch[2]),
          b: Number(rgbMatch[3]),
      };
  };
  const colorToRgba = (value) => {
      if (!colorValid(value))
          return colorRgba;
      const color = colorStrip(value);
      if (colorValidHex(color))
          return colorHexToRgba(color);
      if (colorValidRgba(color))
          return colorRgbaToRgba(color);
      if (colorValidRgb(color))
          return { a: 1.0, ...colorToRgb(color) };
      return colorRgba;
  };
  const colorAlphaColor = (value) => {
      const toRgba = colorToRgba(value);
      return { alpha: toRgba.a, color: colorRgbToHex(toRgba) };
  };
  const colorFromRgb = (rgb) => {
      const { r, g, b } = rgb;
      return `rgb(${r},${g},${b})`;
  };
  const colorFromRgba = (object) => {
      const { r, g, b, a } = object;
      return `rgb(${r},${g},${b},${a})`;
  };
  const colorRgb = { r: 0, g: 0, b: 0 };
  const colorRgba = { ...colorRgb, a: 1.0 };
  const colorRgbaTransparent = { ...colorRgb, a: 0.0 };
  const colorServer = (color) => {
      if (!colorValidHex(color))
          return color;
      return `${color.slice(0, 7)}@0x${color.slice(-2)}`;
  };
  const colorRgbDifference = (rgb) => {
      const { r, g, b } = rgb;
      return {
          ...rgb,
          r: 255 - r,
          g: 255 - g,
          b: 255 - b,
      };
  };

  const PropertyTypesNumeric = [
      exports.DataType.Frame,
      exports.DataType.Percent,
      exports.DataType.Number,
  ];
  const propertyTypeRepresentedAsNumber = (dataType) => {
      return isDataType(dataType) && PropertyTypesNumeric.includes(dataType);
  };
  const propertyTypeIsString = (dataType) => {
      if (dataType === exports.DataType.Boolean)
          return false;
      if (propertyTypeRepresentedAsNumber(dataType))
          return false;
      return true;
  };
  const propertyTypeDefault = (dataType) => {
      if (isDefinitionType(dataType))
          return `${IdPrefix}${dataType}${IdSuffix}`;
      switch (dataType) {
          case exports.DataType.Boolean: return false;
          case exports.DataType.Rgb: return colorBlack;
      }
      return propertyTypeRepresentedAsNumber(dataType) ? 0 : '';
  };
  const propertyTypeValidBoolean = (value) => {
      if (isBoolean(value))
          return true;
      if (isNumber(value))
          return value === 0 || value === 1;
      return ['true', 'false', ''].includes(value);
  };
  const propertyTypeValid = (value, dataType) => {
      if (isDefinitionType(dataType))
          return isPopulatedString(value);
      switch (dataType) {
          case exports.DataType.Boolean: return propertyTypeValidBoolean(value);
          case exports.DataType.Rgb: return colorValid(String(value));
          case exports.DataType.Frame:
          case exports.DataType.Percent:
          case exports.DataType.Number: return isNumeric(value);
          case exports.DataType.String: return true;
          case exports.DataType.ContainerId:
          case exports.DataType.ContentId:
          case exports.DataType.FontId:
          case exports.DataType.DefinitionId:
          default: return isPopulatedString(value);
      }
      return false;
  };
  const propertyTypeCoerce = (value, dataType) => {
      if (dataType === exports.DataType.Boolean) {
          if (isBoolean(value))
              return value;
          if (isNumeric(value))
              return !!Number(value);
          return value === 'true';
      }
      if (propertyTypeRepresentedAsNumber(dataType))
          return isNumeric(value) ? Number(value) : 0;
      return String(value);
  };

  const PropertyTweenSuffix = 'End';
  class PropertiedClass {
      constructor(..._args) { }
      addProperties(object, ...properties) {
          this.properties.push(...properties);
          properties.forEach(property => {
              this.propertyTweenSetOrDefault(object, property);
              // console.log(this.constructor.name, "property", property.name, this[property.name])
          });
      }
      properties = [];
      get propertiesCustom() {
          return this.properties.filter(property => property.custom);
      }
      propertiesInitialize(object) {
          assertObject(object);
          this.properties.forEach(property => this.propertyTweenSetOrDefault(object, property));
      }
      propertyFind(name) {
          return this.properties.find(property => property.name === name);
      }
      propertyName(name) {
          if (!name.endsWith(PropertyTweenSuffix))
              return name;
          return name.slice(0, -PropertyTweenSuffix.length);
      }
      propertySetOrDefault(object, property, name, defaultValue) {
          const value = object[name];
          const definedValue = isUndefined(value) ? defaultValue : value;
          // if (name === 'contentId' || name === 'containerId') 
          // console.log(this.constructor.name, "propertySetOrDefault", name, definedValue, object)
          this.setValue(definedValue, name, property);
      }
      propertyTweenSetOrDefault(object, property) {
          const { name, defaultValue, tweenable } = property;
          this.propertySetOrDefault(object, property, name, defaultValue);
          if (tweenable)
              this.propertySetOrDefault(object, property, `${name}${PropertyTweenSuffix}`);
      }
      setValue(value, name, property) {
          if (isUndefined(value)) {
              delete this[name];
              return;
          }
          const propertyName = this.propertyName(name);
          const found = property || this.propertyFind(propertyName);
          assertTrue(found, `${this.constructor.name}.${propertyName} in ${this.properties.map(p => p.name).join(', ')}`);
          const type = found.type;
          if (!propertyTypeValid(value, type)) {
              if (propertyName !== name) {
                  // tween end value can be undefined
                  delete this[name];
              }
              return;
          }
          const coerced = propertyTypeCoerce(value, type);
          // console.log(this.constructor.name, "setValue", name, coerced)
          this[name] = coerced;
      }
      setValues(object) {
          Object.entries(object).forEach(([name, value]) => {
              this.setValue(value, name);
          });
      }
      toJSON() {
          return Object.fromEntries(this.properties.flatMap(property => {
              const { name, tweenable } = property;
              const entries = [[name, this.value(name)]];
              if (tweenable) {
                  const key = `${name}${PropertyTweenSuffix}`;
                  entries.push([key, this.value(key)]);
              }
              return entries;
          }));
      }
      value(key) {
          return this[key];
      }
  }
  const isPropertied = (value) => (value instanceof PropertiedClass);

  const isInstanceObject = (value) => {
      return isObject(value) && ("definitionId" in value || "definition" in value);
  };
  const isInstance = (value) => {
      return isObject(value) && "definitionIds" in value;
  };

  const isTweenable = (value) => {
      return isInstance(value) && isDefinition(value.definition);
  };
  function assertTweenable(value) {
      if (!isTweenable(value))
          throw new Error('expected Tweenable');
  }
  const isTweenableDefinition = (value) => {
      return isDefinition(value);
  };
  function assertTweenableDefinition(value) {
      if (!isTweenableDefinition(value))
          throw new Error('expected TweenableDefinition');
  }

  const DefaultContainerId = `${IdPrefix}container${IdSuffix}`;
  const TextContainerId = `${IdPrefix}container.text`;
  const isContainerObject = (value) => {
      return isObject(value) && "opacity" in value;
  };
  function assertContainerObject(value) {
      if (!isContainerObject(value))
          throwError(value, 'ContainerObject');
  }
  const isContainerDefinition = (value) => {
      return isTweenableDefinition(value) && isContainerType(value.type);
  };
  const isContainer = (value) => {
      return isTweenable(value) && isContainerType(value.type);
  };
  function assertContainer(value) {
      if (!isContainer(value))
          throw new Error('expected Container');
  }

  const isPoint = (value) => {
      return isObject(value) && isNumber(value.x) && isNumber(value.y);
  };
  function assertPoint(value, name) {
      if (!isPoint(value))
          throwError(value, 'Point', name);
  }
  const pointsEqual = (point, pointEnd) => {
      if (!isPoint(pointEnd))
          return false;
      return point.x === pointEnd.x && point.y === pointEnd.y;
  };
  const PointZero = { x: 0, y: 0 };
  const pointCopy = (point) => {
      // assertPoint(point)
      const { x, y } = point;
      return { x, y };
  };
  const pointRound = (point) => {
      const { x, y } = point;
      return { x: Math.round(x), y: Math.round(y) };
  };
  const pointString = (point) => {
      const { x, y } = point;
      return `x=${x};y=${y}`;
  };
  const pointValueString = (point) => {
      const { x, y } = point;
      return `${x},${y}`;
  };
  const pointNegate = (point) => {
      const { x, y } = point;
      return { x: -x, y: -y };
  };

  const isSize = (value) => {
      return isObject(value) && isNumber(value.width) && isNumber(value.height);
  };
  function assertSize(value, name) {
      if (!isSize(value))
          throwError(value, 'Size', name);
  }
  const sizesEqual = (size, sizeEnd) => {
      if (!isSize(sizeEnd))
          return false;
      return size.width === sizeEnd.width && size.height === sizeEnd.height;
  };
  const SizeZero = { width: 0, height: 0 };
  const sizedEven = (number) => {
      return 2 * Math.max(1, Math.ceil(number / 2));
  };
  const sizeEven = (size) => {
      const { width, height } = size;
      return {
          width: sizedEven(width), height: sizedEven(height),
      };
  };
  const sizeRound = (point) => {
      const { width, height } = point;
      return { width: Math.round(width), height: Math.round(height) };
  };
  const sizeCeil = (size) => {
      const { width, height } = size;
      return {
          width: Math.max(2, Math.ceil(width)),
          height: Math.max(2, Math.ceil(height)),
      };
  };
  const sizeFloor = (size) => {
      const { width, height } = size;
      return {
          width: Math.max(2, Math.floor(width)),
          height: Math.max(2, Math.floor(height)),
      };
  };
  const sizeScale = (size, horizontally, vertically) => {
      const { width, height } = size;
      return { width: width * horizontally, height: height * vertically };
  };
  const sizeCover = (inSize, outSize, contain = false) => {
      assertSizeAboveZero(inSize, 'sizeCover');
      assertSize(outSize);
      const { width: inWidth, height: inHeight } = inSize;
      const { width, height } = outSize;
      const scaleWidth = width / inWidth;
      const scaleHeight = height / inHeight;
      const useWidth = contain ? scaleWidth < scaleHeight : scaleWidth > scaleHeight;
      if (useWidth) {
          return sizeCeil({ ...outSize, height: inHeight * scaleWidth });
      }
      return sizeCeil({ ...outSize, width: inWidth * scaleHeight });
  };
  const sizeAboveZero = (size) => {
      if (!isSize(size))
          return false;
      const { width, height } = size;
      return isAboveZero(width) && isAboveZero(height);
  };
  function assertSizeAboveZero(size, name) {
      if (!sizeAboveZero(size))
          throwError(size, 'SizeAboveZero', name);
  }
  const SizeOutput = { width: 1920, height: 1080 };
  const SizePreview = sizeScale(SizeOutput, 0.25, 0.25);
  const SizeIcon = sizeScale(SizePreview, 0.5, 0.5);
  const sizeCopy = (size) => {
      // assertSize(size)
      const { width, height } = size;
      return { width, height };
  };
  const sizeLock = (lockSize, lock) => {
      const copy = sizeCopy(lockSize);
      switch (lock) {
          case exports.Orientation.H:
              copy.width = copy.height;
              break;
          case exports.Orientation.V:
              copy.height = copy.width;
              break;
      }
      return copy;
  };
  const sizeString = (size) => {
      const { width, height } = size;
      return `width=${width};height=${height}`;
  };
  const sizeLockNegative = (size, lock) => {
      assertSizeAboveZero(size, 'sizeLockNegative');
      const locked = sizeCopy(size);
      if (lock) {
          if (lock === exports.Orientation.V)
              locked.height = -1;
          else
              locked.width = -1;
      }
      return locked;
  };
  const sizeFromElement = (element) => {
      const size = {
          width: Number(element.getAttribute('width')),
          height: Number(element.getAttribute('height'))
      };
      assertSizeAboveZero(size, 'sizeFromElement');
      return size;
  };

  const isRect = (value) => {
      return isSize(value) && isPoint(value);
  };
  function assertRect(value, name) {
      if (!isRect(value))
          throwError(value, 'Rect', name);
  }
  const rectsEqual = (rect, rectEnd) => {
      if (!isRect(rectEnd))
          return false;
      return pointsEqual(rect, rectEnd) && sizesEqual(rect, rectEnd);
  };
  const RectZero = { ...PointZero, ...SizeZero };
  const rectFromSize = (size, point) => {
      const definedPoint = point || PointZero;
      const { width, height } = size;
      return {
          x: definedPoint.x, y: definedPoint.y, width, height,
      };
  };
  const rectsFromSizes = (sizes, points) => {
      const definedPoints = points || [PointZero, PointZero];
      const [size, sizeEnd] = sizes;
      const [point, pointEnd] = definedPoints;
      return [rectFromSize(size, point), rectFromSize(sizeEnd, pointEnd)];
  };
  const rectCopy = (rect) => {
      return { ...pointCopy(rect), ...sizeCopy(rect) };
  };
  const rectRound = (rect) => {
      return { ...sizeRound(rect), ...pointRound(rect) };
  };
  const centerPoint = (size, inSize) => {
      return {
          x: Math.round((size.width - inSize.width) / 2),
          y: Math.round((size.height - inSize.height) / 2)
      };
  };
  const rectString = (dimensions) => {
      const bits = [];
      if (isSize(dimensions))
          bits.push(sizeString(dimensions));
      if (isPoint(dimensions))
          bits.push(pointString(dimensions));
      return bits.join(';');
  };

  const arrayLast = (array) => array[array.length - 1];
  const arraySet = (array, items) => {
      array.splice(0, array.length, ...items);
      return array;
  };
  const arrayReversed = (array) => {
      return [...array].reverse();
  };
  const arrayUnique = (array) => {
      return [...new Set(array)];
  };

  exports.DataGroup = void 0;
  (function (DataGroup) {
      DataGroup["Point"] = "point";
      DataGroup["Size"] = "size";
      DataGroup["Opacity"] = "opacity";
      DataGroup["Color"] = "color";
      DataGroup["Effects"] = "effects";
      DataGroup["Timing"] = "timing";
      DataGroup["Sizing"] = "sizing";
  })(exports.DataGroup || (exports.DataGroup = {}));
  const DataGroups = Object.values(exports.DataGroup);
  const isDataGroup = (value) => {
      return DataGroups.includes(value);
  };
  function assertDataGroup(value, name) {
      if (!isDataGroup(value))
          throwError(value, "DataGroup", name);
  }
  const isProperty = (value) => {
      return isObject(value) && "type" in value && isDataType(value.type);
  };
  function assertProperty(value, name) {
      if (!isProperty(value))
          throwError(value, 'Property', name);
  }
  const propertyType = (type, value) => {
      if (isUndefined(type)) {
          if (isBoolean(value))
              return exports.DataType.Boolean;
          if (isNumber(value))
              return exports.DataType.Number;
          return exports.DataType.String;
      }
      assertDataType(type);
      return type;
  };
  const propertyValue = (type, value) => {
      if (isUndefined(value))
          return propertyTypeDefault(type);
      return value;
  };
  const propertyInstance = (object) => {
      const { type, name, defaultValue, ...rest } = object;
      const dataType = propertyType(type, defaultValue);
      const dataValue = propertyValue(dataType, defaultValue);
      const dataName = isPopulatedString(name) ? name : dataType;
      const property = {
          type: dataType, defaultValue: dataValue, name: dataName, ...rest
      };
      switch (type) {
          case exports.DataType.Percent: {
              if (isUndefined(property.max))
                  property.max = 1.0;
              if (isUndefined(property.min))
                  property.min = 0.0;
              if (isUndefined(property.step))
                  property.step = 0.01;
              break;
          }
      }
      return property;
  };

  const $invalid = "Invalid";
  const $unknown = "Unknown";
  const $expected = "Expected";
  const $invalidArgument = `${$invalid} argument `;
  const $invalidProperty = `${$invalid} property `;
  const $invalidDefinitionProperty = `${$invalid} definition property`;
  const $internal = "Internal Error ";
  const Errors = {
      eval: {
          sourceRect: `${$invalid} evaluation of source rect `,
          outputSize: `${$invalid} evaluation of output size `,
          inputSize: `${$invalid} evaluation of input size `,
          conditionTruth: `${$expected} at least one condition to evaluate to true `,
          conditionValue: `${$expected} condition to have a value `,
          number: `${$expected} evaluated number for `,
          get: `${$expected} to get evaluated value `,
          string: `${$invalid} evaluation string `,
      },
      composition: { mashUndefined: `${$internal}composition.mash undefined` },
      audibleContext: `${$expected} AudioContext`,
      mash: `${$expected} mash`,
      action: `${$expected} Action`,
      actions: `${$expected} Actions`,
      internal: $internal,
      argument: `${$invalidArgument}`,
      invalid: {
          canvas: `${$invalidProperty}canvas `,
          context: `${$invalidProperty}context `,
          duration: `${$invalid} duration`,
          definition: {
              audio: `${$invalidDefinitionProperty} audio|url`,
              url: `${$invalidDefinitionProperty} url`,
              source: `${$invalidDefinitionProperty} source`,
              id: `${$invalidDefinitionProperty} id `,
              object: `${$invalidProperty}definition`,
              type: `${$invalidDefinitionProperty} type `,
          },
          size: `${$invalid} size `,
          track: `${$invalid} track `,
          trackType: `${$invalidProperty}trackType `,
          action: `${$invalid} action `,
          name: `${$invalidProperty}name `,
          value: `${$invalidProperty}value `,
          type: `${$invalidProperty}type `,
          url: `${$invalidProperty}url `,
          user: 'Unauthenticated',
          property: $invalidProperty,
          argument: $invalidArgument,
          object: `${$invalidArgument}object `,
          factory: `${$invalid} factory `,
          volume: `${$invalidArgument}volume`,
      },
      type: `${$unknown} type `,
      selection: `${$invalid} selection `,
      unknown: {
          type: `${$unknown} type `,
          merger: `${$unknown} merger `,
          effect: `${$unknown} effect `,
          filter: `${$unknown} filter `,
          font: `${$unknown} font `,
          scaler: `${$unknown} scalar `,
          definition: `${$unknown} definition `,
      },
      uncached: "Uncached URL ",
      object: `${$invalidArgument}object `,
      array: `${$invalidArgument}array `,
      media: `${$invalidArgument}media `,
      id: `${$invalidArgument}id `,
      frame: `${$invalidArgument}frame `,
      frames: `${$invalidProperty}frames `,
      fps: `${$invalidArgument}fps `,
      seconds: `${$invalidArgument}seconds `,
      url: `${$invalidArgument}url `,
      time: `${$invalidArgument}Time`,
      timeRange: `${$invalidArgument}TimeRange`,
      mainTrackOverlap: `${$internal}: main track clips overlap without transition`,
      unknownMash: `${$unknown} Mash property `,
      unimplemented: `${$expected} method to be overridden `,
      property: `${$invalidArgument}property `,
      wrongClass: `${$expected} instance of `,
  };

  class Parameter {
      constructor({ name, value, dataType, values }) {
          if (!name)
              throw Errors.invalid.name;
          this.values = values;
          this.name = name;
          if (isUndefined(value)) {
              if (this.values?.length)
                  this.value = this.values[0];
              else
                  throw Errors.invalid.value;
          }
          else
              this.value = value;
          if (dataType && DataTypes.map(String).includes(dataType)) {
              this.dataType = dataType;
          }
          else {
              let numeric = false;
              if (Array.isArray(this.value)) {
                  numeric = this.value.every(condition => isNumeric(condition.value));
              }
              else
                  numeric = isNumeric(this.value);
              if (numeric)
                  this.dataType = exports.DataType.Number;
          }
      }
      dataType = exports.DataType.String;
      name;
      toJSON() {
          return { name: this.name, value: this.value };
      }
      value;
      values;
  }

  const Id = {
      count: 0,
      prefix: '',
      countsByPrefix: {}
  };
  const idGenerateString = () => {
      const components = [];
      if (Id.prefix)
          components.push(Id.prefix);
      components.push(Date.now().toString(36));
      components.push(Math.random().toString(36).slice(2));
      return components.join('-');
  };
  const idPrefixSet = (prefix) => { Id.prefix = prefix; };
  const idTemporary = () => {
      const { prefix } = Id;
      const components = [];
      if (prefix) {
          components.push(prefix);
          Id.countsByPrefix[prefix] ||= 0;
          components.push(String(Id.countsByPrefix[prefix]++));
      }
      else
          components.push(String(Id.count++));
      return components.join('');
  };
  const idGenerate = (prefix = Id.prefix) => {
      const components = [];
      if (prefix) {
          components.push(prefix);
          Id.countsByPrefix[prefix] ||= 0;
          components.push(String(Id.countsByPrefix[prefix]++));
      }
      else
          components.push(String(Id.count++));
      return components.join('');
  };
  const idIsTemporary = (id) => {
      if (!isPopulatedString(Id.prefix))
          return false;
      return id.startsWith(Id.prefix);
  };

  class InstanceBase extends PropertiedClass {
      constructor(...args) {
          super(...args);
          const [object] = args;
          assertPopulatedObject(object);
          const { definition } = object;
          assertDefinition(definition);
          this.definition = definition;
          this.properties.push(...this.definition.properties);
          this.propertiesInitialize(object);
      }
      copy() {
          return this.definition.instanceFromObject(this.toJSON());
      }
      definition;
      get definitionId() { return this.definition.id; }
      definitionIds() { return [this.definitionId]; }
      _id;
      get id() { return this._id ||= idGenerateString(); }
      _label = '';
      get label() { return this._label; }
      //|| this.definition.label || this.id
      set label(value) { this._label = value; }
      get propertyNames() {
          return this.properties.map(property => property.name);
      }
      toJSON() {
          const json = super.toJSON();
          const { definitionId, type, label } = this;
          if (label)
              json.label = label;
          json.type = type;
          json.definitionId = definitionId;
          return json;
      }
      get type() { return this.definition.type; }
  }

  const svgId = (id) => {
      return `#${id}`;
  };
  const svgUrl = (id) => {
      return `url(${svgId(id)})`;
  };
  const svgGroupElement = (dimensions, id = '') => {
      const element = globalThis.document.createElementNS(NamespaceSvg, 'g');
      svgSet(element, id);
      svgSetDimensions(element, dimensions);
      return element;
  };
  const svgSetDimensions = (element, dimensions) => {
      if (isSize(dimensions)) {
          const { width, height } = dimensions;
          if (isPositive(width))
              svgSet(element, String(width), 'width');
          if (isPositive(height))
              svgSet(element, String(height), 'height');
      }
      if (isPoint(dimensions)) {
          const { x, y } = dimensions;
          svgSet(element, String(x), 'x');
          svgSet(element, String(y), 'y');
      }
  };
  const svgSetTransformPoint = (element, point) => {
      assertPoint(point);
      const { x, y } = point;
      if (!(x || y))
          return;
      svgSetTransform(element, `translate(${x}, ${y})`);
  };
  const svgRectPoints = (dimensions) => {
      const { width, height, x = 0, y = 0 } = dimensions;
      const startEndPoint = { x, y };
      const points = [];
      points.push(startEndPoint);
      points.push({ x: x + width, y });
      points.push({ x: x + width, y: y + height });
      points.push({ x, y: y + height });
      points.push(startEndPoint);
      return points;
  };
  const svgPolygonElement = (dimensions, className, fill = '', id) => {
      const element = globalThis.document.createElementNS(NamespaceSvg, 'polygon');
      const rectPoints = svgRectPoints(dimensions);
      const points = rectPoints.map(point => [point.x, point.y].join(',')).join(' ');
      svgSet(element, points, 'points');
      svgSet(element, fill, 'fill');
      svgAddClass(element, className);
      svgSet(element, id);
      return element;
  };
  const svgSetBox = (element, boxSize) => {
      assertSizeAboveZero(boxSize, 'svgSetBox');
      const justSize = sizeCopy(boxSize);
      const { width, height } = justSize;
      svgSetDimensions(element, justSize);
      const viewBox = `0 0 ${width} ${height}`;
      svgSet(element, viewBox, 'viewBox');
  };
  const svgElement = (size, svgItems) => {
      const element = globalThis.document.createElementNS(NamespaceSvg, 'svg');
      svgSet(element, '1.1', 'version');
      svgSet(element, NamespaceSvg, 'xmlns');
      svgAppend(element, svgItems);
      if (!sizeAboveZero(size))
          return element;
      svgSetBox(element, size);
      return element;
  };
  const svgSetDimensionsLock = (element, dimensions, lock) => {
      assertSizeAboveZero(dimensions);
      if (!lock)
          svgSet(element, 'none', 'preserveAspectRatio');
      const rect = {
          ...sizeLockNegative(dimensions, lock),
          ...pointCopy(dimensions)
      };
      svgSetDimensions(element, rect);
  };
  const svgImageElement = () => {
      const element = globalThis.document.createElementNS(NamespaceSvg, "image");
      svgSet(element, 'none', 'preserveAspectRatio');
      return element;
  };
  const svgPathElement = (path, fill = 'currentColor') => {
      const element = globalThis.document.createElementNS(NamespaceSvg, 'path');
      svgSet(element, path, 'd');
      svgSet(element, fill, 'fill');
      return element;
  };
  const svgMaskElement = (size, contentItem, luminance) => {
      const maskId = idGenerateString();
      const maskElement = globalThis.document.createElementNS(NamespaceSvg, 'mask');
      svgSet(maskElement, maskId);
      if (sizeAboveZero(size)) {
          // svgSetDimensions(maskElement, size)
          const color = luminance ? 'black' : 'none';
          svgAppend(maskElement, svgPolygonElement(size, '', color));
      }
      if (contentItem) {
          svgSet(contentItem, svgUrl(maskId), 'mask');
          if (luminance)
              svgSet(contentItem, 'luminance', 'mask-mode');
      }
      return maskElement;
  };
  const svgFilter = (values, dimensions) => {
      const { filter, ...rest } = values;
      assertPopulatedString(filter);
      const element = globalThis.document.createElementNS(NamespaceSvg, filter);
      svgSetDimensions(element, dimensions);
      Object.entries(rest).forEach(([key, value]) => {
          svgSet(element, String(value), key);
      });
      return element;
  };
  const svgAppend = (element, items) => {
      if (!items)
          return;
      const kids = isArray(items) ? items : [items];
      kids.forEach(kid => element.appendChild(kid));
  };
  const svgPatternElement = (dimensions, id, items) => {
      const element = globalThis.document.createElementNS(NamespaceSvg, 'pattern');
      svgSet(element, id);
      svgSetBox(element, dimensions);
      svgSet(element, 'userSpaceOnUse', 'patternUnits');
      svgAppend(element, items);
      return element;
  };
  const svgDefsElement = (svgItems) => {
      const element = globalThis.document.createElementNS(NamespaceSvg, 'defs');
      svgAppend(element, svgItems);
      return element;
  };
  const svgFeImageElement = (id, result) => {
      const element = globalThis.document.createElementNS(NamespaceSvg, 'feImage');
      if (isPopulatedString(id))
          svgSet(element, svgId(id), 'href');
      svgSet(element, result, 'result');
      return element;
  };
  const svgFilterElement = (filters, filtered, rect, units = 'userSpaceOnUse') => {
      const filterElement = globalThis.document.createElementNS(NamespaceSvg, 'filter');
      if (units)
          svgSet(filterElement, units, 'filterUnits');
      svgSet(filterElement, 'sRGB', 'color-interpolation-filters');
      svgAppend(filterElement, filters);
      if (filtered) {
          const filterId = idGenerateString();
          svgSet(filterElement, filterId);
          if (filtered) {
              const array = isArray(filtered) ? filtered : [filtered];
              array.forEach(filtered => {
                  svgSet(filtered, svgUrl(filterId), 'filter');
                  svgAddClass(filtered, 'filtered');
              });
          }
      }
      svgSetDimensions(filterElement, rect);
      return filterElement;
  };
  const svgDifferenceDefs = (overlayId, filtered) => {
      const filterObject = { filter: 'feBlend' };
      const resultId = idGenerateString();
      const differenceFilter = svgFilter({ ...filterObject, mode: 'difference' });
      svgSet(differenceFilter, resultId, 'in');
      svgSet(differenceFilter, 'SourceGraphic', 'in2');
      const image = svgFeImageElement(overlayId, resultId);
      const filter = svgFilterElement([image, differenceFilter], filtered, PointZero);
      svgSet(filter, '100%', 'width');
      svgSet(filter, '100%', 'height');
      return filter;
  };
  const svgSet = (element, value, name = 'id') => {
      if (isPopulatedString(value))
          element.setAttribute(name, value);
  };
  const svgAddClass = (element, className) => {
      if (!className)
          return;
      const array = isArray(className) ? className : className.split(' ');
      element.classList.add(...array);
  };
  const svgUseElement = (href, className, id) => {
      const element = globalThis.document.createElementNS(NamespaceSvg, 'use');
      if (isPopulatedString(href))
          svgSet(element, svgId(href), 'href');
      svgSet(element, id);
      svgAddClass(element, className);
      return element;
  };
  const svgSetTransform = (element, transform, origin = 'top left') => {
      svgSet(element, transform, 'transform');
      svgSet(element, origin, 'transform-origin');
  };
  const svgTransform = (dimensions, rect) => {
      assertSizeAboveZero(dimensions, 'svgTransform.dimensions');
      assertSizeAboveZero(rect, 'svgTransform.rect');
      const { width: inWidth, height: inHeight } = dimensions;
      const { width: outWidth, height: outHeight, x: outX, y: outY } = rect;
      const scaleWidth = outWidth / inWidth;
      const scaleHeight = outHeight / inHeight;
      const words = [];
      if (!(outX === 0 && outY === 0))
          words.push(`translate(${outX},${outY})`);
      if (!(scaleWidth === 1 && scaleHeight === 1)) {
          words.push(`scale(${scaleWidth},${scaleHeight})`);
      }
      if (isPoint(dimensions)) {
          const { x: inX, y: inY } = (dimensions);
          if (!(inX === 0 && inY === 0))
              words.push(`translate(${inX},${inY})`);
      }
      return words.join(' ');
  };
  const svgSetTransformRects = (element, dimensions, rect) => {
      svgSetTransform(element, svgTransform(dimensions, rect));
  };
  const svgFunc = (type, values) => {
      const element = globalThis.document.createElementNS(NamespaceSvg, type);
      svgSet(element, values, 'tableValues');
      svgSet(element, 'discrete', 'type');
      return element;
  };
  const svgSetChildren = (element, svgItems) => {
      if (!element.hasChildNodes())
          return svgAppend(element, svgItems);
      const { childNodes } = element;
      const nodes = [];
      childNodes.forEach(node => {
          if (!svgItems.includes(node))
              nodes.push(node);
      });
      nodes.forEach(node => { element.removeChild(node); });
      svgItems.forEach(node => element.appendChild(node));
  };

  const isLoadedVideo = (value) => {
      return value instanceof HTMLVideoElement;
  };
  const isLoadedImage = (value) => {
      return value instanceof HTMLImageElement;
  };
  const isLoadedAudio = (value) => {
      return value instanceof AudioBuffer;
  };
  const isLoaderType = (value) => {
      return isLoadType(value) || isGraphFileType(value);
  };
  function assertLoaderType(value, name) {
      if (!isLoaderType(value))
          throwError(value, "LoaderType", name);
  }
  const isLoaderPath = (value) => {
      return isPopulatedString(value) && value.includes(':');
  };
  function assertLoaderPath(value, name) {
      if (!isLoaderPath(value))
          throwError(value, "LoaderPath", name);
  }

  const urlEndpoint = (endpoint = {}) => {
      const { baseURI } = globalThis.document;
      const url = new URL(baseURI);
      const { protocol: withColon, host: hostWithPort, pathname: prefix, port } = url;
      const host = hostWithPort.split(':').shift();
      const protocol = withColon.slice(0, -1);
      const result = { protocol, host, prefix, ...endpoint };
      if (isNumeric(port))
          result.port = Number(port);
      // console.log("urlEndpoint", baseURI, "=>", result)
      return result;
  };
  const urlIsObject = (url) => url.startsWith('object:/');
  const urlIsHttp = (url) => url.startsWith('http');
  const urlHasProtocol = (url) => url.includes(':');
  const urlCombine = (url, path) => {
      const urlStripped = url.endsWith('/') ? url.slice(0, -1) : url;
      const pathStripped = path.startsWith('/') ? path.slice(1) : path;
      return urlStripped + '/' + pathStripped;
  };
  const urlFromEndpoint = (endpoint) => {
      const mergedEndpoint = urlEndpoint(endpoint);
      const { port, prefix, host, protocol } = mergedEndpoint;
      assertPopulatedString(host);
      assertPopulatedString(protocol);
      const bits = [];
      bits.push(protocol, '://', host);
      if (isNumeric(port))
          bits.push(':', String(port));
      const url = bits.join('');
      const combined = prefix ? urlCombine(url, prefix) : url;
      // console.log("urlFromEndpoint", endpoint, "=>", combined)
      return combined;
  };
  const urlForEndpoint = (endpoint, suffix = '') => {
      if (suffix && urlHasProtocol(suffix))
          return suffix;
      const base = urlFromEndpoint(endpoint);
      const slashed = base.endsWith('/') ? base : base + '/';
      if (!urlHasProtocol(slashed))
          return slashed + suffix;
      const url = new URL(suffix, slashed);
      const { href } = url;
      return href;
  };
  const urlIsRootProtocol = (protocol) => {
      return protocol === 'object' || urlIsHttp(protocol) || !isLoaderType(protocol);
  };
  const urlProtocol = (string) => {
      const colonIndex = string.indexOf(':');
      if (isAboveZero(colonIndex))
          return string.slice(0, colonIndex);
      return '';
  };
  const urlParse = (string) => {
      const colonIndex = string.indexOf(':');
      const slashIndex = string.indexOf('/');
      if (!(isPositive(colonIndex) && isPositive(slashIndex)))
          return [];
      const protocol = string.slice(0, colonIndex);
      const options = string.slice(colonIndex + 1, slashIndex);
      const rest = string.slice(slashIndex + 1);
      return [protocol, options, rest];
  };
  const urlsParsed = (string) => {
      if (!string)
          return [];
      const urls = [urlParse(string)];
      let lastPath = '';
      while (lastPath = arrayLast(arrayLast(urls))) {
          const parsed = urlParse(lastPath);
          if (!parsed.length)
              break;
          const [protocol, _, path] = parsed;
          if (protocol === 'object' || urlIsHttp(protocol))
              break;
          urls.push(parsed);
          if (urlIsRootProtocol(urlProtocol(path)))
              break;
      }
      return urls;
  };
  const urlsAbsolute = (string, endpoint) => {
      if (!string || urlIsRootProtocol(urlProtocol(string)))
          return [];
      const urls = urlsParsed(string);
      const lastUrl = arrayLast(urls);
      if (!lastUrl)
          return urls;
      const path = arrayLast(lastUrl);
      if (urlIsObject(path) || urlIsHttp(path))
          return urls;
      let absolute = urlForEndpoint(endpoint, path);
      const { length } = urls;
      for (let i = length - 1; i > -1; i--) {
          const url = urls[i];
          const [protocol, options] = url;
          url[2] = absolute;
          absolute = `${protocol}:${options}/${absolute}`;
      }
      return urls;
  };
  const urlOptionsObject = (options) => {
      if (!isPopulatedString(options))
          return;
      // console.log("parseOptions", type, options)
      const pairs = options.split(';');
      const entries = pairs.map(pair => {
          const [key, string] = pair.split('=');
          const value = isNumeric(string) ? Number(string) : string;
          return [key, value];
      });
      return Object.fromEntries(entries);
  };
  const urlOptions = (options) => {
      if (!options)
          return '';
      return Object.entries(options).map(entry => entry.join('=')).join(';');
  };
  const urlPrependProtocol = (protocol, url, options) => {
      if (url.startsWith(protocol) && !options)
          return url;
      return `${protocol}:${urlOptions(options)}/${url}`;
  };

  class DefinitionBase {
      constructor(...args) {
          const [object] = args;
          const { id, label, icon } = object;
          assertPopulatedString(id, 'id');
          this.id = id;
          if (isPopulatedString(label))
              this.label = label;
          if (isPopulatedString(icon))
              this.icon = icon;
      }
      icon;
      id;
      definitionIcon(loader, size) {
          const { icon } = this;
          if (!icon) {
              // console.log(this.constructor.name, "definitionIcon NO ICON")
              return;
          }
          // console.log(this.constructor.name, "definitionIcon", icon)
          return this.urlIcon(icon, loader, size);
      }
      instanceFromObject(object = {}) {
          return new InstanceBase(this.instanceArgs(object));
      }
      instanceArgs(object = {}) {
          const defaults = Object.fromEntries(this.properties.map(property => ([property.name, property.defaultValue])));
          return { ...defaults, ...object, definition: this };
      }
      label = '';
      properties = [];
      get propertiesModular() {
          return this.properties.filter(property => isDefinitionType(property.type));
      }
      toJSON() {
          const object = { id: this.id, type: this.type };
          if (this.icon)
              object.icon = this.icon;
          if (this.label !== this.id)
              object.label = this.label;
          return object;
      }
      toString() { return this.label; }
      type;
      urlIcon(url, loader, size) {
          const imageUrl = urlPrependProtocol('image', url);
          // console.log(this.constructor.name, "urlIcon", imageUrl)
          return loader.loadPromise(imageUrl).then((image) => {
              // console.log(this.constructor.name, "urlIcon.loadPromise", imageUrl, image?.constructor.name)
              const { width, height } = image;
              const inSize = { width, height };
              const coverSize = sizeCover(inSize, size, true);
              const outRect = { ...coverSize, ...centerPoint(size, coverSize) };
              const svgUrl = urlPrependProtocol('svg', imageUrl, outRect);
              // console.log(this.constructor.name, "urlIcon", svgUrl)
              return loader.loadPromise(svgUrl).then(svgImage => {
                  // console.log(this.constructor.name, "urlIcon.loadPromise", svgUrl, svgImage?.constructor.name)
                  return svgElement(size, svgImage);
              });
          });
      }
      static fromObject(object) {
          const { id, type } = object;
          assertDefinitionType(type);
          assertPopulatedString(id, 'id');
          return Factory[type].definition(object);
      }
  }

  class FilterClass extends InstanceBase {
      constructor(...args) {
          super(...args);
          const [object] = args;
          if (!isPopulatedObject(object))
              throw Errors.invalid.object + 'filter';
          const { parameters } = object;
          if (parameters?.length)
              this.parameters.push(...parameters.map(parameter => {
                  const { name, dataType } = parameter;
                  if (!dataType) {
                      // try to determine type from same parameter in definition
                      const existing = this.definition.parameters.find(p => p.name === name);
                      if (existing)
                          parameter.dataType = existing.dataType;
                  }
                  // console.log(this.constructor.name, "constructor", parameter)
                  return new Parameter(parameter);
              }));
      }
      commandFilters(args) {
          return this.definition.commandFilters({ ...args, filter: this });
      }
      parameters = [];
      _parametersDefined;
      get parametersDefined() {
          if (this._parametersDefined)
              return this._parametersDefined;
          const parameters = [...this.parameters];
          parameters.push(...this.definition.parameters.filter(parameter => !parameters.find(p => p.name === parameter.name)));
          return this._parametersDefined = parameters;
      }
      filterSvg(args = {}) {
          return this.definition.filterDefinitionSvg({ ...args, filter: this });
      }
      filterSvgFilter() {
          const valueObject = this.scalarObject();
          return this.definition.filterDefinitionSvgFilter(valueObject);
      }
      scalarObject(tweening = false) {
          const object = {};
          const { parametersDefined } = this;
          parametersDefined.forEach(parameter => {
              const { name, value } = parameter;
              if (isPopulatedString(value)) {
                  const property = this.properties.find(property => value === property.name);
                  if (property)
                      return;
              }
              if (isNumber(value) || isString(value))
                  object[name] = value;
          });
          this.properties.forEach(property => {
              const { tweenable, name } = property;
              if (isDefined(object[name]))
                  return;
              object[name] = this.value(name);
              if (!(tweening && tweenable))
                  return;
              const key = `${name}${PropertyTweenSuffix}`;
              object[key] = this.value(key);
          });
          // console.log(this.constructor.name, "scalerObject", object, parametersDefined.map(p => p.name))
          return object;
      }
      toJSON() {
          const object = { id: this.definitionId };
          if (this.parameters.length)
              object.parameters = this.parameters;
          return object;
      }
      toString() {
          return `[Filter ${this.label}]`;
      }
  }

  class FilterDefinitionClass extends DefinitionBase {
      commandFilters(args) {
          const { filter, duration, filterInput } = args;
          assertPopulatedString(filterInput);
          const commandFilters = [];
          const options = filter.scalarObject(!!duration);
          assertValueObject(options);
          const { ffmpegFilter } = this;
          const commandFilter = {
              inputs: [filterInput], ffmpegFilter, options, outputs: [idGenerate(ffmpegFilter)]
          };
          commandFilters.push(commandFilter);
          return commandFilters;
      }
      commandFilter(options = {}) {
          const { ffmpegFilter } = this;
          const commandFilter = {
              ffmpegFilter, options, inputs: [], outputs: [idGenerate(ffmpegFilter)]
          };
          return commandFilter;
      }
      _ffmpegFilter;
      get ffmpegFilter() {
          return this._ffmpegFilter ||= this.id.split('.').pop() || this.id;
      }
      filterDefinitionSvg(args) {
          throw new Error(Errors.unimplemented + 'initialSvgContent');
      }
      instanceFromObject(object = {}) {
          return new FilterClass(this.instanceArgs(object));
      }
      parameters = [];
      populateParametersFromProperties() {
          this.parameters = this.properties.map(property => {
              const { name } = property;
              return new Parameter({ name, value: name, dataType: exports.DataType.String });
          });
      }
      filterDefinitionSvgFilter(valueObject) {
          throw Errors.unimplemented;
      }
      colorCommandFilter(dimensions, videoRate = 0, duration = 0, color = colorWhiteTransparent) {
          const { width, height } = dimensions;
          const transparentFilter = 'color';
          const transparentId = idGenerate(transparentFilter);
          const object = { color, size: `${width}x${height}` };
          if (videoRate)
              object.rate = videoRate;
          if (duration)
              object.duration = duration;
          const commandFilter = {
              inputs: [], ffmpegFilter: transparentFilter,
              options: object,
              outputs: [transparentId]
          };
          return commandFilter;
      }
      type = exports.DefinitionType.Filter;
  }

  /**
   * @category Filter
   */
  class ChromaKeyFilter extends FilterDefinitionClass {
      constructor(...args) {
          super(...args);
          this.properties.push(propertyInstance({
              custom: true, name: 'color', type: exports.DataType.String,
              defaultValue: colorGreen
          }));
          this.properties.push(propertyInstance({
              custom: true, name: 'similarity', type: exports.DataType.Percent,
              defaultValue: 0.9, min: 0.1, step: 0.01, max: 1.0,
          }));
          this.properties.push(propertyInstance({
              custom: true, name: 'blend', type: exports.DataType.Percent,
              defaultValue: 0.0, step: 0.01, max: 1.0,
          }));
          this.populateParametersFromProperties();
      }
      filterDefinitionSvgFilter(object) {
          const { similarity, color, blend } = object;
          assertNumber(similarity);
          assertNumber(blend);
          assertPopulatedString(color);
          const max = 255.0;
          const range = max * max * (1.0 - blend);
          const rgb = colorToRgb(color);
          // console.log("filterDefinitionSvgFilters", rgb)
          const r = 1.0 - (similarity * ((rgb.r) / max));
          const g = 1.0 - (similarity * ((rgb.g) / max));
          const b = 1.0 - (similarity * ((rgb.b) / max));
          const values = `1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 ${r} ${g} ${b} -${range} ${range}`;
          const svgFilters = [];
          const colorMatrix = {
              filter: 'feColorMatrix',
              type: 'matrix',
              values,
          };
          svgFilters.push(svgFilter(colorMatrix));
          // const componentTransfer: StringObject = {
          //   filter: 'feComponentTransfer', result: 'colorToBlack'
          // }
          // const componentTransferFilter = svgFilter(componentTransfer)
          // const funcR = svgFunc('feFuncR', '0 1')
          // const funcG = svgFunc('feFuncG', '0 1 1  1 1 1')
          // const funcB = svgFunc('feFuncB', '0 1')
          // svgAppend(componentTransferFilter, [funcR, funcG, funcB])
          // svgFilters.push(componentTransferFilter)
          // const blackAndWhiteMatrix: StringObject = {
          //   filter: 'feColorMatrix',
          //   type: 'matrix',
          //   values: '10 11 10 0 0 10 10 10 0 0 10 10 10 0 0 0 0 0 1 0',
          //   result: 'blackAndWhite', in: 'colorToBlack',
          // }
          // svgFilters.push(svgFilter(blackAndWhiteMatrix))
          // const whiteToTransparentMatrix: StringObject = {
          //   filter: 'feColorMatrix',
          //   type: 'matrix',
          //   values: '1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 -1 0 0 1 0',
          //   result: 'whiteToTransparent', in: 'blackAndWhite',
          // }
          // svgFilters.push(svgFilter(whiteToTransparentMatrix))
          // const element = globalThis.document.createElementNS(NamespaceSvg, 'feComposite')
          // svgSet(element, 'out', 'operator')
          // svgSet(element, 'SourceGraphic', 'in')
          // // svgSet(element, 'blackAndWhite', 'in')
          // svgFilters.push(element)
          return svgFilters;
      }
  }
  // <filter id='greenScreen' color-interpolation-filters="sRGB">
  // <feComponentTransfer result='colorToBlack'>
  //   <feFuncR id='funcR' type='discrete' tableValues='0 1 1  1 1 1'/>
  //   <feFuncG id='funcG' type='discrete' tableValues='0 1 '/>
  //   <feFuncB id='funcB' type='discrete' tableValues='0 1'/>
  // </feComponentTransfer> 
  // <feColorMatrix in='colorToBlack' result='blackAndWhite' type='matrix' 
  //          values='10 11 10 0 0
  //                  10 10 10 0 0
  //                  10 10 10 0 0
  //                  0 0 0 1 0'/> 
  // <feColorMatrix in='blackAndWhite' result='whiteToTransparent' type='matrix' 
  //          values='1 0 0 0 0
  //                  0 1 0 0 0
  //                  0 0 1 0 0
  //                 -1 0 0 1 0'/>  
  // <feComposite  ='' in='SourceGraphic' in='blackAndWhite' />  
  // </filter>

  const roundMethod = (rounding = '') => {
      switch (rounding) {
          case 'ceil': return Math.ceil;
          case 'floor': return Math.floor;
          default: return Math.round;
      }
  };
  const roundWithMethod = (number, method = '') => {
      const func = roundMethod(method);
      return func(number);
  };

  const pixelFromPoint = (pt, width) => pt.y * width + pt.x;
  const pixelToPoint = (index, width) => ({ x: index % width, y: Math.floor(index / width) });
  const pixelToIndex = (pixel) => pixel * 4;
  const pixelRgbaAtIndex = (index, pixels) => ({
      r: pixels[index],
      g: pixels[index + 1],
      b: pixels[index + 2],
      a: pixels[index + 3],
  });
  const pixelRgba = (pixel, data) => pixelRgbaAtIndex(pixelToIndex(pixel), data);
  const pixelSafe = (pixel, offsetPoint, size) => {
      const { x, y } = offsetPoint;
      const { width, height } = size;
      const pt = pixelToPoint(pixel, width);
      pt.x = Math.max(0, Math.min(width - 1, pt.x + x));
      pt.y = Math.max(0, Math.min(height - 1, pt.y + y));
      return pixelFromPoint(pt, width);
  };
  const pixelNeighboringPixels = (pixel, size) => {
      const depth = 3;
      const pixels = [];
      const halfSize = Math.floor(depth / 2);
      for (let y = 0; y < depth; y += 1) {
          for (let x = 0; x < depth; x += 1) {
              const offsetPoint = { x: x - halfSize, y: y - halfSize };
              pixels.push(pixelSafe(pixel, offsetPoint, size));
          }
      }
      return pixels;
  };
  const pixelNeighboringRgbas = (pixel, data, size) => (pixelNeighboringPixels(pixel, size).map(p => pixelRgba(p, data)));
  const pixelColor = (value) => {
      const string = String(value);
      if (string.slice(0, 2) === "0x")
          return `#${string.slice(2)}`;
      return string;
  };
  const pixelPerFrame = (frames, width, zoom = 1) => {
      if (!(frames && width))
          return 0;
      const widthFrames = width / frames;
      const min = Math.min(1, widthFrames);
      const max = Math.max(1, widthFrames);
      if (zoom === 1)
          return max;
      if (!zoom)
          return min;
      return min + ((max - min) * zoom);
  };
  const pixelFromFrame = (frame, perFrame, rounding = 'ceil') => {
      if (!(frame && perFrame))
          return 0;
      const pixels = frame * perFrame;
      return roundWithMethod(pixels, rounding);
  };
  const pixelToFrame = (pixels, perFrame, rounding = 'round') => {
      if (!(pixels && perFrame))
          return 0;
      return roundWithMethod(pixels / perFrame, rounding);
  };
  function pixelsMixRbga(fromRgba, toRgba, amountToMix = 1.0) {
      return Object.fromEntries(colorRgbaKeys.map(key => {
          return [key, Math.round((fromRgba[key] * amountToMix) + (toRgba[key] * (1 - amountToMix)))];
      }));
  }
  function pixelsMixRbg(fromRgb, toRgb, amountToMix = 1.0) {
      return Object.fromEntries(colorRgbKeys.map(key => {
          return [key, Math.round((fromRgb[key] * (1 - amountToMix)) + (toRgb[key] * amountToMix))];
      }));
  }
  const pixelsRemoveRgba = (pixels, size, rgb, similarity = 0, blend = 0, accurate = false) => {
      pixelsReplaceRgba(pixels, size, rgb, colorRgbaTransparent, similarity, blend);
  };
  const pixelsReplaceRgba = (pixels, size, find, replace, similarity = 0, blend = 0, accurate = false) => {
      const yuv = colorRgbToYuv(find);
      let index = pixels.length / 4;
      while (index--) {
          const pixels_offset = index * 4;
          const rgbaAtIndex = pixelRgbaAtIndex(pixels_offset, pixels);
          if (isPositive(rgbaAtIndex.a)) {
              const rgbaAsYuv = colorRgbToYuv(rgbaAtIndex);
              const difference = accurate ? colorYuvBlend(yuvsFromPixelsAccurate(pixels, index, size), yuv, similarity, blend) : colorYuvDifference(rgbaAsYuv, yuv, similarity, blend);
              const mixed = pixelsMixRbga(rgbaAtIndex, replace, difference);
              pixels[pixels_offset + 3] = mixed.a;
              if (mixed.a) {
                  pixels[pixels_offset] = mixed.r;
                  pixels[pixels_offset + 1] = mixed.g;
                  pixels[pixels_offset + 2] = mixed.b;
              }
          }
      }
  };
  const yuvsFromPixelsAccurate = (pixels, index, size) => {
      // console.log(this.constructor.name, "yuvsFromPixelsAccurate")
      return pixelNeighboringRgbas(index * 4, pixels, size).map(rgb => colorRgbToYuv(rgb));
  };

  const tweenPad = (outputDistance, scaledDistance, scale, offE = false, offW = false) => {
      assertPositive(scale);
      assertPositive(scaledDistance);
      const baseDistance = outputDistance - scaledDistance;
      const east = offE ? scaledDistance : 0;
      const west = offW ? scaledDistance : 0;
      const distance = baseDistance + east + west;
      const scaled = distance * scale;
      const x = scaled - east;
      return x;
  };
  const tweenNumberStep = (number, numberEnd, frame, frames) => {
      const unit = (numberEnd - number) / frames;
      return number + (unit * frame);
  };
  const tweenColorStep = (value, valueEnd, frame, frames) => {
      assertString(value);
      assertString(valueEnd);
      const offset = frame / frames;
      assertTrue(colorValidHex(value), 'hex color');
      if (value.length === 7 || value.length === 4) {
          const result = colorRgbToHex(pixelsMixRbg(colorToRgb(value), colorToRgb(valueEnd), offset));
          return result;
      }
      return colorRgbaToHex(pixelsMixRbga(colorToRgba(value), colorToRgba(valueEnd), offset));
  };
  const tweenRectStep = (rect, rectEnd, frame, frames) => {
      return {
          x: tweenNumberStep(rect.x, rectEnd.x, frame, frames),
          y: tweenNumberStep(rect.y, rectEnd.y, frame, frames),
          width: tweenNumberStep(rect.width, rectEnd.width, frame, frames),
          height: tweenNumberStep(rect.height, rectEnd.height, frame, frames),
      };
  };
  const tweenColors = (color, colorEnd, frames) => {
      assertPopulatedString(color);
      const colors = [color];
      if (isPopulatedString(colorEnd) && frames > 1) {
          for (let frame = 1; frame < frames; frame++) {
              colors.push(tweenColorStep(color, colorEnd, frame, frames));
          }
      }
      return colors;
  };
  const tweenRects = (rect, rectEnd, frames) => {
      const rects = [rect];
      if (rectEnd && frames > 1) {
          for (let frame = 1; frame < frames; frame++) {
              rects.push(tweenRectStep(rect, rectEnd, frame, frames));
          }
      }
      return rects;
  };
  const tweenMaxSize = (size, sizeEnd) => {
      const { width, height } = size;
      if (!isSize(sizeEnd) || sizesEqual(size, sizeEnd))
          return { width, height };
      return {
          width: Math.max(width, sizeEnd.width),
          height: Math.max(height, sizeEnd.height),
      };
  };
  const tweenMinSize = (size, sizeEnd) => {
      const { width, height } = size;
      if (!isSize(sizeEnd) || sizesEqual(size, sizeEnd))
          return { width, height };
      return {
          width: Math.min(width, sizeEnd.width),
          height: Math.min(height, sizeEnd.height),
      };
  };
  const tweenOption = (optionStart, optionEnd, pos, round) => {
      assertNumber(optionStart);
      const start = round ? Math.round(optionStart) : optionStart;
      if (!isNumber(optionEnd))
          return start;
      const end = round ? Math.round(optionEnd) : optionEnd;
      if (start === end)
          return start;
      pos.includes('n') ? 'n' : 'N';
      return `(${start}+(${end - start}*${pos}))`; // `(${start}+(${nCased} * 10))` //
  };
  const tweenableRects = (rect, rectEnd) => {
      if (!isRect(rectEnd))
          return false;
      if (rect.x !== rectEnd.x)
          return true;
      if (rect.y !== rectEnd.y)
          return true;
      if (rect.width !== rectEnd.width)
          return true;
      if (rect.height !== rectEnd.height)
          return true;
      return false;
  };
  const tweenPosition = (videoRate, duration, frame = 'n') => (`(${frame}/${videoRate * duration})`);
  const tweenNumberObject = (object) => {
      if (!isObject(object))
          return {};
      const entries = Object.entries(object).filter(([_, value]) => isNumber(value));
      return Object.fromEntries(entries);
  };
  const tweenOverRect = (rect, rectEnd) => {
      return { ...rect, ...tweenNumberObject(rectEnd) };
  };
  const tweenOverPoint = (point, pointEnd) => {
      return { ...point, ...tweenNumberObject(pointEnd) };
  };
  const tweenOverSize = (point, pointEnd) => {
      if (!isDefined(pointEnd))
          return point;
      return { ...point, ...tweenNumberObject(pointEnd) };
  };
  const tweenScaleSizeToRect = (size, rect, offDirections = {}) => {
      assertSize(size);
      assertRect(rect);
      const { width: outWidth, height: outHeight } = size;
      const { x, y, width, height } = rect;
      assertPositive(x);
      assertPositive(y);
      assertPositive(width);
      assertPositive(height);
      const scaledSize = sizeScale(size, width, height);
      const evenSize = sizeCeil(scaledSize);
      const result = {
          ...evenSize,
          x: Math.round(tweenPad(outWidth, evenSize.width, x, offDirections.E, offDirections.W)),
          y: Math.round(tweenPad(outHeight, evenSize.height, y, offDirections.N, offDirections.S))
      };
      return result;
  };
  const tweenCoverSizes = (inSize, outSize, scales) => {
      const outSizes = isArray(outSize) ? outSize : [outSize, outSize];
      const [rect, rectEnd] = outSizes;
      const unscaledSize = sizeCover(inSize, rect);
      const unscaledSizeEnd = sizeCover(inSize, rectEnd);
      const [scale, scaleEnd] = scales;
      const { width, height } = scale;
      const { width: widthEnd, height: heightEnd } = scaleEnd;
      const scaledSize = sizeScale(unscaledSize, width, height);
      const scaledSizeEnd = sizeScale(unscaledSizeEnd, widthEnd, heightEnd);
      const coverSize = sizeCeil(scaledSize);
      const coverSizeEnd = sizeCeil(scaledSizeEnd);
      const coverRects = [coverSize, coverSizeEnd];
      return coverRects;
  };
  const tweenCoverPoints = (scaledSizes, outSize, scales) => {
      const outSizes = isArray(outSize) ? outSize : [outSize, outSize];
      const [coverSize, coverSizeEnd] = scaledSizes;
      const [rect, rectEnd] = outSizes;
      const [scale, scaleEnd] = scales;
      const { x, y } = scale;
      const { x: xEnd, y: yEnd } = scaleEnd;
      const point = {
          x: x * (coverSize.width - rect.width),
          y: y * (coverSize.height - rect.height),
      };
      const pointEnd = {
          x: xEnd * (coverSizeEnd.width - rectEnd.width),
          y: yEnd * (coverSizeEnd.height - rectEnd.height),
      };
      return [point, pointEnd];
  };
  const tweenRectLock = (rect, lock) => ({
      ...rect, ...sizeLock(rect, lock)
  });
  const tweenRectsLock = (rects, lock) => {
      return rects.map(rect => tweenRectLock(rect, lock));
  };
  const tweenScaleSizeRatioLock = (scale, outputSize, inRatio, lock) => {
      if (!lock)
          return scale;
      const { width: outWidth, height: outHeight } = outputSize;
      const forcedScale = { ...scale };
      switch (lock) {
          case exports.Orientation.H:
              forcedScale.width = ((outHeight * forcedScale.height) * inRatio) / outWidth;
              break;
          case exports.Orientation.V:
              forcedScale.height = ((outWidth * forcedScale.width) / inRatio) / outHeight;
              break;
      }
      return forcedScale;
  };
  const tweeningPoints = (tweenable) => {
      assertTweenable(tweenable);
      const { clip } = tweenable;
      const { track } = clip;
      const { mash } = track;
      const { quantize } = mash;
      const timeRange = clip.timeRange(quantize);
      const tweenPoints = tweenable.tweenPoints(timeRange, timeRange);
      return !pointsEqual(...tweenPoints);
  };
  const tweenMinMax = (value, min, max) => {
      return Math.min(max, Math.max(min, value));
  };
  const tweenInputTime = (timeRange, onEdge, nearStart, endDefined, endSelected) => {
      if (!endDefined)
          return;
      if (!onEdge)
          return nearStart ? timeRange.startTime : timeRange.lastTime;
      if (endSelected) {
          if (nearStart)
              return timeRange.lastTime;
      }
      else if (!nearStart)
          return timeRange.startTime;
  };

  /**
   * @category Filter
   */
  class ColorizeFilter extends FilterDefinitionClass {
      constructor(...args) {
          super(...args);
          this.properties.push(propertyInstance({
              tweenable: true, custom: true, name: 'color', type: exports.DataType.String,
          }));
          this.populateParametersFromProperties();
      }
      _ffmpegFilter = 'geq';
      commandFilters(args) {
          const commandFilters = [];
          const { filter, videoRate, duration, filterInput: input } = args;
          assertNumber(duration, 'duration');
          assertNumber(videoRate, 'videoRate');
          const color = filter.value('color');
          assertPopulatedString(color, 'color');
          let filterInput = input;
          assertPopulatedString(filterInput, 'filterInput');
          const formatFilter = 'format';
          const formatId = idGenerate(formatFilter);
          const formatCommandFilter = {
              inputs: [filterInput], ffmpegFilter: formatFilter,
              options: { pix_fmts: 'rgba' }, outputs: [formatId]
          };
          commandFilters.push(formatCommandFilter);
          filterInput = formatId;
          const colorEnd = filter.value(`color${PropertyTweenSuffix}`) || color;
          assertPopulatedString(colorEnd);
          const alpha = color.length > 7;
          const fromColor = alpha ? colorToRgba(color) : colorToRgb(color);
          const toColor = alpha ? colorToRgba(colorEnd) : colorToRgb(colorEnd);
          const keys = alpha ? colorRgbaKeys : colorRgbKeys;
          const options = {};
          const position = duration ? tweenPosition(videoRate, duration, 'N') : 0;
          keys.forEach(key => {
              const from = fromColor[key];
              const to = toColor[key];
              if (from === to)
                  options[key] = from;
              else
                  options[key] = `${from}+(${to - from}*${position})`;
          });
          if (!alpha)
              options.a = 'alpha(X,Y)';
          const geqFilter = 'geq';
          const geqFilterId = idGenerate(geqFilter);
          const geqCommandFilter = {
              inputs: [filterInput], ffmpegFilter: geqFilter,
              options, outputs: [geqFilterId]
          };
          commandFilters.push(geqCommandFilter);
          return commandFilters;
      }
  }

  /**
   * @category Filter
   */
  class ColorFilter extends ColorizeFilter {
      constructor(...args) {
          super(...args);
          this.properties.push(propertyInstance({
              tweenable: true, name: 'color', type: exports.DataType.String
          }));
          const keys = ['width', 'height'];
          keys.forEach(name => {
              this.properties.push(propertyInstance({
                  tweenable: true, name, type: exports.DataType.Number
              }));
          });
          this.populateParametersFromProperties();
      }
      commandFilters(args) {
          const commandFilters = [];
          const { filter, videoRate, duration } = args;
          assertAboveZero(videoRate, 'videoRate');
          const { ffmpegFilter } = this;
          let filterInput = idGenerate(ffmpegFilter);
          const color = filter.value('color');
          assertPopulatedString(color);
          const colorEnd = duration ? filter.value(`color${PropertyTweenSuffix}`) : undefined;
          const tweeningColor = isPopulatedString(colorEnd) && color !== colorEnd;
          const scalars = filter.scalarObject(!!duration);
          assertSize(scalars);
          const { width, height } = scalars;
          let tweeningSize = false;
          const startSize = { width, height };
          const endSize = { width, height };
          if (duration) {
              const { [`width${PropertyTweenSuffix}`]: widthEnd = width, [`height${PropertyTweenSuffix}`]: heightEnd = height, } = scalars;
              assertNumber(widthEnd);
              assertNumber(heightEnd);
              tweeningSize = !(width === widthEnd && height === heightEnd);
              if (tweeningSize) {
                  endSize.width = widthEnd;
                  endSize.height = heightEnd;
              }
          }
          const maxSize = tweeningSize ? tweenMaxSize(startSize, endSize) : startSize;
          const colorCommandFilter = {
              inputs: [], ffmpegFilter,
              options: {
                  color, rate: videoRate, size: Object.values(maxSize).join('x')
              },
              outputs: [filterInput]
          };
          if (isAboveZero(duration))
              colorCommandFilter.options.duration = duration;
          commandFilters.push(colorCommandFilter);
          // console.log(this.constructor.name, "commandFilters", tweeningColor, color, colorEnd, duration)
          if (tweeningColor) {
              const fadeFilter = 'fade';
              const fadeFilterId = idGenerate(fadeFilter);
              const fadeCommandFilter = {
                  inputs: [filterInput], ffmpegFilter: fadeFilter,
                  options: {
                      type: 'out',
                      color: colorEnd, duration,
                  },
                  outputs: [fadeFilterId]
              };
              commandFilters.push(fadeCommandFilter);
              filterInput = fadeFilterId;
          }
          if (tweeningSize) {
              const scaleFilter = 'scale';
              const scaleFilterId = idGenerate(scaleFilter);
              const position = tweenPosition(videoRate, duration);
              const scaleCommandFilter = {
                  inputs: [filterInput], ffmpegFilter: scaleFilter,
                  options: {
                      eval: 'frame',
                      width: tweenOption(startSize.width, endSize.width, position),
                      height: tweenOption(startSize.height, endSize.height, position),
                  },
                  outputs: [scaleFilterId]
              };
              commandFilters.push(scaleCommandFilter);
          }
          return commandFilters;
      }
      _ffmpegFilter = 'color';
      filterDefinitionSvg(args) {
          const { filter } = args;
          const valueObject = filter.scalarObject(false);
          const { width, height, color } = valueObject;
          assertPopulatedString(color);
          const rectElement = globalThis.document.createElementNS(NamespaceSvg, 'rect');
          rectElement.setAttribute('width', String(width));
          rectElement.setAttribute('height', String(height));
          rectElement.setAttribute('fill', pixelColor(color));
          return rectElement;
      }
  }

  const ColorChannelMixerFilterKeys = colorRgbaKeys.flatMap(c => colorRgbaKeys.map(d => `${c}${d}`));
  /**
   * @category Filter
   */
  class ColorChannelMixerFilter extends FilterDefinitionClass {
      constructor(...args) {
          super(...args);
          ColorChannelMixerFilterKeys.forEach(name => {
              this.properties.push(propertyInstance({
                  custom: true, name, type: exports.DataType.Number,
                  defaultValue: name[0] === name[1] ? 1.0 : 0.0,
                  min: 0.0, max: 1.0
              }));
          });
          this.populateParametersFromProperties();
      }
      filterDefinitionSvgFilter(object) {
          const bits = colorRgbaKeys.flatMap(c => [...colorRgbaKeys.map(d => Number(object[`${c}${d}`])), 0]);
          const options = {
              filter: 'feColorMatrix',
              type: 'matrix',
              values: bits.join(' '),
          };
          return [svgFilter(options)];
      }
  }
  // covert to grayscale -> colorchannelmixer=.3:.4:.3:0:.3:.4:.3:0:.3:.4:.3

  exports.ActivityType = void 0;
  (function (ActivityType) {
      ActivityType["Analyze"] = "analyze";
      ActivityType["Complete"] = "complete";
      ActivityType["Error"] = "error";
      ActivityType["Load"] = "load";
      ActivityType["Render"] = "render";
  })(exports.ActivityType || (exports.ActivityType = {}));

  const commandFilesInputIndex = (commandFiles, id) => {
      const inputCommandFiles = commandFiles.filter(commandFile => commandFile.input);
      const inputIndex = inputCommandFiles.findIndex(commandFile => commandFile.inputId === id);
      if (!isPositive(inputIndex))
          console.log("commandFilesInputIndex", id, inputCommandFiles);
      assertPositive(inputIndex, 'commandFilesInputIndex');
      return inputIndex;
  };
  const commandFilesInput = (commandFiles, id, visible) => ([commandFilesInputIndex(commandFiles, id), visible ? 'v' : 'a'].join(':'));

  const eventStop = (event) => {
      event.preventDefault();
      event.stopPropagation();
  };

  const fetchCallback = (apiCallback) => {
      const { endpoint, request } = apiCallback;
      const init = request || {};
      const typeKey = 'Content-Type';
      const jsonType = 'application/json';
      const formType = 'multipart/form-data';
      init.method ||= 'POST';
      init.headers ||= {};
      init.headers[typeKey] ||= jsonType;
      switch (init.headers[typeKey]) {
          case jsonType: {
              init.body = JSON.stringify(init.body);
              break;
          }
          case formType: {
              const formData = new FormData();
              Object.entries(init.body).forEach(([key, value]) => {
                  if (isUndefined(value))
                      return;
                  formData.set(key, value instanceof Blob ? value : String(value));
              });
              init.body = formData;
              delete init.headers[typeKey];
              break;
          }
      }
      const url = urlForEndpoint(endpoint);
      return fetch(url, init).then(response => response.json());
  };

  const isSelectedProperty = (value) => {
      return isObject(value) && "changeHandler" in value;
  };
  const selectedPropertyObject = (properties, group, selectType) => {
      const filtered = properties.filter(prop => {
          if (!isSelectedProperty(prop))
              return false;
          return prop.property.group === group && prop.selectType === selectType;
      });
      // console.log("selectedPropertyObject", properties.length, filtered.length, group, selectType)
      const byName = Object.fromEntries(filtered.map(selected => {
          const { name: nameOveride, property } = selected;
          const { name } = property;
          return [nameOveride || name, selected];
      }));
      return byName;
  };
  const selectedPropertiesScalarObject = (byName) => {
      return Object.fromEntries(Object.entries(byName).map(entry => {
          return [entry[0], entry[1].value];
      }));
  };

  const sortByFrame = (a, b) => (a.frame - b.frame);
  const sortByIndex = (a, b) => (a.index - b.index);
  const sortByTrack = (a, b) => (a.trackNumber - b.trackNumber);
  const sortByLabel = (a, b) => {
      if (a.label < b.label)
          return -1;
      if (a.label > b.label)
          return 1;
      return 0;
  };

  const stringSeconds = (seconds, fps = 0, lengthSeconds = 0) => {
      const bits = [];
      let pad = 2;
      let time = 60 * 60; // an hour
      let do_rest = false;
      const duration = lengthSeconds || seconds;
      // console.log("stringSeconds seconds", seconds, "fps", fps, "duration", duration)
      if (duration >= time) {
          if (seconds >= time) {
              bits.push(String(Math.floor(seconds / time)).padStart(pad, '0'));
              do_rest = true;
              seconds = seconds % time;
          }
          else
              bits.push('00:');
      }
      time = 60; // a minute
      if (do_rest || (duration >= time)) {
          // console.log("stringSeconds duration", duration, ">=", time, "time")
          if (do_rest)
              bits.push(':');
          if (seconds >= time) {
              bits.push(String(Math.floor(seconds / time)).padStart(pad, '0'));
              do_rest = true;
              seconds = seconds % time;
          }
          else
              bits.push('00:');
      }
      time = 1; // a second
      if (do_rest || (duration >= time)) {
          // console.log("stringSeconds duration", duration, ">=", time, "time")
          if (do_rest)
              bits.push(':');
          if (seconds >= time) {
              // console.log("stringSeconds seconds", seconds, ">=", time, "time")
              bits.push(String(Math.floor(seconds / time)).padStart(pad, '0'));
              do_rest = true;
              seconds = seconds % time;
          }
          else {
              // console.log("stringSeconds seconds", seconds, "<", time, "time")
              bits.push('00');
          }
      }
      else {
          // console.log("stringSeconds duration", duration, "<", time, "time")
          bits.push('00');
      }
      if (fps > 1) {
          // console.log("stringSeconds fps", fps, "> 1")
          if (fps === 10)
              pad = 1;
          bits.push('.');
          if (seconds) {
              // console.log("stringSeconds seconds", seconds, "true pad", pad)
              if (pad === 1)
                  seconds = Math.round(seconds * 10) / 10;
              else
                  seconds = Math.round(100 * seconds) / 100;
              // console.log("stringSeconds seconds", String(seconds), "presliced")
              seconds = Number(String(seconds).slice(2));
              // console.log("stringSeconds seconds", seconds, "sliced")
              bits.push(String(seconds).padEnd(pad, '0'));
              // console.log("stringSeconds seconds", seconds, "padded")
          }
          else {
              // console.log("stringSeconds seconds", seconds, "false")
              bits.push('0'.padStart(pad, '0'));
          }
      }
      return bits.join('');
  };
  const stringFamilySizeRect = (string, family, size) => {
      if (!(isPopulatedString(string) && isAboveZero(size)))
          return RectZero;
      const { document } = globalThis;
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      assertObject(ctx);
      ctx.font = `${size}px ${family}`;
      const metrics = ctx.measureText(string);
      // const font = new FontFace(family, string)
      const { actualBoundingBoxAscent, actualBoundingBoxDescent, actualBoundingBoxLeft, actualBoundingBoxRight, width, } = metrics;
      // console.log("stringFamilySizeRect", "actualBoundingBoxAscent", actualBoundingBoxAscent, "actualBoundingBoxDescent", actualBoundingBoxDescent)
      return {
          x: actualBoundingBoxLeft, y: actualBoundingBoxAscent,
          width: actualBoundingBoxLeft + actualBoundingBoxRight,
          height: actualBoundingBoxAscent + actualBoundingBoxDescent,
      };
  };
  const stringPluralize = (count, value, suffix = 's') => {
      if (!isPopulatedString(value))
          return value;
      return `${count} ${value}${count === 1 ? '' : suffix}`;
  };

  /**
   * @category Filter
   */
  class ConvolutionFilter extends FilterDefinitionClass {
      constructor(...args) {
          super(...args);
          this.properties.push(propertyInstance({
              custom: true, name: "bias",
              defaultValue: 0.0, min: 0.0, max: 100.0, step: 0.01
          }));
          this.properties.push(propertyInstance({
              custom: true, name: "matrix", defaultValue: "0 0 0 0 1 0 0 0 0",
          }));
          this.properties.push(propertyInstance({
              custom: true, name: "multiplier",
              defaultValue: 1.0, min: 0.0, max: 100.0, step: 0.01
          }));
          this.populateParametersFromProperties();
      }
      commandFilters(args) {
          const { filterInput, filter, duration } = args;
          assertPopulatedString(filterInput, 'filterInput');
          const commandFilters = [];
          const values = filter.scalarObject(!!duration);
          assertConvolutionServerFilter(values);
          const { ffmpegFilter } = this;
          const commandFilter = {
              inputs: [filterInput], ffmpegFilter,
              options: optionsFromObject(parse(values)),
              outputs: [idGenerate(ffmpegFilter)]
          };
          commandFilters.push(commandFilter);
          return commandFilters;
      }
      filterDefinitionSvgFilter(valueObject) {
          assertConvolutionServerFilter(valueObject);
          const { matrix, bias, multiplier } = valueObject;
          const object = {
              filter: 'feConvolveMatrix',
              kernelMatrix: String(matrix),
              bias: String(bias)
          };
          if (isAboveZero(multiplier))
              object.divisor = String(multiplier);
          // console.log(this.constructor.name, "filterDefinitionSvgFilter", object)
          return [svgFilter(object)];
      }
  }
  const isConvolutionServerFilter = (value) => {
      return isObject(value) && "matrix" in value && "bias" in value && "multiplier" in value;
  };
  function assertConvolutionServerFilter(value) {
      if (!isConvolutionServerFilter(value))
          throw new Error("expected ConvolutionServerFilter");
  }
  const matrixFromString = (string) => {
      const definedString = string || "0 0 0 0 1 0 0 0 0";
      return definedString.split(',').map(component => parseInt(component.trim()));
  };
  const biasFromString = (string) => {
      if (!string?.length)
          return 0.0;
      return parseFloat(string.trim());
  };
  const multiplierFromString = (string) => {
      if (!string?.length)
          return 1.0;
      if (string.includes('/')) {
          const components = string.split('/').map(component => parseFloat(component.trim()));
          const [a, b] = components;
          return a / b;
      }
      return parseFloat(string.trim());
  };
  const fromCombined = (combined) => {
      return { combined, r: combined, g: combined, b: combined, a: combined };
  };
  const numbersFromCombined = (combined) => {
      return { combined, r: combined, g: combined, b: combined, a: combined };
  };
  const numberFromCombined = (combined) => {
      return { combined, r: combined, g: combined, b: combined, a: combined };
  };
  const convolutionStringObject = (combined) => {
      return fromCombined(String(combined));
  };
  const convolutionMatrixObject = (stringObject) => {
      const { combined } = stringObject;
      return numbersFromCombined(matrixFromString(String(combined)));
  };
  const convolutionBiasObject = (stringObject) => {
      const { combined } = stringObject;
      return numberFromCombined(biasFromString(String(combined)));
  };
  const convolutionMultiplierObject = (stringObject) => {
      const { combined } = stringObject;
      return numberFromCombined(multiplierFromString(String(combined)));
  };
  const parse = (convolutionObject) => {
      const matrixObject = convolutionStringObject(convolutionObject.matrix);
      const multiplierObject = convolutionStringObject(convolutionObject.multiplier);
      const matrix = convolutionMatrixObject(matrixObject);
      const multiplier = convolutionMultiplierObject(multiplierObject);
      const bias = matrixObject.combined ? numberFromCombined(0.0) : convolutionBiasObject(convolutionStringObject(convolutionObject.bias));
      const result = { multiplier, matrix, bias };
      return result;
  };
  const optionsFromObject = (convolutionObject) => {
      const valueObject = {};
      colorRgbaKeys.map(c => c).forEach((channel, index) => {
          const multiplier = convolutionObject.multiplier[channel];
          const matrix = convolutionObject.matrix[channel];
          valueObject[`${index}m`] = matrix.join(' ');
          valueObject[`${index}rdiv`] = multiplier;
          valueObject[`${index}bias`] = convolutionObject.bias[channel];
      });
      return valueObject;
  };

  /**
   * @category Filter
   */
  class CropFilter extends FilterDefinitionClass {
      constructor(...args) {
          super(...args);
          this.properties.push(propertyInstance({
              custom: true, name: 'width', type: exports.DataType.String,
          }));
          this.properties.push(propertyInstance({
              custom: true, name: 'height', type: exports.DataType.String,
          }));
          this.properties.push(propertyInstance({
              tweenable: true, custom: true, name: 'x', type: exports.DataType.Number,
              defaultValue: 0, min: 0, step: 1
          }));
          this.properties.push(propertyInstance({
              tweenable: true, custom: true, name: 'y', type: exports.DataType.Number,
              defaultValue: 0, min: 0, step: 1
          }));
          this.populateParametersFromProperties();
      }
      commandFilters(args) {
          const { filter, filterInput, duration, videoRate } = args;
          assertPopulatedString(filterInput);
          const commandFilters = [];
          const scalars = filter.scalarObject(!!duration);
          const options = { exact: 1 };
          const position = tweenPosition(videoRate, duration);
          options.x = tweenOption(scalars.x, scalars[`x${PropertyTweenSuffix}`], position, true);
          options.y = tweenOption(scalars.y, scalars[`y${PropertyTweenSuffix}`], position, true);
          const { width, height } = scalars;
          if (isTrueValue(width))
              options.w = width;
          if (isTrueValue(height))
              options.h = height;
          const { ffmpegFilter } = this;
          const commandFilter = {
              inputs: [filterInput], ffmpegFilter,
              options,
              outputs: [idGenerate(ffmpegFilter)]
          };
          commandFilters.push(commandFilter);
          return commandFilters;
      }
  }

  /**
   * @category Filter
   */
  class OverlayFilter extends FilterDefinitionClass {
      constructor(...args) {
          super(...args);
          this.properties.push(propertyInstance({
              tweenable: true, custom: true, name: 'x', type: exports.DataType.Percent, defaultValue: 0.5
          }));
          this.properties.push(propertyInstance({
              tweenable: true, custom: true, name: 'y', type: exports.DataType.Percent, defaultValue: 0.5
          }));
          this.properties.push(propertyInstance({
              custom: true, name: 'format', type: exports.DataType.String, defaultValue: 'yuv420' // yuv420p10
          }));
          this.properties.push(propertyInstance({
              custom: true, name: 'alpha', type: exports.DataType.String, defaultValue: 'straight' // premultiplied
          }));
          this.populateParametersFromProperties();
      }
      commandFilters(args) {
          const commandFilters = [];
          const { filter, filterInput, chainInput, duration, videoRate } = args;
          assertPopulatedString(filterInput, 'filterInput');
          assertPopulatedString(chainInput, 'chainInput');
          const scalars = filter.scalarObject(!!duration);
          const options = {}; //repeatlast: 0, shortest: 1
          const { format, alpha } = scalars;
          if (isPopulatedString(format))
              options.format = format;
          if (isPopulatedString(alpha))
              options.alpha = alpha;
          const position = tweenPosition(videoRate, duration, '(n-1)'); // overlay bug
          const x = tweenOption(scalars.x, scalars[`x${PropertyTweenSuffix}`], position, true);
          const y = tweenOption(scalars.y, scalars[`y${PropertyTweenSuffix}`], position, true);
          const xZero = x === 0;
          const yZero = y === 0;
          // const zero = xZero && yZero
          if (!xZero)
              options.x = x;
          if (!yZero)
              options.y = y;
          // const { ffmpegFilter } = this
          const ffmpegFilter = 'overlay';
          const commandFilter = {
              inputs: [chainInput, filterInput], ffmpegFilter, options, outputs: []
          };
          commandFilters.push(commandFilter);
          return commandFilters;
      }
  }

  /**
   * @category Filter
   */
  class ScaleFilter extends FilterDefinitionClass {
      constructor(...args) {
          super(...args);
          this.properties.push(propertyInstance({
              name: 'width', type: exports.DataType.Percent, defaultValue: 1.0, max: 2.0
          }));
          this.properties.push(propertyInstance({
              name: 'height', type: exports.DataType.Percent, defaultValue: 1.0, max: 2.0
          }));
          this.properties.push(propertyInstance({
              name: `width${PropertyTweenSuffix}`, type: exports.DataType.Percent,
              defaultValue: 1.0, max: 2.0
          }));
          this.properties.push(propertyInstance({
              name: `height${PropertyTweenSuffix}`, type: exports.DataType.Percent,
              defaultValue: 1.0, max: 2.0
          }));
          this.populateParametersFromProperties();
      }
      commandFilters(args) {
          const commandFilters = [];
          const { filter, duration, filterInput, videoRate } = args;
          const values = filter.scalarObject(!!duration);
          const { width, height, [`width${PropertyTweenSuffix}`]: widthEnd, [`height${PropertyTweenSuffix}`]: heightEnd, } = values;
          assertPopulatedString(filterInput);
          // console.log(this.constructor.name, "commandFilters", filterInput, width, "x", height) //, widthEnd, "x", heightEnd)
          const { ffmpegFilter } = this;
          const position = tweenPosition(videoRate, duration);
          const options = {
              width: tweenOption(width, widthEnd, position, true),
              height: tweenOption(height, heightEnd, position, true),
              // sws_flags: 'accurate_rnd',
          };
          if (!(isNumber(options.width) && isNumber(options.height)))
              options.eval = 'frame';
          const commandFilter = {
              inputs: [filterInput], ffmpegFilter, options,
              outputs: [idGenerate(ffmpegFilter)]
          };
          commandFilters.push(commandFilter);
          return commandFilters;
      }
  }

  class OpacityFilter extends FilterDefinitionClass {
      constructor(...args) {
          super(...args);
          this.properties.push(propertyInstance({
              tweenable: true, custom: true, name: 'opacity',
              type: exports.DataType.Number, defaultValue: 1.0,
          }));
          this.populateParametersFromProperties();
      }
      commandFilters(args) {
          const commandFilters = [];
          const { filterInput: input, filter, duration, videoRate } = args;
          const opacity = filter.value('opacity');
          let filterInput = input;
          assertNumber(opacity);
          assertPopulatedString(filterInput, 'filterInput');
          const options = {
              lum: 'lum(X,Y)', cb: 'cb(X,Y)', cr: 'cr(X,Y)', a: `alpha(X,Y)*${opacity}`
          };
          if (duration) {
              const opacityEnd = filter.value(`opacity${PropertyTweenSuffix}`);
              if (isNumber(opacityEnd) && opacity != opacityEnd) {
                  const position = tweenPosition(videoRate, duration, 'N');
                  const toValue = opacityEnd - opacity;
                  options.a = `alpha(X,Y)*(${opacity}+(${toValue}*${position}))`;
              }
          }
          // const formatFilter = 'format'
          // const formatId = idGenerate(formatFilter)
          // const formatCommandFilter: CommandFilter = {
          //   inputs: [filterInput], ffmpegFilter: formatFilter, 
          //   options: { pix_fmts: 'rgba' }, outputs: [formatId]
          // }
          // commandFilters.push(formatCommandFilter)
          // filterInput = formatId
          const { ffmpegFilter } = this;
          const commandFilter = {
              inputs: [filterInput], ffmpegFilter,
              options, outputs: [idGenerate(ffmpegFilter)]
          };
          commandFilters.push(commandFilter);
          return commandFilters;
      }
      _ffmpegFilter = 'geq';
      filterDefinitionSvgFilter(valueObject) {
          const { opacity } = valueObject;
          assertNumber(opacity);
          const filterElement = globalThis.document.createElementNS(NamespaceSvg, 'feColorMatrix');
          filterElement.setAttribute('type', 'matrix');
          const values = `1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 ${opacity} 0`;
          // console.log(this.constructor.name, "filterDefinitionSvgFilters", values)
          svgSet(filterElement, values, 'values');
          return [filterElement];
      }
  }

  /**
   * @category Filter
   */
  class SetsarFilter extends FilterDefinitionClass {
      constructor(...args) {
          super(...args);
          this.properties.push(propertyInstance({
              custom: true, name: 'sar', type: exports.DataType.String, defaultValue: '0'
          }));
          this.properties.push(propertyInstance({
              custom: true, name: 'max', type: exports.DataType.Number, defaultValue: 100
          }));
          this.populateParametersFromProperties();
      }
  }

  /**
   * @category Filter
   */
  class FpsFilter extends FilterDefinitionClass {
      constructor(...args) {
          super(...args);
          this.properties.push(propertyInstance({
              custom: true, name: 'fps', type: exports.DataType.Number
          }));
          this.populateParametersFromProperties();
      }
  }

  /**
   * @category Filter
   */
  class SetptsFilter extends FilterDefinitionClass {
      constructor(...args) {
          super(...args);
          this.properties.push(propertyInstance({
              custom: true, name: 'expr', type: exports.DataType.String, defaultValue: 'PTS-STARTPTS'
          }));
          this.populateParametersFromProperties();
      }
  }

  /**
   * @category Filter
   */
  class AlphamergeFilter extends FilterDefinitionClass {
      commandFilters(args) {
          const commandFilters = [];
          const { chainInput, filterInput } = args;
          assertPopulatedString(chainInput, 'chainInput');
          assertPopulatedString(filterInput, 'filterInput');
          const { ffmpegFilter } = this;
          const commandFilter = {
              inputs: [chainInput, filterInput], ffmpegFilter,
              options: {}, outputs: [idGenerate(ffmpegFilter)]
          };
          commandFilters.push(commandFilter);
          return commandFilters;
      }
  }

  /**
   * @category Filter
   */
  class TrimFilter extends FilterDefinitionClass {
      constructor(...args) {
          super(...args);
          this.properties.push(propertyInstance({
              custom: true, name: 'start', type: exports.DataType.Number, defaultValue: 0
          }));
          this.populateParametersFromProperties();
      }
  }

  /**
   * @category Filter
   */
  class TextFilter extends ColorizeFilter {
      constructor(...args) {
          super(...args);
          this.properties.push(propertyInstance({
              custom: true, type: exports.DataType.String, name: 'fontfile'
          }));
          this.properties.push(propertyInstance({
              custom: true, type: exports.DataType.String, name: 'textfile'
          }));
          this.properties.push(propertyInstance({
              custom: true, type: exports.DataType.Boolean, name: 'stretch'
          }));
          this.properties.push(propertyInstance({
              tweenable: true, custom: true, type: exports.DataType.Number, name: 'height'
          }));
          this.properties.push(propertyInstance({
              tweenable: true, custom: true, type: exports.DataType.Number, name: 'width'
          }));
          this.properties.push(propertyInstance({
              custom: true, type: exports.DataType.Number, name: 'intrinsicHeight'
          }));
          this.properties.push(propertyInstance({
              custom: true, type: exports.DataType.Number, name: 'intrinsicWidth'
          }));
          this.properties.push(propertyInstance({
              tweenable: true, custom: true, type: exports.DataType.Number, name: 'x'
          }));
          this.properties.push(propertyInstance({
              tweenable: true, custom: true, type: exports.DataType.Number, name: 'y'
          }));
          this.properties.push(propertyInstance({
              tweenable: true, custom: true, type: exports.DataType.String, name: 'color'
          }));
          this.populateParametersFromProperties();
      }
      commandFilters(args) {
          const commandFilters = [];
          const { filter, duration, videoRate, filterInput: contentOutput } = args;
          const color = filter.value('color');
          const x = filter.value('x');
          const y = filter.value('y');
          const textfile = filter.value('textfile');
          const fontfile = filter.value('fontfile');
          const height = filter.value('height');
          const width = filter.value('width');
          const stretch = !!filter.value('stretch');
          const intrinsicWidth = filter.value('intrinsicWidth');
          const intrinsicHeight = filter.value('intrinsicHeight');
          assertPopulatedString(textfile);
          assertPopulatedString(fontfile);
          assertNumber(height);
          assertNumber(width);
          assertNumber(intrinsicWidth);
          assertNumber(intrinsicHeight);
          assertNumber(x);
          assertNumber(y);
          assertPopulatedString(color, 'color');
          const xEnd = filter.value(`x${PropertyTweenSuffix}`);
          const yEnd = filter.value(`y${PropertyTweenSuffix}`);
          const colorEnd = duration ? filter.value(`color${PropertyTweenSuffix}`) : undefined;
          const tweeningColor = isPopulatedString(colorEnd) && color !== colorEnd;
          const { ffmpegFilter } = this;
          const drawtextId = idGenerate(ffmpegFilter);
          const foreColor = (tweeningColor || contentOutput) ? colorWhite : color;
          let backColor = colorBlack;
          if (!contentOutput) {
              backColor = tweeningColor ? colorBlackTransparent : colorWhiteTransparent;
          }
          const size = { width, height };
          const sizeEnd = { ...size };
          if (duration) {
              const heightEnd = filter.value(`height${PropertyTweenSuffix}`) || 0;
              const widthEnd = filter.value(`width${PropertyTweenSuffix}`) || 0;
              if (isAboveZero(widthEnd))
                  sizeEnd.width = widthEnd;
              if (isAboveZero(heightEnd))
                  sizeEnd.height = heightEnd;
          }
          const ratio = intrinsicWidth / intrinsicHeight;
          const maxSize = tweenMaxSize(size, sizeEnd);
          const calculatedWidth = Math.round(ratio * maxSize.height);
          //stretch ? { width: Math.round(intrinsicWidth / 100), height: Math.round(intrinsicHeight / 100) } : maxSize
          if (calculatedWidth > maxSize.width)
              maxSize.width = calculatedWidth;
          let scaling = stretch || !sizesEqual(size, sizeEnd);
          const scaleOptions = {};
          const textOptions = {
              fontsize: maxSize.height, fontfile, textfile,
              x: Math.ceil(isNumber(xEnd) ? Math.max(x, xEnd) : x),
              y: Math.ceil(isNumber(yEnd) ? Math.max(y, yEnd) : y),
              // fix_bounds: 1,
          };
          // console.log(this.constructor.name, "commandFilters", colorSize, maxSize, size, sizeEnd)
          const position = tweenPosition(videoRate, duration);
          if (tweeningColor) {
              const alpha = color.length > 7;
              const fromColor = alpha ? colorToRgba(color) : colorToRgb(color);
              const toColor = alpha ? colorToRgba(colorEnd) : colorToRgb(colorEnd);
              const keys = alpha ? colorRgbaKeys : colorRgbKeys;
              const calcs = keys.map(key => {
                  const from = fromColor[key];
                  const to = toColor[key];
                  return from === to ? from : `${from}+(${to - from}*${position})`;
              });
              const calls = calcs.map(calc => ['eif', calc, 'x', 2].join(':'));
              const expressions = calls.map(call => `%{${call}}`);
              textOptions.fontcolor_expr = `#${expressions.join('')}`;
          }
          else
              textOptions.fontcolor = foreColor;
          const colorCommand = this.colorCommandFilter(maxSize, videoRate, duration, backColor);
          commandFilters.push(colorCommand);
          let filterInput = arrayLast(colorCommand.outputs);
          // console.log(this.constructor.name, "commandFilters", scaling, stretch)
          if (scaling) {
              scaleOptions.width = stretch ? tweenOption(width, sizeEnd.width, position, true) : -1;
              scaleOptions.height = tweenOption(height, sizeEnd.height, position, true);
              if (!(isNumber(scaleOptions.width) && isNumber(scaleOptions.height))) {
                  scaleOptions.eval = 'frame';
              }
          }
          const drawtextFilter = {
              inputs: [filterInput], ffmpegFilter,
              options: textOptions, outputs: [drawtextId]
          };
          commandFilters.push(drawtextFilter);
          filterInput = drawtextId;
          if (!contentOutput) {
              const formatFilter = 'format';
              const formatId = idGenerate(formatFilter);
              const formatCommandFilter = {
                  inputs: [filterInput], ffmpegFilter: formatFilter,
                  options: { pix_fmts: 'yuva420p' }, outputs: [formatId]
              };
              commandFilters.push(formatCommandFilter);
              filterInput = formatId;
          }
          if (scaling) {
              const scaleFilter = 'scale';
              const scaleFilterId = idGenerate(scaleFilter);
              const scaleCommandFilter = {
                  inputs: [filterInput], ffmpegFilter: scaleFilter,
                  options: scaleOptions,
                  outputs: [scaleFilterId]
              };
              commandFilters.push(scaleCommandFilter);
              filterInput = scaleFilterId;
          }
          return commandFilters;
      }
      _ffmpegFilter = 'drawtext';
  }

  const FilterIdPrefix = `${IdPrefix}filter.`;
  const filterDefaults = [
      new AlphamergeFilter({ id: `${FilterIdPrefix}alphamerge` }),
      new ChromaKeyFilter({ id: `${FilterIdPrefix}chromakey` }),
      new ColorChannelMixerFilter({ id: `${FilterIdPrefix}colorchannelmixer` }),
      new ColorFilter({ id: `${FilterIdPrefix}color` }),
      new ColorizeFilter({ id: `${FilterIdPrefix}colorize` }),
      new ConvolutionFilter({ id: `${FilterIdPrefix}convolution` }),
      new CropFilter({ id: `${FilterIdPrefix}crop` }),
      new FpsFilter({ id: `${FilterIdPrefix}fps` }),
      new OpacityFilter({ id: `${FilterIdPrefix}opacity` }),
      new OverlayFilter({ id: `${FilterIdPrefix}overlay` }),
      new ScaleFilter({ id: `${FilterIdPrefix}scale` }),
      new SetptsFilter({ id: `${FilterIdPrefix}setpts` }),
      new SetsarFilter({ id: `${FilterIdPrefix}setsar` }),
      new TrimFilter({ id: `${FilterIdPrefix}trim` }),
      new TextFilter({ id: `${FilterIdPrefix}text` }),
  ];
  const filterDefinition = (object) => {
      const { id } = object;
      assertPopulatedString(id);
      return new FilterDefinitionClass(object);
  };
  const filterDefinitionFromId = (id) => {
      const qualifiedId = id.includes('.') ? id : `${FilterIdPrefix}${id}`;
      const definition = filterDefaults.find(definition => definition.id === qualifiedId);
      if (definition)
          return definition;
      return filterDefinition({ id: qualifiedId });
  };
  const filterInstance = (object) => {
      const { id } = object;
      if (!id)
          throw Errors.invalid.definition.id;
      const definition = filterDefinitionFromId(id);
      return definition.instanceFromObject(object);
  };
  const filterFromId = (id) => {
      const definition = filterDefinitionFromId(id);
      return definition.instanceFromObject({ id });
  };
  Factories[exports.DefinitionType.Filter] = {
      definition: filterDefinition,
      definitionFromId: filterDefinitionFromId,
      fromId: filterFromId,
      instance: filterInstance,
      defaults: filterDefaults,
  };

  const DefaultContentId = `${IdPrefix}content${IdSuffix}`;
  const isContent = (value) => {
      return isTweenable(value) && isContentType(value.type);
  };
  function assertContent(value, name) {
      if (!isContent(value))
          throwError(value, 'Content', name);
  }
  const isContentDefinition = (value) => {
      return isTweenableDefinition(value) && isContentType(value.type);
  };

  const isPreloadableDefinition = (value) => {
      return isContentDefinition(value) && "loadType" in value;
  };
  function assertPreloadableDefinition(value) {
      if (!isPreloadableDefinition(value))
          throw new Error('expected PreloadableDefinition');
  }
  const isPreloadable = (value) => {
      return isContent(value) && isPreloadableDefinition(value.definition);
  };
  function assertPreloadable(value) {
      if (!isPreloadable(value))
          throw new Error('expected Preloadable');
  }

  const UpdatableSizeDefinitionType = [
      exports.DefinitionType.Image,
      exports.DefinitionType.Video,
      exports.DefinitionType.VideoSequence,
  ];
  const isUpdatableSize = (value) => {
      return isPreloadable(value);
  };
  function assertUpdatableSize(value) {
      if (!isUpdatableSize(value))
          throwError(value, 'UpdatableSize');
  }
  const isUpdatableSizeType = (value) => {
      return isDefinitionType(value) && UpdatableSizeDefinitionType.includes(value);
  };
  const isUpdatableSizeDefinition = (value) => {
      return isPreloadableDefinition(value);
  };
  function assertUpdatableSizeDefinition(value) {
      if (!isUpdatableSizeDefinition(value))
          throwError(value, 'UpdatableSizeDefinition');
  }

  function ContainerMixin(Base) {
      return class extends Base {
          constructor(...args) {
              super(...args);
              const [object] = args;
              const { container } = this;
              if (container) {
                  this.addProperties(object, propertyInstance({
                      name: 'x', type: exports.DataType.Percent, defaultValue: 0.5,
                      group: exports.DataGroup.Point, tweenable: true,
                  }));
                  this.addProperties(object, propertyInstance({
                      name: 'y', type: exports.DataType.Percent, defaultValue: 0.5,
                      group: exports.DataGroup.Point, tweenable: true,
                  }));
                  // offN, offS, offE, offW
                  Directions.forEach(direction => {
                      this.addProperties(object, propertyInstance({
                          name: `off${direction}`, type: exports.DataType.Boolean,
                          group: exports.DataGroup.Point,
                      }));
                  });
                  this.addProperties(object, propertyInstance({
                      tweenable: true, name: 'opacity',
                      type: exports.DataType.Percent, defaultValue: 1.0,
                      group: exports.DataGroup.Opacity,
                  }));
              }
          }
          _colorizeFilter;
          get colorizeFilter() { return this._colorizeFilter ||= filterFromId('colorize'); }
          colorizeCommandFilters(args) {
              const { contentColors: colors, videoRate, filterInput, time } = args;
              assertPopulatedArray(colors);
              const duration = isTimeRange(time) ? time.lengthSeconds : 0;
              const { colorizeFilter } = this;
              const filterArgs = {
                  videoRate, duration, filterInput
              };
              const [color, colorEnd] = colors;
              colorizeFilter.setValue(color, 'color');
              colorizeFilter.setValue(colorEnd, `color${PropertyTweenSuffix}`);
              return colorizeFilter.commandFilters(filterArgs);
          }
          colorMaximize = false;
          containedVideo(video, containerRect, size, time, range) {
              const x = Math.round(Number(video.getAttribute('x')));
              const y = Math.round(Number(video.getAttribute('y')));
              const containerPoint = pointCopy(containerRect);
              containerPoint.x -= x;
              containerPoint.y -= y;
              const zeroRect = { ...containerPoint, ...sizeCopy(containerRect) };
              const updatableContainer = isUpdatableSize(this);
              const items = [];
              const { div } = this;
              const styles = [];
              styles.push(`left: ${x}px`);
              styles.push(`top: ${y}px`);
              if (updatableContainer) {
                  const file = this.intrinsicGraphFile({ size: true, editing: true });
                  const { preloader } = this.clip.track.mash;
                  const src = preloader.sourceUrl(file);
                  styles.push(`mask-image: url(${src})`);
                  styles.push('mask-repeat: no-repeat');
                  styles.push('mask-mode: luminance');
                  styles.push(`mask-size: ${zeroRect.width}px ${zeroRect.height}px`);
                  styles.push(`mask-position: ${zeroRect.x}px ${zeroRect.y}px`);
              }
              else {
                  const containerItem = this.pathElement(zeroRect);
                  containerItem.setAttribute('fill', colorWhite);
                  let clipId = idGenerateString();
                  const clipElement = globalThis.document.createElementNS(NamespaceSvg, 'clipPath');
                  svgSet(clipElement, clipId);
                  svgAppend(clipElement, containerItem);
                  const svg = svgElement(size);
                  svgSetChildren(svg, [svgDefsElement([clipElement])]);
                  styles.push(`clip-path:${svgUrl(clipId)}`);
                  items.push(svg);
              }
              div.setAttribute('style', styles.join(';') + ';');
              svgSetChildren(div, [video]);
              items.push(div);
              return Promise.resolve(items);
          }
          containedContent(content, containerRect, size, time, range, icon) {
              const updatableContainer = isUpdatableSize(this);
              const updatableContent = isUpdatableSize(content);
              const contentPromise = content.contentPreviewItemPromise(containerRect, time, range, icon);
              const containedPromise = contentPromise.then(contentItem => {
                  assertObject(contentItem);
                  if (isLoadedVideo(contentItem)) {
                      assertTrue(!icon, 'not icon');
                      // console.log(this.constructor.name, "containedContent VIDEO")
                      return this.containedVideo(contentItem, containerRect, size, time, range);
                  }
                  const containerPromise = this.containerPreviewItemPromise(containerRect, time, range, icon);
                  return containerPromise.then(containerItem => {
                      const defs = [];
                      // TODO: make luminance a property of container...
                      const luminance = true;
                      defs.push(containerItem);
                      let containerId = idGenerateString();
                      if (updatableContainer && !icon) {
                          // container is image/video so we need to add a polygon for hover
                          const polygonElement = svgPolygonElement(containerRect, '', 'transparent', containerId);
                          polygonElement.setAttribute('vector-effect', 'non-scaling-stroke;');
                          defs.push(polygonElement);
                          containerId = idGenerateString();
                      }
                      containerItem.setAttribute('id', containerId);
                      const group = svgGroupElement();
                      svgAppend(group, [svgPolygonElement(containerRect, '', 'transparent'), contentItem]);
                      const items = [group];
                      svgAddClass(group, 'contained');
                      const maskElement = svgMaskElement(undefined, group, luminance);
                      defs.push(maskElement);
                      const useContainerInMask = svgUseElement(containerId);
                      maskElement.appendChild(svgPolygonElement(size, '', 'black'));
                      maskElement.appendChild(useContainerInMask);
                      if (!updatableContainer) {
                          containerItem.setAttribute('vector-effect', 'non-scaling-stroke;');
                          useContainerInMask.setAttribute('fill', colorWhite);
                      }
                      const containerSvgFilter = this.containerSvgFilter(containerItem, size, containerRect, time, range);
                      if (containerSvgFilter)
                          defs.push(containerSvgFilter);
                      else
                          containerItem.removeAttribute('filter');
                      const contentSvgFilter = content.contentSvgFilter(contentItem, size, containerRect, time, range);
                      if (contentSvgFilter)
                          defs.push(contentSvgFilter);
                      else
                          contentItem.removeAttribute('filter');
                      const useSvg = (updatableContent || updatableContainer) && !icon;
                      const svg = useSvg ? this.svgElement : svgElement();
                      svgSetChildren(svg, [svgDefsElement(defs), ...items]);
                      svgSetDimensions(svg, size);
                      return [svg];
                  });
              });
              return containedPromise;
          }
          containerColorCommandFilters(args) {
              const commandFilters = [];
              const { contentColors, containerRects, track } = args;
              const { colorMaximize } = this;
              if (!colorMaximize)
                  return super.containerColorCommandFilters(args);
              assertPopulatedArray(contentColors);
              const tweeningSize = !rectsEqual(...containerRects);
              const maxSize = tweeningSize ? tweenMaxSize(...containerRects) : containerRects[0];
              const colorArgs = {
                  ...args, outputSize: maxSize
              };
              commandFilters.push(...this.colorBackCommandFilters(colorArgs, `content-${track}`));
              return commandFilters;
          }
          containerCommandFilters(args, tweening) {
              const commandFilters = [];
              const { contentColors, filterInput: input } = args;
              let filterInput = input;
              // console.log(this.constructor.name, "containerCommandFilters", filterInput)
              assertPopulatedString(filterInput, 'filterInput');
              if (!contentColors?.length) {
                  commandFilters.push(...this.alphamergeCommandFilters({ ...args, filterInput }));
                  filterInput = arrayLast(arrayLast(commandFilters).outputs);
              }
              commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput }));
              return commandFilters;
          }
          containerFinalCommandFilters(args) {
              const commandFilters = [];
              const { filterInput: input } = args;
              let filterInput = input;
              assertPopulatedString(filterInput, 'filterInput');
              const opacityFilters = this.opacityCommandFilters(args);
              if (opacityFilters.length) {
                  commandFilters.push(...opacityFilters);
                  filterInput = arrayLast(arrayLast(opacityFilters).outputs);
              }
              commandFilters.push(...this.translateCommandFilters({ ...args, filterInput }));
              return commandFilters;
          }
          containerRects(args, inRect) {
              // console.log(this.constructor.name, "containerRects", inRect, args)
              const { size, time, timeRange } = args;
              const { lock } = this;
              const tweenRects = this.tweenRects(time, timeRange);
              const locked = tweenRectsLock(tweenRects, lock);
              const { width: inWidth, height: inHeight } = inRect;
              const ratio = ((inWidth || size.width)) / ((inHeight || size.height));
              const [scale, scaleEnd] = locked;
              const forcedScale = tweenScaleSizeRatioLock(scale, size, ratio, lock);
              // console.log(this.constructor.name, "containerRects forcedScale", forcedScale, "= tweenScaleSizeRatioLock(", scale, size, ratio, lock, ")")
              const { directionObject } = this;
              const transformedRect = tweenScaleSizeToRect(size, forcedScale, directionObject);
              const tweening = !rectsEqual(scale, scaleEnd);
              if (!tweening) {
                  // console.log(this.constructor.name, "containerRects !tweening", transformedRect, locked)
                  return [transformedRect, transformedRect];
              }
              const forcedScaleEnd = tweenScaleSizeRatioLock(scaleEnd, size, ratio, lock);
              const tweenRect = tweenOverRect(forcedScale, forcedScaleEnd);
              const tweened = tweenScaleSizeToRect(size, tweenRect, directionObject);
              const tuple = [transformedRect, tweened];
              return tuple;
          }
          containerPreviewItemPromise(containerRect, time, range, icon) {
              return Promise.resolve(this.pathElement(containerRect));
          }
          containerSvgFilter(svgItem, outputSize, containerRect, time, clipTime) {
              const [opacity] = this.tweenValues('opacity', time, clipTime);
              // console.log(this.constructor.name, "containerSvgFilters", opacity)
              if (!isBelowOne(opacity))
                  return;
              const { opacityFilter } = this;
              opacityFilter.setValue(opacity, 'opacity');
              return svgFilterElement(opacityFilter.filterSvgFilter(), svgItem);
          }
          get directions() { return Anchors; }
          get directionObject() {
              return Object.fromEntries(Directions.map(direction => [direction, !!this.value(`off${direction}`)]));
          }
          _div;
          get div() {
              return this._div ||= globalThis.document.createElement('div');
          }
          get isDefault() { return this.definitionId === DefaultContainerId; }
          opacityCommandFilters(args) {
              const { outputSize: outputSize, filterInput, clipTime, time, videoRate } = args;
              assertTimeRange(clipTime);
              const duration = isTimeRange(time) ? time.lengthSeconds : 0;
              const commandFilters = [];
              const filterCommandFilterArgs = {
                  dimensions: outputSize, filterInput, videoRate, duration
              };
              const [opacity, opacityEnd] = this.tweenValues('opacity', time, clipTime);
              // console.log(this.constructor.name, "opacityCommandFilters", opacity, opacityEnd)
              if (isBelowOne(opacity) || (isDefined(opacityEnd) && isBelowOne(opacityEnd))) {
                  const { opacityFilter } = this;
                  opacityFilter.setValues({ opacity, opacityEnd });
                  commandFilters.push(...opacityFilter.commandFilters(filterCommandFilterArgs));
              }
              return commandFilters;
          }
          _opacityFilter;
          get opacityFilter() { return this._opacityFilter ||= filterFromId('opacity'); }
          pathElement(rect, forecolor = 'none') {
              return svgPolygonElement(rect, '', forecolor);
          }
          _svgElement;
          get svgElement() {
              return this._svgElement ||= svgElement();
          }
          translateCommandFilters(args) {
              const commandFilters = [];
              const { outputSize, time, containerRects, chainInput, filterInput, videoRate } = args;
              if (!chainInput)
                  return commandFilters;
              assertPopulatedArray(containerRects);
              const [rect, rectEnd] = containerRects;
              const duration = isTimeRange(time) ? time.lengthSeconds : 0;
              const { overlayFilter } = this;
              // overlayFilter.setValue('yuv420p10', 'format')
              overlayFilter.setValue(rect.x, 'x');
              overlayFilter.setValue(rect.y, 'y');
              if (duration) {
                  overlayFilter.setValue(rectEnd.x, `x${PropertyTweenSuffix}`);
                  overlayFilter.setValue(rectEnd.y, `y${PropertyTweenSuffix}`);
              }
              const filterArgs = {
                  dimensions: outputSize, filterInput, videoRate, duration, chainInput
              };
              commandFilters.push(...overlayFilter.commandFilters(filterArgs));
              return commandFilters;
          }
      };
  }

  function ContainerDefinitionMixin(Base) {
      return class extends Base {
          constructor(...args) {
              super(...args);
              this.properties.push(propertyInstance({
                  name: 'lock', type: exports.DataType.String, defaultValue: exports.Orientation.H,
                  group: exports.DataGroup.Size,
              }));
          }
          type = exports.DefinitionType.Container;
      };
  }

  const isShapeContainer = (value) => {
      return isContainer(value) && "path" in value;
  };

  const timeGreatestCommonDenominator = (fps1, fps2) => {
      let a = fps1;
      let b = fps2;
      let t = 0;
      while (b !== 0) {
          t = b;
          b = a % b;
          a = t;
      }
      return a;
  };
  const timeLowestCommonMultiplier = (a, b) => ((a * b) / timeGreatestCommonDenominator(a, b));
  const timeEqualizeRates = (time1, time2, rounding = '') => {
      if (time1.fps === time2.fps)
          return [time1, time2];
      const gcf = timeLowestCommonMultiplier(time1.fps, time2.fps);
      return [
          time1.scale(gcf, rounding),
          time2.scale(gcf, rounding)
      ];
  };
  class TimeClass {
      constructor(frame = 0, fps = 1) {
          if (!isInteger(frame) || frame < 0) {
              // console.trace(Errors.frame, frame)
              throw Errors.frame + frame;
          }
          if (!isInteger(fps) || fps < 1)
              throw Errors.fps;
          this.frame = frame;
          this.fps = fps;
      }
      add(time) {
          const [time1, time2] = timeEqualizeRates(this, time);
          return new TimeClass(time1.frame + time2.frame, time1.fps);
      }
      addFrame(frames) {
          const time = this.copy;
          time.frame += frames;
          return time;
      }
      closest(timeRange) {
          const frame = timeRange.frame + Math.round(timeRange.frames / 2);
          const halfTime = new TimeClass(frame, timeRange.fps);
          const [midTime, editorTime] = timeEqualizeRates(halfTime, this);
          const shouldBeOnLast = midTime.frame < editorTime.frame;
          return shouldBeOnLast ? timeRange.lastTime : timeRange.startTime;
      }
      get copy() { return new TimeClass(this.frame, this.fps); }
      get description() { return `${this.frame}@${this.fps}`; }
      divide(number, rounding = '') {
          assertAboveZero(number);
          if (number === 1.0)
              return this;
          return this.withFrame(roundWithMethod(this.frame / number, rounding));
      }
      equalsTime(time) {
          const [time1, time2] = timeEqualizeRates(this, time);
          return time1.frame === time2.frame;
      }
      fps;
      frame;
      durationFrames(duration, fps = 0) {
          const rate = fps || this.fps;
          const frames = [];
          const framesMax = Math.floor(rate * duration) - 2;
          const startFrame = Math.min(framesMax, this.scale(rate, "floor").frame);
          if (this.isRange) {
              const scaledFrame = this.timeRange.endTime.scale(rate, "ceil").frame;
              const endFrame = Math.min(framesMax + 1, scaledFrame);
              for (let frame = startFrame; frame < endFrame; frame += 1) {
                  frames.push(frame);
              }
          }
          else
              frames.push(startFrame);
          return frames;
      }
      isRange = false;
      get lengthSeconds() { return 0; }
      min(time) {
          const [time1, time2] = timeEqualizeRates(this, time);
          return new TimeClass(Math.min(time1.frame, time2.frame), time1.fps);
      }
      scale(fps, rounding = '') {
          if (this.fps === fps)
              return this;
          const frame = (Number(this.frame) / Number(this.fps)) * Number(fps);
          return new TimeClass(roundWithMethod(frame, rounding), fps);
      }
      scaleToFps(fps) { return this.scaleToTime(new TimeClass(0, fps)); }
      scaleToTime(time) {
          return timeEqualizeRates(this, time)[0];
      }
      get seconds() { return Number(this.frame) / Number(this.fps); }
      get startTime() { return this; }
      subtract(time) {
          const [time1, time2] = timeEqualizeRates(this, time);
          let subtracted = time2.frame;
          if (subtracted > time1.frame) {
              subtracted -= subtracted - time1.frame;
          }
          return new TimeClass(time1.frame - subtracted, time1.fps);
      }
      subtractFrames(frames) {
          const time = this.copy;
          time.frame -= frames;
          return time;
      }
      get timeRange() { throw Errors.timeRange; }
      toString() { return `[${this.description}]`; }
      withFrame(frame) {
          const time = this.copy;
          time.frame = frame;
          return time;
      }
  }

  class TimeRangeClass extends TimeClass {
      frames;
      constructor(frame = 0, fps = 1, frames = 1) {
          super(frame, fps);
          if (!(isInteger(frames) && frames >= 0)) {
              console.trace(this.constructor.name);
              throw Errors.timeRange + ' frames';
          }
          this.frames = frames;
      }
      addFrames(frames) {
          const time = this.copy;
          time.frames += frames;
          return time;
      }
      get copy() {
          return new TimeRangeClass(this.frame, this.fps, this.frames);
      }
      get description() { return `${this.frame}-${this.frames}@${this.fps}`; }
      get end() { return this.frame + this.frames; }
      get endTime() { return new TimeClass(this.end, this.fps); }
      equalsTimeRange(timeRange) {
          const [range1, range2] = timeEqualizeRates(this, timeRange);
          return range1.frame === range2.frame && range1.frames === range2.frames;
      }
      get frameTimes() {
          const { frames, frame, fps } = this;
          return Array.from({ length: frames }, (_, i) => new TimeClass(frame, fps));
      }
      includes(frame) {
          return frame >= this.frame && frame <= this.end;
      }
      includesTime(time) {
          const [thisTime, scaledTime] = timeEqualizeRates(this, time);
          const thisRange = thisTime;
          const { frame, end } = thisRange;
          const other = scaledTime.frame;
          return other >= frame && other < end;
      }
      intersects(time) {
          if (!time.isRange)
              return this.includesTime(time);
          const [range1, range2] = timeEqualizeRates(time, this);
          if (range1.frame >= range2.end)
              return false;
          return range1.end > range2.frame;
      }
      isRange = true;
      get last() { return this.frame + this.frames - 1; }
      get lastTime() { return new TimeClass(this.last, this.fps); }
      get lengthSeconds() { return Number(this.frames) / Number(this.fps); }
      get position() { return Number(this.frame) / Number(this.frames); }
      positionTime(position, rounding = '') {
          const frame = roundWithMethod((this.frames - this.frame) * position, rounding);
          return new TimeClass(this.frame + frame, this.fps);
      }
      get startTime() { return new TimeClass(this.frame, this.fps); }
      scale(fps = 1, rounding = "") {
          if (this.fps === fps)
              return this.copy;
          const value = Number(this.frames) / (Number(this.fps) / Number(fps));
          const time = super.scale(fps, rounding);
          const frames = Math.max(1, roundWithMethod(value, rounding));
          return new TimeRangeClass(time.frame, time.fps, frames);
      }
      get timeRange() { return this; }
      get times() {
          const array = [this.startTime];
          if (this.frames > 1)
              array.push(this.endTime);
          return array;
      }
      minEndTime(endTime) {
          const [range, time] = timeEqualizeRates(this, endTime);
          range.frames = Math.min(range.frames, time.frame);
          return range;
      }
      withFrame(frame) {
          const range = this.copy;
          range.frame = frame;
          return range;
      }
      withFrames(frames) {
          const range = this.copy;
          range.frames = frames;
          return range;
      }
  }

  const timeRangeFromArgs = (frame = 0, fps = 1, frames = 1) => {
      return new TimeRangeClass(frame, fps, frames);
  };
  const timeRangeFromSeconds = (start = 0, duration = 1) => {
      return timeRangeFromArgs(start, 1, duration);
  };
  const timeRangeFromTime = (time, frames = 1) => {
      return timeRangeFromArgs(time.frame, time.fps, frames);
  };
  const timeRangeFromTimes = (startTime, endTime) => {
      if (!endTime)
          return timeRangeFromTime(startTime);
      const [time1, time2] = timeEqualizeRates(startTime, endTime);
      if (time2.frame <= time1.frame) {
          console.trace('fromTimes');
          throw Errors.argument + 'fromTimes ' + time1 + ' ' + time2;
      }
      const frames = time2.frame - time1.frame;
      return timeRangeFromArgs(time1.frame, time1.fps, frames);
  };
  const timeFromArgs = (frame = 0, fps = 1) => {
      return new TimeClass(frame, fps);
  };
  const timeFromSeconds = (seconds = 0, fps = 1, rounding = '') => {
      if (!isNumber(seconds) || seconds < 0)
          throw Errors.seconds;
      if (!isInteger(fps) || fps < 1)
          throw Errors.fps;
      const rounded = roundWithMethod(seconds * fps, rounding);
      return timeFromArgs(rounded, fps);
  };

  const DefaultEditorArgs = {
      buffer: 10,
      fps: 30,
      loop: true,
      volume: 0.75,
      precision: 3,
      autoplay: false,
  };
  const DefaultMash = {
      label: "Mash",
      quantize: 10,
      color: colorBlack,
      gain: 0.75,
      buffer: 10,
  };
  const DefaultCast = {
      label: "Cast",
      quantize: 10,
      color: colorBlack,
      gain: 0.75,
      buffer: 10,
  };
  const Default = {
      duration: 3,
      label: "Unlabeled",
      editor: DefaultEditorArgs,
      cast: DefaultCast,
      mash: DefaultMash,
      definition: {
          image: { duration: 2 },
          textcontainer: { duration: 3 },
          shape: { duration: 3 },
          visible: { duration: 3 },
          video: { fps: 0 },
          videosequence: { pattern: '%.jpg', fps: 10, increment: 1, begin: 1, padding: 0 },
          videostream: { duration: 10 },
      },
  };

  function TweenableMixin(Base) {
      return class extends Base {
          constructor(...args) {
              super(...args);
              const [object] = args;
              const { container } = object;
              if (container)
                  this.container = true;
          }
          alphamergeCommandFilters(args) {
              const commandFilters = [];
              const { videoRate, outputSize: rect, track, filterInput } = args;
              assertPopulatedString(filterInput);
              assertAboveZero(videoRate);
              assertSize(rect);
              const chainInput = `content-${track}`;
              const filterArgs = {
                  videoRate: 0, duration: 0, filterInput, chainInput
              };
              const { alphamergeFilter } = this;
              commandFilters.push(...alphamergeFilter.commandFilters(filterArgs));
              return commandFilters;
          }
          _alphamergeFilter;
          get alphamergeFilter() { return this._alphamergeFilter ||= filterFromId('alphamerge'); }
          amixCommandFilters(args) {
              const { chainInput, filterInput } = args;
              assertPopulatedString(chainInput);
              assertPopulatedString(filterInput);
              const amixFilter = 'amix';
              // const amixId = idGenerate(amixFilter)
              const commandFilters = [];
              const commandFilter = {
                  inputs: [chainInput, filterInput],
                  ffmpegFilter: amixFilter,
                  options: { normalize: 0 }, outputs: []
              };
              commandFilters.push(commandFilter);
              return commandFilters;
          }
          canColor(args) { return false; }
          canColorTween(args) { return false; }
          _clip;
          get clip() { return this._clip; }
          set clip(value) { this._clip = value; }
          get clipped() { return !!this._clip; }
          colorBackCommandFilters(args, output) {
              const { contentColors = [], videoRate, outputSize, duration } = args;
              assertSize(outputSize);
              const evenSize = sizeEven(outputSize);
              const [color = colorBlackOpaque, colorEnd = colorBlackOpaque] = contentColors;
              const outputString = output || idGenerate(colorName(color) || 'back');
              const { colorFilter } = this;
              const colorArgs = { videoRate, duration };
              colorFilter.setValue(color, 'color');
              colorFilter.setValue(colorEnd, `color${PropertyTweenSuffix}`);
              colorFilter.setValue(evenSize.width, 'width');
              colorFilter.setValue(evenSize.height, 'height');
              colorFilter.setValue(evenSize.width, `width${PropertyTweenSuffix}`);
              colorFilter.setValue(evenSize.height, `height${PropertyTweenSuffix}`);
              const commandFilters = colorFilter.commandFilters(colorArgs);
              if (sizesEqual(evenSize, outputSize)) {
                  arrayLast(commandFilters).outputs = [outputString];
              }
              else {
                  const filterInput = arrayLast(arrayLast(commandFilters).outputs);
                  assertPopulatedString(filterInput, 'crop input');
                  const cropFilter = 'crop';
                  // const cropId = idGenerate(cropFilter)
                  const cropCommandFilter = {
                      inputs: [filterInput], ffmpegFilter: cropFilter,
                      options: { w: outputSize.width, h: outputSize.height, exact: 1 },
                      outputs: [outputString]
                  };
                  commandFilters.push(cropCommandFilter);
              }
              return commandFilters;
          }
          _colorFilter;
          get colorFilter() { return this._colorFilter ||= filterFromId('color'); }
          commandFilters(args, tweening, container = false) {
              const commandFilters = [];
              const { filterInput: input = '' } = args;
              let filterInput = input;
              // console.log(this.constructor.name, "commandFilters", container)
              const initialFilters = this.initialCommandFilters(args, tweening, container);
              if (initialFilters.length) {
                  commandFilters.push(...initialFilters);
                  filterInput = arrayLast(arrayLast(initialFilters).outputs);
              }
              if (container)
                  commandFilters.push(...this.containerCommandFilters({ ...args, filterInput }, tweening));
              else
                  commandFilters.push(...this.contentCommandFilters({ ...args, filterInput }, tweening));
              return commandFilters;
          }
          container = false;
          containerColorCommandFilters(args) {
              const commandFilters = [];
              const { contentColors: colors = [], containerRects, videoRate, duration } = args;
              assertArray(containerRects, 'containerRects');
              const [rect, rectEnd] = containerRects;
              const colorArgs = { videoRate, duration };
              const { colorFilter } = this;
              const [color, colorEnd] = colors;
              colorFilter.setValue(color || colorWhite, 'color');
              colorFilter.setValue(colorEnd, `color${PropertyTweenSuffix}`);
              colorFilter.setValue(rect.width, 'width');
              colorFilter.setValue(rect.height, 'height');
              colorFilter.setValue(rectEnd.width, `width${PropertyTweenSuffix}`);
              colorFilter.setValue(rectEnd.height, `height${PropertyTweenSuffix}`);
              commandFilters.push(...colorFilter.commandFilters(colorArgs));
              return commandFilters;
          }
          containerCommandFilters(args, tweening) {
              // console.log(this.constructor.name, "containerCommandFilters returning empty")
              return [];
          }
          containerFinalCommandFilters(args) {
              return [];
          }
          contentCommandFilters(args, tweening) {
              // console.log(this.constructor.name, "contentCommandFilters returning empty")
              return [];
          }
          copyCommandFilter(input, track, prefix = 'content') {
              const contentOutput = `${prefix}-${track}`;
              const commandFilter = {
                  inputs: [input], ffmpegFilter: 'copy', options: {}, outputs: [contentOutput]
              };
              return commandFilter;
          }
          _cropFilter;
          get cropFilter() { return this._cropFilter ||= filterFromId('crop'); }
          definitionTime(time, clipTime) {
              const { fps: quantize } = clipTime;
              const scaledTime = time.scaleToFps(quantize); // may have fps higher than quantize and time.fps
              const { startTime, endTime } = clipTime;
              const frame = Math.max(Math.min(scaledTime.frame, endTime.frame), startTime.frame);
              return scaledTime.withFrame(frame - startTime.frame);
          }
          frames(quantize) {
              return timeFromArgs(Default.duration, quantize).frame;
          }
          fileCommandFiles(graphFileArgs) {
              const commandFiles = [];
              const files = this.fileUrls(graphFileArgs);
              let inputCount = 0;
              commandFiles.push(...files.map((graphFile, index) => {
                  const { input } = graphFile;
                  const inputId = (index && input) ? `${this.id}-${inputCount}` : this.id;
                  const commandFile = { ...graphFile, inputId };
                  if (input)
                      inputCount++;
                  return commandFile;
              }));
              return commandFiles;
          }
          fileUrls(args) { return []; }
          hasIntrinsicSizing = false;
          hasIntrinsicTiming = false;
          initialCommandFilters(args, tweening, container = false) {
              throw new Error(Errors.unimplemented);
          }
          intrinsicRect(editing = false) {
              throw new Error(Errors.unimplemented);
          }
          intrinsicsKnown(options) { return true; }
          intrinsicGraphFile(options) {
              const { editing, size, duration } = options;
              const clipTime = timeRangeFromArgs();
              const graphFileArgs = {
                  editing, time: clipTime.startTime, clipTime, quantize: clipTime.fps,
                  visible: size, audible: duration,
              };
              const [graphFile] = this.fileUrls(graphFileArgs);
              assertObject(graphFile);
              return graphFile;
          }
          get isDefault() { return false; }
          mutable() { return false; }
          overlayCommandFilters(bottomInput, topInput, alpha) {
              assertPopulatedString(bottomInput, 'bottomInput');
              assertPopulatedString(topInput, 'topInput');
              const commandFilters = [];
              const overlayArgs = {
                  filterInput: topInput, chainInput: bottomInput, videoRate: 0, duration: 0
              };
              const { overlayFilter } = this;
              if (alpha)
                  overlayFilter.setValue('yuv420p10', 'format');
              overlayFilter.setValue(0, 'x');
              overlayFilter.setValue(0, 'y');
              commandFilters.push(...overlayFilter.commandFilters(overlayArgs));
              const commandFilter = arrayLast(commandFilters);
              commandFilter.outputs = [idGenerate(topInput)];
              return commandFilters;
          }
          _overlayFilter;
          get overlayFilter() { return this._overlayFilter ||= filterFromId('overlay'); }
          scaleCommandFilters(args) {
              const { time, containerRects, filterInput: input, videoRate } = args;
              let filterInput = input;
              assertPopulatedString(filterInput, 'filterInput');
              assertArray(containerRects, 'containerRects');
              const [rect, rectEnd] = containerRects;
              assertRect(rect);
              assertRect(rectEnd);
              const duration = isTimeRange(time) ? time.lengthSeconds : 0;
              // console.log(this.constructor.name, "scaleCommandFilters", containerRects, duration)
              const commandFilters = [];
              const { scaleFilter } = this;
              const filterCommandFilterArgs = {
                  duration, videoRate, filterInput
              };
              scaleFilter.setValue(rect.width, 'width');
              scaleFilter.setValue(rect.height, 'height');
              scaleFilter.setValue(rectEnd.width, `width${PropertyTweenSuffix}`);
              scaleFilter.setValue(rectEnd.height, `height${PropertyTweenSuffix}`);
              commandFilters.push(...scaleFilter.commandFilters(filterCommandFilterArgs));
              return commandFilters;
          }
          _scaleFilter;
          get scaleFilter() { return this._scaleFilter ||= filterFromId('scale'); }
          selectables() { return [this, ...this.clip.selectables()]; }
          selectType = exports.SelectType.None;
          selectedItems(actions) {
              const selectedItems = [];
              const { container, clip, selectType, definition } = this;
              // add contentId or containerId from target, as if it were my property 
              const { id: undoValue } = definition;
              const { timing, sizing } = clip;
              const dataType = container ? exports.DataType.ContainerId : exports.DataType.ContentId;
              const property = clip.properties.find(property => property.type === dataType);
              assertProperty(property);
              const { name } = property;
              const undoValues = { timing, sizing, [name]: undoValue };
              const values = { ...undoValues };
              const relevantTiming = container ? exports.Timing.Container : exports.Timing.Content;
              const relevantSizing = container ? exports.Sizing.Container : exports.Sizing.Content;
              const timingBound = timing === relevantTiming;
              const sizingBound = sizing === relevantSizing;
              selectedItems.push({
                  selectType, property, value: undoValue,
                  changeHandler: (property, redoValue) => {
                      assertPopulatedString(redoValue);
                      const redoValues = { ...values, [name]: redoValue };
                      if (timingBound || sizingBound) {
                          const newDefinition = Defined.fromId(redoValue);
                          const { type } = newDefinition;
                          if (timingBound && !isTimingDefinitionType(type)) {
                              redoValues.timing = exports.Timing.Custom;
                          }
                          if (sizingBound && !isSizingDefinitionType(type)) {
                              redoValues.sizing = container ? exports.Sizing.Content : exports.Sizing.Container;
                          }
                      }
                      const actionObject = {
                          type: exports.ActionType.ChangeMultiple,
                          property, target: clip, redoValues, undoValues
                      };
                      actions.create(actionObject);
                  },
              });
              // add my actual properties
              const { properties } = this;
              const props = properties.filter(property => this.selectedProperty(property));
              props.forEach(property => {
                  selectedItems.push(...this.selectedProperties(actions, property));
              });
              return selectedItems;
          }
          selectedProperties(actions, property) {
              const properties = [];
              const { name, tweenable, type: dataType } = property;
              const { selectType } = this;
              const undoValue = this.value(name);
              const target = this;
              const type = dataType === exports.DataType.Frame ? exports.ActionType.ChangeFrame : exports.ActionType.Change;
              const selectedProperty = {
                  selectType, property, value: undoValue,
                  changeHandler: (property, redoValue) => {
                      assertPopulatedString(property);
                      actions.create({ type, property, target, redoValue, undoValue });
                  }
              };
              // console.log(this.constructor.name, "selectedProperties", name)
              properties.push(selectedProperty);
              if (tweenable) {
                  const tweenName = [name, PropertyTweenSuffix].join('');
                  const target = this;
                  const undoValue = this.value(tweenName);
                  const selectedPropertEnd = {
                      selectType, property, value: undoValue, name: tweenName,
                      changeHandler: (property, redoValue) => {
                          actions.create({ property, target, redoValue, undoValue });
                      }
                  };
                  // console.log(this.constructor.name, "selectedProperties", tweenName)
                  properties.push(selectedPropertEnd);
              }
              return properties;
          }
          selectedProperty(property) {
              const { name } = property;
              switch (name) {
                  case 'muted': return this.mutable();
                  case 'opacity': return this.container;
              }
              return true;
          }
          tween(keyPrefix, time, range) {
              const value = this.value(keyPrefix);
              const valueEnd = this.value(`${keyPrefix}${PropertyTweenSuffix}`);
              if (isUndefined(valueEnd))
                  return value;
              const { frame: rangeFrame, frames } = range;
              const { frame: timeFrame } = time;
              const frame = timeFrame - rangeFrame;
              if (isNumber(value)) {
                  assertNumber(valueEnd);
                  return tweenNumberStep(value, valueEnd, frame, frames);
              }
              assertPopulatedString(value);
              assertPopulatedString(valueEnd);
              return tweenColorStep(value, valueEnd, frame, frames);
          }
          tweenPoints(time, range) {
              const [x, xEndOrNot] = this.tweenValues('x', time, range);
              const [y, yEndOrNot] = this.tweenValues('y', time, range);
              assertNumber(x);
              assertNumber(y);
              const point = { x, y };
              const tweenPoint = { x: xEndOrNot, y: yEndOrNot };
              return [point, tweenOverPoint(point, tweenPoint)];
          }
          tweenRects(time, range) {
              const [size, sizeEnd] = this.tweenSizes(time, range);
              const [point, pointEnd] = this.tweenPoints(time, range);
              return [{ ...point, ...size }, { ...pointEnd, ...sizeEnd }];
          }
          tweenSizes(time, range) {
              const [width, widthEndOrNot] = this.tweenValues('width', time, range);
              const [height, heightEndOrNot] = this.tweenValues('height', time, range);
              assertNumber(width);
              assertNumber(height);
              const size = { width, height };
              const tweenSize = { width: widthEndOrNot, height: heightEndOrNot };
              return [size, tweenOverSize(size, tweenSize)];
          }
          tweenValues(key, time, range) {
              const values = [];
              const isRange = isTimeRange(time);
              values.push(this.tween(key, isRange ? time.startTime : time, range));
              if (isRange)
                  values.push(this.tween(key, time.endTime, range));
              return values;
          }
          visibleCommandFiles(args) {
              const graphFileArgs = {
                  ...args, audible: false, visible: true
              };
              const files = this.fileCommandFiles(graphFileArgs);
              // console.log(this.constructor.name, "visibleCommandFiles", files)
              return files;
          }
      };
  }

  const ShapeContainerWithTweenable = TweenableMixin(InstanceBase);
  const ShapeContainerWithContainer = ContainerMixin(ShapeContainerWithTweenable);
  class ShapeContainerClass extends ShapeContainerWithContainer {
      constructor(...args) {
          super(...args);
          const [object] = args;
          this.addProperties(object, propertyInstance({
              tweenable: true, name: 'width', type: exports.DataType.Percent,
              group: exports.DataGroup.Size, defaultValue: 1.0, max: 2.0
          }));
          this.addProperties(object, propertyInstance({
              tweenable: true, name: 'height', type: exports.DataType.Percent,
              group: exports.DataGroup.Size, defaultValue: 1.0, max: 2.0
          }));
      }
      canColor(args) {
          const { isDefault } = this;
          // default rect has no content to colorize, so needs color filter input
          if (isDefault)
              return false;
          // shape files can only colorize a single color at a single size
          return !this.isTweeningColor(args);
      }
      containerColorCommandFilters(args) {
          const commandFilters = [];
          // i am either default rect or a shape tweening color
          const { colorFilter, isDefault } = this;
          const { contentColors, containerRects, videoRate, duration } = args;
          assertPopulatedArray(contentColors, 'contentColors');
          const [rect, rectEnd] = containerRects;
          const [color, colorEnd] = contentColors;
          const maxSize = isDefault ? rect : tweenMaxSize(...containerRects);
          const colorArgs = { videoRate, duration };
          colorFilter.setValue(color || colorWhite, 'color');
          colorFilter.setValue(colorEnd, `color${PropertyTweenSuffix}`);
          colorFilter.setValue(maxSize.width, 'width');
          colorFilter.setValue(maxSize.height, 'height');
          const tweenSize = isDefault;
          colorFilter.setValue(tweenSize ? rectEnd.width : undefined, `width${PropertyTweenSuffix}`);
          colorFilter.setValue(tweenSize ? rectEnd.height : undefined, `height${PropertyTweenSuffix}`);
          commandFilters.push(...colorFilter.commandFilters(colorArgs));
          return commandFilters;
      }
      containerCommandFilters(args, tweening) {
          const commandFilters = [];
          const { contentColors: colors, commandFiles, filterInput: input } = args;
          let filterInput = input;
          // console.log(this.constructor.name, "containerCommandFilters", filterInput)
          const noContentFilters = isPopulatedArray(colors);
          const alpha = this.requiresAlpha(args, !!tweening.size);
          if (alpha) {
              assertPopulatedString(filterInput, 'container input');
              const { contentColors: _, ...argsWithoutColors } = args;
              const superArgs = {
                  ...argsWithoutColors, filterInput
              };
              commandFilters.push(...super.containerCommandFilters(superArgs, tweening));
          }
          else if (this.isDefault || noContentFilters) {
              const { id } = this;
              // if (!filterInput) console.log(this.constructor.name, "containerCommandFilters calling commandFilesInput", id)
              filterInput ||= commandFilesInput(commandFiles, id, true);
              assertPopulatedString(filterInput, 'final input');
              commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput }));
          }
          return commandFilters;
      }
      hasIntrinsicSizing = true;
      initialCommandFilters(args, tweening, container = false) {
          const commandFilters = [];
          const { contentColors, ...argsWithoutColors } = args;
          const { commandFiles, upload, track, filterInput: input, containerRects, videoRate } = argsWithoutColors;
          if (upload)
              return commandFilters;
          let filterInput = input;
          const alpha = this.requiresAlpha(args, !!tweening.size);
          const { isDefault } = this;
          const tweeningSize = tweening.size; // !(isDefault ? rectsEqual(...containerRects) : sizesEqual(...containerRects))
          const maxSize = tweeningSize ? tweenMaxSize(...containerRects) : containerRects[0];
          const evenSize = sizeEven(maxSize);
          const contentInput = `content-${track}`;
          const containerInput = `container-${track}`;
          if (!tweening.canColor) {
              if (isPopulatedString(filterInput) && !isDefault) {
                  if (alpha) {
                      const formatFilter = 'format';
                      const formatFilterId = idGenerate(formatFilter);
                      const formatCommandFilter = {
                          inputs: [filterInput], ffmpegFilter: formatFilter,
                          options: { pix_fmts: 'yuv420p' },
                          outputs: [formatFilterId]
                      };
                      commandFilters.push(formatCommandFilter);
                      filterInput = formatFilterId;
                  }
                  else if (!sizesEqual(evenSize, maxSize)) {
                      const colorArgs = {
                          ...args,
                          contentColors: [colorBlackOpaque, colorBlackOpaque],
                          outputSize: evenSize
                      };
                      commandFilters.push(...this.colorBackCommandFilters(colorArgs, `${contentInput}-back`));
                      const colorInput = arrayLast(arrayLast(commandFilters).outputs);
                      assertPopulatedString(filterInput, 'overlay input');
                      commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput));
                      filterInput = arrayLast(arrayLast(commandFilters).outputs);
                  }
              }
          }
          if (commandFilters.length)
              arrayLast(commandFilters).outputs = [contentInput];
          else if (isPopulatedString(filterInput) && contentInput !== filterInput) {
              commandFilters.push(this.copyCommandFilter(filterInput, track));
          }
          if (alpha) {
              const { id } = this;
              // console.log(this.constructor.name, "initialCommandFilters ALPHA calling commandFilesInput", id)
              const fileInput = commandFilesInput(commandFiles, id, true);
              assertPopulatedString(fileInput, 'scale input');
              const colorArgs = {
                  ...args,
                  contentColors: [colorBlackOpaque, colorBlackOpaque],
                  outputSize: maxSize
              };
              commandFilters.push(...this.colorBackCommandFilters(colorArgs, `${containerInput}-back`));
              const colorInput = arrayLast(arrayLast(commandFilters).outputs);
              commandFilters.push(...this.scaleCommandFilters({ ...args, filterInput: fileInput }));
              filterInput = arrayLast(arrayLast(commandFilters).outputs);
              assertPopulatedString(filterInput, 'overlay input');
              commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput));
              filterInput = arrayLast(arrayLast(commandFilters).outputs);
              const cropArgs = { duration: 0, videoRate };
              assertPopulatedString(filterInput, 'crop input');
              const { cropFilter } = this;
              cropFilter.setValue(maxSize.width, "width");
              cropFilter.setValue(maxSize.height, "height");
              cropFilter.setValue(0, "x");
              cropFilter.setValue(0, "y");
              commandFilters.push(...cropFilter.commandFilters({ ...cropArgs, filterInput }));
              filterInput = arrayLast(arrayLast(commandFilters).outputs);
              assertPopulatedString(filterInput, 'format input');
              const formatFilter = 'format';
              const formatCommandFilter = {
                  inputs: [filterInput], ffmpegFilter: formatFilter,
                  options: { pix_fmts: alpha ? 'yuv420p' : 'yuva420p' },
                  outputs: [containerInput]
              };
              commandFilters.push(formatCommandFilter);
          }
          return commandFilters;
      }
      intrinsicRect(editing = false) {
          const { pathHeight: height, pathWidth: width } = this.definition;
          // console.log(this.constructor.name, "intrinsicRect", this.definition)
          return { width, height, ...PointZero };
      }
      isTweeningColor(args) {
          const { contentColors } = args;
          if (!isPopulatedArray(contentColors))
              return false;
          let [forecolor, forecolorEnd] = contentColors;
          return forecolor !== forecolorEnd;
      }
      isTweeningSize(args) {
          const { containerRects } = args;
          if (!isPopulatedArray(containerRects)) {
              // console.log(this.constructor.name, "isTweeningSize FALSE BECAUSE containerRects NOT ARRAY", args)
              return false;
          }
          const equal = rectsEqual(...containerRects);
          return !equal;
      }
      pathElement(rect, forecolor = '') {
          const { definition } = this;
          const inRect = this.intrinsicRect(true);
          if (!sizeAboveZero(inRect)) {
              const polygonElement = svgPolygonElement(rect, '', forecolor);
              return polygonElement;
          }
          const { path } = definition;
          const pathElement = svgPathElement(path, '');
          svgSetTransformRects(pathElement, inRect, rect);
          return pathElement;
      }
      requiresAlpha(args, tweeningSize) {
          const { contentColors } = args;
          const colorContent = isPopulatedArray(contentColors);
          if (this.isDefault) {
              if (colorContent)
                  return false; // can always make colored boxes
              if (isBoolean(tweeningSize))
                  return tweeningSize;
              return this.isTweeningSize(args); // need mask to dynamically crop content
          }
          if (!colorContent)
              return true; // always need to mask content
          return this.isTweeningColor(args); //tweeningSize || 
      }
      visibleCommandFiles(args) {
          const { isDefault, id } = this;
          const alpha = this.requiresAlpha(args);
          const tweeningColor = this.isTweeningColor(args);
          if (isDefault && !alpha) {
              // console.log(this.constructor.name, "commandFiles NONE", id, isDefault, alpha, tweeningColor)
              return [];
          }
          const { definition } = this;
          const { path } = definition;
          const { contentColors: colors = [], containerRects, time, videoRate } = args;
          assertPopulatedArray(containerRects, 'containerRects');
          const duration = isTimeRange(time) ? time.lengthSeconds : 0;
          const [rect, rectEnd] = containerRects;
          const maxSize = { ...PointZero, ...tweenMaxSize(rect, rectEnd) };
          const { width: maxWidth, height: maxHeight } = maxSize;
          let [forecolor] = colors;
          if (alpha)
              forecolor = colorWhite;
          else if (tweeningColor)
              forecolor = colorBlack;
          let fill = 'none';
          if (isDefault)
              fill = colorWhite;
          else if (alpha)
              fill = colorBlack;
          const intrinsicRect = isDefault ? maxSize : this.intrinsicRect();
          const { width: inWidth, height: inHeight } = intrinsicRect;
          const dimensionsString = `width="${inWidth}" height="${inHeight}"`;
          // console.log(this.constructor.name, "visibleCommandFiles", this.definitionId, rect, rectEnd, intrinsicRect)
          const transformAttribute = svgTransform(intrinsicRect, maxSize);
          // console.log(this.constructor.name, "visibleCommandFiles", rect, rectEnd, transformAttribute)
          const tags = [];
          tags.push(`<svg viewBox="0 0 ${maxWidth} ${maxHeight}" xmlns="${NamespaceSvg}">`);
          tags.push(`<g ${dimensionsString} transform="${transformAttribute}" >`);
          tags.push(`<rect ${dimensionsString} fill="${fill}"/>`);
          if (!isDefault)
              tags.push(`<path d="${path}" fill="${forecolor}"/>`);
          tags.push("</g>");
          tags.push("</svg>");
          const svgTag = tags.join("");
          const options = {};
          if (duration) {
              options.loop = 1;
              options.framerate = videoRate;
              options.t = duration;
              // options.re = ''
          }
          const commandFile = {
              type: exports.GraphFileType.Svg, file: id, content: svgTag,
              input: true, inputId: id, definition, options
          };
          // console.log(this.constructor.name, "visibleCommandFiles", commandFile)
          return [commandFile];
      }
  }

  function TweenableDefinitionMixin(Base) {
      return class extends Base {
          constructor(...args) {
              super(...args);
              this.properties.push(propertyInstance({
                  name: "muted", type: exports.DataType.Boolean
              }));
          }
      };
  }

  const ShapeContainerDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase);
  const ShapeContainerDefinitionWithContainer = ContainerDefinitionMixin(ShapeContainerDefinitionWithTweenable);
  class ShapeContainerDefinitionClass extends ShapeContainerDefinitionWithContainer {
      constructor(...args) {
          super(...args);
          const [object] = args;
          const { path, pathHeight, pathWidth } = object;
          if (path)
              this.path = path;
          if (isAboveZero(pathWidth))
              this.pathWidth = pathWidth;
          if (isAboveZero(pathHeight))
              this.pathHeight = pathHeight;
      }
      definitionIcon(loader, size) {
          const superElement = super.definitionIcon(loader, size);
          if (superElement)
              return superElement;
          const { id, pathHeight: height, pathWidth: width, path } = this;
          if (id === DefaultContainerId) {
              return Promise.resolve(svgElement(size, svgPolygonElement(size, '', 'currentColor')));
          }
          const inSize = { width, height };
          if (!(sizeAboveZero(inSize) && isPopulatedString(path)))
              return;
          const coverSize = sizeCover(inSize, size, true);
          const outRect = { ...coverSize, ...centerPoint(size, coverSize) };
          const pathElement = svgPathElement(path);
          svgSetTransformRects(pathElement, inSize, outRect);
          return Promise.resolve(svgElement(size, pathElement));
      }
      instanceFromObject(object = {}) {
          return new ShapeContainerClass(this.instanceArgs(object));
      }
      path = "";
      pathHeight = 0;
      pathWidth = 0;
      toJSON() {
          const object = super.toJSON();
          if (this.path)
              object.path = this.path;
          if (isAboveZero(this.pathHeight))
              object.pathHeight = this.pathHeight;
          if (isAboveZero(this.pathWidth))
              object.pathWidth = this.pathWidth;
          return object;
      }
  }

  const isTextContainer = (value) => {
      return isContainer(value) && "fontId" in value;
  };
  function assertTextContainer(value) {
      if (!isTextContainer(value))
          throw new Error("expected TextContainer");
  }

  const TextContainerWithTweenable = TweenableMixin(InstanceBase);
  const TextContainerWithContainer = ContainerMixin(TextContainerWithTweenable);
  class TextContainerClass extends TextContainerWithContainer {
      constructor(...args) {
          const [object] = args;
          object.lock ||= '';
          super(...args);
          const { intrinsic } = object;
          if (isRect(intrinsic))
              this._intrinsicRect = intrinsic;
      }
      canColor(args) { return true; }
      canColorTween(args) { return true; }
      _colorFilter;
      get colorFilter() { return this._colorFilter ||= filterFromId('color'); }
      definitionIds() { return [...super.definitionIds(), this.fontId]; }
      _font;
      get font() { return this._font ||= Defined.fromId(this.fontId); }
      fileUrls(args) { return this.font.fileUrls(args); }
      hasIntrinsicSizing = true;
      initialCommandFilters(args, tweening) {
          const commandFilters = [];
          const { contentColors: colors = [], outputSize, track, filterInput: input, containerRects, videoRate, commandFiles, duration } = args;
          let filterInput = input;
          // console.log(this.constructor.name, "initialCommandFilters", filterInput, tweening)
          if (filterInput) {
              commandFilters.push(this.copyCommandFilter(filterInput, track));
          }
          const [rect, rectEnd] = containerRects;
          const { height, width } = rect;
          // console.log(this.constructor.name, "initialCommandFilters", merging, ...containerRects)
          const maxSize = tweenMaxSize(...containerRects);
          let colorInput = '';
          const merging = !!filterInput || tweening.size;
          if (merging) {
              const backColor = filterInput ? colorBlack : colorBlackTransparent;
              const colorArgs = {
                  ...args,
                  contentColors: [backColor, backColor],
                  outputSize: maxSize
              };
              commandFilters.push(...this.colorBackCommandFilters(colorArgs));
              colorInput = arrayLast(arrayLast(commandFilters).outputs);
          }
          const textFile = commandFiles.find(commandFile => (commandFile.inputId === this.id && commandFile.type === exports.GraphFileType.Txt));
          assertTrue(textFile, 'text file');
          const { resolved: textfile } = textFile;
          assertPopulatedString(textfile, 'textfile');
          const fontFile = commandFiles.find(commandFile => (commandFile.inputId === this.id && commandFile.type === exports.LoadType.Font));
          assertTrue(fontFile, 'font file');
          const { resolved: fontfile } = fontFile;
          assertPopulatedString(fontfile, 'fontfile');
          const { textFilter, lock } = this;
          const intrinsicRect = this.intrinsicRect();
          const x = intrinsicRect.x * (rect.width / intrinsicRect.width);
          const y = 0; // intrinsicRect.y * (height / intrinsicRect.height)
          const [color = colorWhite, colorEnd] = colors;
          assertPopulatedString(color);
          const xEnd = intrinsicRect.x * (rectEnd.width / intrinsicRect.width);
          const yEnd = 0; // intrinsicRect.y * (rectEnd.height / intrinsicRect.height)
          // console.log(this.constructor.name, "initialCommandFilters", lock)
          const intrinsicRatio = 1000 / intrinsicRect.height;
          const textSize = Math.round(height * intrinsicRatio);
          const textSizeEnd = Math.round(rectEnd.height * intrinsicRatio);
          const options = {
              x, y, width, height: textSize, color, textfile, fontfile,
              stretch: !isOrientation(lock),
              intrinsicHeight: intrinsicRect.height,
              intrinsicWidth: intrinsicRect.width,
              [`x${PropertyTweenSuffix}`]: xEnd,
              [`y${PropertyTweenSuffix}`]: yEnd,
              [`color${PropertyTweenSuffix}`]: colorEnd,
              [`height${PropertyTweenSuffix}`]: textSizeEnd,
              [`width${PropertyTweenSuffix}`]: rectEnd.width,
          };
          textFilter.setValues(options);
          // console.log(this.constructor.name, "initialCommandFilters", options)
          const textArgs = {
              dimensions: outputSize, videoRate, duration, filterInput
          };
          commandFilters.push(...textFilter.commandFilters(textArgs));
          if (merging) {
              filterInput = arrayLast(arrayLast(commandFilters).outputs);
              assertPopulatedString(filterInput, 'overlay filterInput');
              commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput));
              filterInput = arrayLast(arrayLast(commandFilters).outputs);
              assertPopulatedString(filterInput, 'crop filterInput');
              const cropArgs = {
                  duration: 0, videoRate, filterInput
              };
              const { cropFilter } = this;
              cropFilter.setValue(maxSize.width, "width");
              cropFilter.setValue(maxSize.height, "height");
              cropFilter.setValue(0, "x");
              cropFilter.setValue(0, "y");
              commandFilters.push(...cropFilter.commandFilters(cropArgs));
          }
          return commandFilters;
      }
      _intrinsicRect;
      intrinsicRect(_ = false) {
          return this._intrinsicRect ||= this.intrinsicRectInitialize();
      }
      intrinsicRectInitialize() {
          const { family } = this.font;
          assertPopulatedString(family);
          const clipString = this.string;
          const height = 1000;
          const dimensions = { width: 0, height, ...PointZero };
          if (!clipString)
              return dimensions;
          const rect = stringFamilySizeRect(clipString, family, height);
          // console.log(this.constructor.name, "intrinsicRectInitialize", rect)
          return rect;
      }
      intrinsicsKnown(options) {
          const { size } = options;
          if (!size)
              return true;
          return isRect(this._intrinsicRect) || !!this.font?.family;
      }
      pathElement(rect) {
          const { string, font } = this;
          const { family } = font;
          const svgItem = globalThis.document.createElementNS(NamespaceSvg, 'text');
          svgItem.setAttribute('font-family', family);
          svgItem.setAttribute('font-size', String(1000));
          svgItem.append(string);
          svgSetTransformRects(svgItem, this.intrinsicRect(true), rect);
          return svgItem;
      }
      setValue(value, name, property) {
          super.setValue(value, name, property);
          if (property)
              return;
          switch (name) {
              case 'fontId':
                  delete this._font;
                  delete this._intrinsicRect;
                  break;
              case 'string':
                  delete this._intrinsicRect;
                  break;
          }
      }
      _textFilter;
      get textFilter() { return this._textFilter ||= filterFromId('text'); }
      toJSON() {
          const json = super.toJSON();
          json.intrinsic = this.intrinsicRect(true);
          return json;
      }
      visibleCommandFiles(args) {
          const files = super.visibleCommandFiles(args);
          const { string } = this;
          const textGraphFile = {
              definition: this.font, type: exports.GraphFileType.Txt,
              file: this.id, content: string, inputId: this.id,
          };
          files.push(textGraphFile);
          return files;
      }
  }

  class FontClass extends InstanceBase {
      fileUrls(args) {
          return this.definition.fileUrls(args);
      }
  }

  class FontDefinitionClass extends DefinitionBase {
      constructor(...args) {
          super(...args);
          const [object] = args;
          const { source, url } = object;
          const sourceOrUrl = source || url || '';
          this.source = source || sourceOrUrl;
          this.url = url || sourceOrUrl;
      }
      family = "";
      fileUrls(args) {
          const { visible, editing } = args;
          if (!visible)
              return [];
          const { url, source } = this;
          const file = editing ? url : source;
          const graphFile = {
              type: exports.LoadType.Font, file, definition: this
          };
          return [graphFile];
      }
      instanceFromObject(object = {}) {
          return new FontClass(this.instanceArgs(object));
      }
      loadType = exports.LoadType.Font;
      toJSON() {
          const json = super.toJSON();
          const { url, source } = this;
          json.url = url;
          json.source = source;
          return json;
      }
      source = '';
      type = exports.DefinitionType.Font;
      url = '';
  }

  const label$r = "Butcherman";
  const id$q = "com.moviemasher.font.butcherman";
  const type$q = "font";
  const source$9 = "https://fonts.googleapis.com/css2?family=Butcherman";
  var fontButchermanJson = {
    label: label$r,
    id: id$q,
    type: type$q,
    source: source$9
  };

  const label$q = "Croissant One";
  const id$p = "com.moviemasher.font.croissant-one";
  const type$p = "font";
  const source$8 = "https://fonts.googleapis.com/css2?family=Croissant+One";
  var fontCroissantOneJson = {
    label: label$q,
    id: id$p,
    type: type$p,
    source: source$8
  };

  const label$p = "League Spartan";
  const id$o = "com.moviemasher.font.default";
  const type$o = "font";
  const source$7 = "https://fonts.googleapis.com/css2?family=League+Spartan";
  var fontDefaultJson = {
    label: label$p,
    id: id$o,
    type: type$o,
    source: source$7
  };

  const label$o = "Germania One";
  const id$n = "com.moviemasher.font.germania-one";
  const type$n = "font";
  const source$6 = "https://fonts.googleapis.com/css2?family=Germania+One";
  var fontGermaniaOneJson = {
    label: label$o,
    id: id$n,
    type: type$n,
    source: source$6
  };

  const label$n = "Kenia";
  const id$m = "com.moviemasher.font.kenia";
  const type$m = "font";
  const source$5 = "https://fonts.googleapis.com/css2?family=Kenia";
  var fontKeniaJson = {
    label: label$n,
    id: id$m,
    type: type$m,
    source: source$5
  };

  const label$m = "Luckiest Guy";
  const id$l = "com.moviemasher.font.luckiest-guy";
  const type$l = "font";
  const source$4 = "https://fonts.googleapis.com/css2?family=Luckiest+Guy";
  var fontLuckiestGuyJson = {
    label: label$m,
    id: id$l,
    type: type$l,
    source: source$4
  };

  const label$l = "Monoton";
  const id$k = "com.moviemasher.font.monoton";
  const type$k = "font";
  const source$3 = "https://fonts.googleapis.com/css2?family=Monoton";
  var fontMonotonJson = {
    label: label$l,
    id: id$k,
    type: type$k,
    source: source$3
  };

  const label$k = "Oleo Script";
  const id$j = "com.moviemasher.font.oleo-script";
  const type$j = "font";
  const source$2 = "https://fonts.googleapis.com/css2?family=Oleo+Script";
  var fontOleoScriptJson = {
    label: label$k,
    id: id$j,
    type: type$j,
    source: source$2
  };

  const label$j = "Shojumaru";
  const id$i = "com.moviemasher.font.shojumaru";
  const type$i = "font";
  const source$1 = "https://fonts.googleapis.com/css2?family=Shojumaru";
  var fontShojumaruJson = {
    label: label$j,
    id: id$i,
    type: type$i,
    source: source$1
  };

  const label$i = "Rubik+Dirt";
  const id$h = "com.moviemasher.font.rubik-dirt";
  const type$h = "font";
  const source = "https://fonts.googleapis.com/css2?family=Rubik+Dirt";
  var fontRubikDirtJson = {
    label: label$i,
    id: id$h,
    type: type$h,
    source: source
  };

  const fontDefaultId = fontDefaultJson.id;
  const fontDefinition = (object) => {
      const { id: idString } = object;
      const id = idString && isPopulatedString(idString) ? idString : fontDefaultId;
      return new FontDefinitionClass({ ...object, type: exports.DefinitionType.Font, id });
  };
  const fontDefault = fontDefinition(fontDefaultJson);
  const fontDefaults = [
      fontDefault,
      fontDefinition(fontButchermanJson),
      fontDefinition(fontCroissantOneJson),
      fontDefinition(fontKeniaJson),
      fontDefinition(fontGermaniaOneJson),
      fontDefinition(fontLuckiestGuyJson),
      fontDefinition(fontMonotonJson),
      fontDefinition(fontOleoScriptJson),
      fontDefinition(fontShojumaruJson),
      fontDefinition(fontRubikDirtJson),
  ];
  const fontDefinitionFromId = (id) => {
      const definition = fontDefaults.find(definition => definition.id === id);
      if (definition)
          return definition;
      return fontDefinition({ id });
  };
  const fontInstance = (object) => {
      const { definitionId = '' } = object;
      const definition = fontDefinitionFromId(definitionId);
      return definition.instanceFromObject(object);
  };
  const fontFromId = (definitionId) => {
      const definition = fontDefinitionFromId(definitionId);
      return definition.instanceFromObject();
  };
  Factories[exports.DefinitionType.Font] = {
      definition: fontDefinition,
      definitionFromId: fontDefinitionFromId,
      fromId: fontFromId,
      instance: fontInstance,
      defaults: fontDefaults,
  };

  const TextContainerDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase);
  const TextContainerDefinitionWithContainer = ContainerDefinitionMixin(TextContainerDefinitionWithTweenable);
  const TextContainerDefinitionIcon = 'M2.5 4v3h5v12h3V7h5V4h-13zm19 5h-9v3h3v7h3v-7h3V9z';
  class TextContainerDefinitionClass extends TextContainerDefinitionWithContainer {
      constructor(...args) {
          super(...args);
          this.properties.push(propertyInstance({
              name: 'string', custom: true, type: exports.DataType.String, defaultValue: 'Text'
          }));
          this.properties.push(propertyInstance({
              name: 'fontId', custom: true, type: exports.DataType.FontId,
              defaultValue: fontDefault.id
          }));
          this.properties.push(propertyInstance({
              name: 'height', tweenable: true, custom: true, type: exports.DataType.Percent,
              defaultValue: 0.3, max: 2.0, group: exports.DataGroup.Size
          }));
          this.properties.push(propertyInstance({
              name: 'width', tweenable: true, custom: true, type: exports.DataType.Percent,
              defaultValue: 0.8, max: 2.0, group: exports.DataGroup.Size
          }));
      }
      definitionIcon(loader, size) {
          const superElement = super.definitionIcon(loader, size);
          if (superElement)
              return superElement;
          const inSize = { width: 24, height: 24 };
          const coverSize = sizeCover(inSize, size, true);
          const outRect = { ...coverSize, ...centerPoint(size, coverSize) };
          const pathElement = svgPathElement(TextContainerDefinitionIcon);
          svgSetTransformRects(pathElement, inSize, outRect);
          return Promise.resolve(svgElement(size, pathElement));
      }
      instanceArgs(object) {
          const textObject = object || {};
          if (isUndefined(textObject.lock))
              textObject.lock = exports.Orientation.V;
          return super.instanceArgs(textObject);
      }
      instanceFromObject(object = {}) {
          return new TextContainerClass(this.instanceArgs(object));
      }
  }

  const label$h = "Rectangle";
  const type$g = "container";
  var defaultContainer = {
    label: label$h,
    type: type$g
  };

  const label$g = "Heart: Remix Icons";
  const type$f = "container";
  const id$g = "com.remixicon.container.heart";
  const pathWidth$7 = 24;
  const pathHeight$7 = 24;
  const path$7 = "M16.5 3C19.538 3 22 5.5 22 9c0 7-7.5 11-10 12.5C9.5 20 2 16 2 9c0-3.5 2.5-6 5.5-6C9.36 3 11 4 12 5c1-1 2.64-2 4.5-2z";
  var heartContainer = {
    label: label$g,
    type: type$f,
    id: id$g,
    pathWidth: pathWidth$7,
    pathHeight: pathHeight$7,
    path: path$7
  };

  const label$f = "Cloud: Ant Design";
  const id$f = "design.ant.container.cloud";
  const pathWidth$6 = 1024;
  const pathHeight$6 = 1024;
  const path$6 = "M811.4 418.7C765.6 297.9 648.9 212 512.2 212S258.8 297.8 213 418.6C127.3 441.1 64 519.1 64 612c0 110.5 89.5 200 199.9 200h496.2C870.5 812 960 722.5 960 612c0-92.7-63.1-170.7-148.6-193.3z";
  var cloudContainer = {
    label: label$f,
    id: id$f,
    pathWidth: pathWidth$6,
    pathHeight: pathHeight$6,
    path: path$6
  };

  const label$e = "Apple: Dev Icons";
  const type$e = "container";
  const id$e = "devicons.container.apple";
  const pathWidth$5 = 32;
  const pathHeight$5 = 32;
  const path$5 = "M23.023 17.093c-0.033-3.259 2.657-4.822 2.777-4.901-1.512-2.211-3.867-2.514-4.705-2.548-2.002-0.204-3.91 1.18-4.926 1.18-1.014 0-2.583-1.15-4.244-1.121-2.185 0.033-4.199 1.271-5.323 3.227-2.269 3.936-0.58 9.769 1.631 12.963 1.081 1.561 2.37 3.318 4.061 3.254 1.63-0.064 2.245-1.055 4.215-1.055s2.524 1.055 4.248 1.021c1.753-0.032 2.864-1.591 3.936-3.159 1.24-1.814 1.751-3.57 1.782-3.659-0.038-0.017-3.416-1.312-3.451-5.202zM19.783 7.53c0.897-1.089 1.504-2.602 1.34-4.108-1.294 0.053-2.861 0.86-3.79 1.948-0.832 0.965-1.561 2.502-1.365 3.981 1.444 0.112 2.916-0.734 3.816-1.821z";
  var appleContainer = {
    label: label$e,
    type: type$e,
    id: id$e,
    pathWidth: pathWidth$5,
    pathHeight: pathHeight$5,
    path: path$5
  };

  const label$d = "Starburst: Typicons";
  const type$d = "container";
  const id$d = "com.s-ings.container.starburst";
  const pathWidth$4 = 24;
  const pathHeight$4 = 24;
  const path$4 = "M19.064 10.109l1.179-2.387c.074-.149.068-.327-.015-.471-.083-.145-.234-.238-.401-.249l-2.656-.172-.172-2.656c-.011-.167-.104-.317-.249-.401-.145-.084-.322-.09-.472-.015l-2.385 1.18-1.477-2.215c-.186-.278-.646-.278-.832 0l-1.477 2.215-2.385-1.18c-.151-.075-.327-.069-.472.015-.145.083-.238.234-.249.401l-.171 2.656-2.657.171c-.167.011-.318.104-.401.249-.084.145-.089.322-.015.472l1.179 2.386-2.214 1.477c-.139.093-.223.249-.223.416s.083.323.223.416l2.215 1.477-1.18 2.386c-.074.15-.068.327.015.472.083.144.234.238.401.248l2.656.171.171 2.657c.011.167.104.317.249.401.144.083.32.088.472.015l2.386-1.179 1.477 2.214c.093.139.249.223.416.223s.323-.083.416-.223l1.477-2.214 2.386 1.179c.15.073.327.068.472-.015s.238-.234.249-.401l.171-2.656 2.656-.172c.167-.011.317-.104.401-.249.083-.145.089-.322.015-.472l-1.179-2.385 2.214-1.478c.139-.093.223-.249.223-.416s-.083-.323-.223-.416l-2.214-1.475z";
  var starburstContainer = {
    label: label$d,
    type: type$d,
    id: id$d,
    pathWidth: pathWidth$4,
    pathHeight: pathHeight$4,
    path: path$4
  };

  const label$c = "Rounded Rect";
  const type$c = "container";
  const id$c = "com.moviemasher.container.rounded-rect";
  const pathWidth$3 = 1920;
  const pathHeight$3 = 1080;
  const path$3 = "M 358.00 980.00 C 215.51 980.00 100.00 864.49 100.00 722.00 L 100.00 358.00 C 100.00 215.51 215.51 100.00 358.00 100.00 L 1562.00 100.00 C 1704.49 100.00 1820.00 215.51 1820.00 358.00 L 1820.00 722.00 C 1820.00 864.49 1704.49 980.00 1562.00 980.00 Z M 358.00 980.00";
  var roundedRectContainer = {
    label: label$c,
    type: type$c,
    id: id$c,
    pathWidth: pathWidth$3,
    pathHeight: pathHeight$3,
    path: path$3
  };

  const label$b = "Text";
  const type$b = "text";
  const id$b = "com.moviemasher.container.text";
  const fontId = "com.moviemasher.font.default";
  var textContainer = {
    label: label$b,
    type: type$b,
    id: id$b,
    fontId: fontId
  };

  const label$a = "Fire: Ant Design";
  const type$a = "container";
  const id$a = "design.ant.container.fire";
  const pathWidth$2 = 1024;
  const pathHeight$2 = 1024;
  const path$2 = "M834.1 469.2A347.49 347.49 0 0 0 751.2 354l-29.1-26.7a8.09 8.09 0 0 0-13 3.3l-13 37.3c-8.1 23.4-23 47.3-44.1 70.8-1.4 1.5-3 1.9-4.1 2-1.1.1-2.8-.1-4.3-1.5-1.4-1.2-2.1-3-2-4.8 3.7-60.2-14.3-128.1-53.7-202C555.3 171 510 123.1 453.4 89.7l-41.3-24.3c-5.4-3.2-12.3 1-12 7.3l2.2 48c1.5 32.8-2.3 61.8-11.3 85.9-11 29.5-26.8 56.9-47 81.5a295.64 295.64 0 0 1-47.5 46.1 352.6 352.6 0 0 0-100.3 121.5A347.75 347.75 0 0 0 160 610c0 47.2 9.3 92.9 27.7 136a349.4 349.4 0 0 0 75.5 110.9c32.4 32 70 57.2 111.9 74.7C418.5 949.8 464.5 959 512 959s93.5-9.2 136.9-27.3A348.6 348.6 0 0 0 760.8 857c32.4-32 57.8-69.4 75.5-110.9a344.2 344.2 0 0 0 27.7-136c0-48.8-10-96.2-29.9-140.9z";
  var fireContainer = {
    label: label$a,
    type: type$a,
    id: id$a,
    pathWidth: pathWidth$2,
    pathHeight: pathHeight$2,
    path: path$2
  };

  const label$9 = "Flag: Ant Design";
  const type$9 = "container";
  const id$9 = "design.ant.container.flag";
  const pathWidth$1 = 1024;
  const pathHeight$1 = 1024;
  const path$1 = "M880 305H624V192c0-17.7-14.3-32-32-32H184v-40c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v784c0 4.4 3.6 8 8 8h56c4.4 0 8-3.6 8-8V640h248v113c0 17.7 14.3 32 32 32h416c17.7 0 32-14.3 32-32V337c0-17.7-14.3-32-32-32z";
  var flagContainer = {
    label: label$9,
    type: type$9,
    id: id$9,
    pathWidth: pathWidth$1,
    pathHeight: pathHeight$1,
    path: path$1
  };

  const label$8 = "Oval";
  const type$8 = "container";
  const id$8 = "com.moviemasher.container.oval";
  const pathWidth = 24;
  const pathHeight = 24;
  const path = "M0,12 a12,12 0 1,0 24,0 a12,12 0 1,0 -24,0";
  var ovalContainer = {
    label: label$8,
    type: type$8,
    id: id$8,
    pathWidth: pathWidth,
    pathHeight: pathHeight,
    path: path
  };

  const containerDefaults = [
      new TextContainerDefinitionClass(textContainer),
      new ShapeContainerDefinitionClass({ id: DefaultContainerId, ...defaultContainer }),
      new ShapeContainerDefinitionClass(roundedRectContainer),
      new ShapeContainerDefinitionClass(ovalContainer),
      new ShapeContainerDefinitionClass(starburstContainer),
      new ShapeContainerDefinitionClass(heartContainer),
      new ShapeContainerDefinitionClass(cloudContainer),
      new ShapeContainerDefinitionClass(fireContainer),
      new ShapeContainerDefinitionClass(flagContainer),
      new ShapeContainerDefinitionClass(appleContainer),
  ];
  const containerDefinition = (object) => {
      const { id } = object;
      assertPopulatedString(id, 'containerDefinition id');
      // console.log("containerDefinition", id, object, containerDefaults)
      return new ShapeContainerDefinitionClass({ ...object, type: exports.DefinitionType.Container });
  };
  const containerDefinitionFromId = (id) => {
      const definition = containerDefaults.find(definition => definition.id === id);
      if (definition)
          return definition;
      return containerDefinition({ id });
  };
  const containerInstance = (object) => {
      const { definitionId } = object;
      if (!definitionId)
          throw Errors.id;
      const definition = containerDefinitionFromId(definitionId);
      const instance = definition.instanceFromObject(object);
      return instance;
  };
  const containerFromId = (id) => {
      const definition = containerDefinitionFromId(id);
      const instance = definition.instanceFromObject({ definitionId: id });
      return instance;
  };
  Factories[exports.DefinitionType.Container] = {
      definition: containerDefinition,
      definitionFromId: containerDefinitionFromId,
      fromId: containerFromId,
      instance: containerInstance,
      defaults: containerDefaults,
  };

  function ContentDefinitionMixin(Base) {
      return class extends Base {
          type = exports.DefinitionType.Content;
      };
  }

  function ModularMixin(Base) {
      return class extends Base {
          commandFilters(args) {
              const commandFilters = [];
              const { videoRate, filterInput, time } = args;
              assertPopulatedString(filterInput);
              const duration = isTimeRange(time) ? time.lengthSeconds : 0;
              const { filters } = this.definition;
              const filterArgs = {
                  videoRate, duration, filterInput
              };
              commandFilters.push(...filters.flatMap(filter => {
                  this.setFilterValues(filter);
                  const filters = filter.commandFilters(filterArgs);
                  if (filters.length) {
                      filterArgs.filterInput = arrayLast(arrayLast(filters).outputs);
                  }
                  return filters;
              }));
              return commandFilters;
          }
          setFilterValues(filter) {
              const filterNames = filter.properties.map(property => property.name);
              const propertyNames = this.properties.map(property => property.name);
              const shared = propertyNames.filter(name => filterNames.includes(name));
              shared.forEach(name => {
                  const property = this.properties.find(property => property.name === name);
                  assertProperty(property);
                  const { tweenable } = property;
                  filter.setValue(this.value(name), name);
                  if (tweenable) {
                      const tweenName = `${name}${PropertyTweenSuffix}`;
                      filter.setValue(this.value(tweenName), tweenName);
                  }
              });
          }
          svgFilters(previewSize, containerRect, time, range) {
              const svgFilters = [];
              const { filters } = this.definition;
              svgFilters.push(...filters.flatMap(filter => {
                  this.setFilterValues(filter);
                  return filter.filterSvgFilter();
              }));
              // console.log(this.constructor.name, "svgFilters", svgFilters.length)
              return svgFilters;
          }
      };
  }

  const EffectWithModular = ModularMixin(InstanceBase);
  class EffectClass extends EffectWithModular {
      _tweenable;
      get tweenable() { return this._tweenable; }
      set tweenable(value) { this._tweenable = value; }
      selectables() { return [this, ...this.tweenable.selectables()]; }
      selectType = exports.SelectType.None;
      selectedItems(actions) {
          return this.properties.map(property => {
              const undoValue = this.value(property.name);
              const target = this;
              return {
                  value: undoValue,
                  selectType: exports.SelectType.None, property,
                  changeHandler: (property, redoValue) => {
                      assertPopulatedString(property);
                      const options = { target, property, redoValue, undoValue };
                      actions.create(options);
                  }
              };
          });
      }
  }

  function ModularDefinitionMixin(Base) {
      return class extends Base {
          constructor(...args) {
              super(...args);
              const [object] = args;
              const { properties, filters, initializeFilter, finalizeFilter } = object;
              if (properties?.length)
                  this.properties.push(...properties.map(property => propertyInstance({ ...property, custom: true })));
              if (initializeFilter)
                  this.initializeFilter = filterInstance(initializeFilter);
              if (finalizeFilter)
                  this.finalizeFilter = filterInstance(finalizeFilter);
              if (filters)
                  this.filters.push(...filters.map(filter => filterInstance(filter)));
          }
          filters = [];
          finalizeFilter;
          initializeFilter;
          toJSON() {
              const object = super.toJSON();
              const custom = this.properties.filter(property => property.custom);
              if (custom.length)
                  object.properties = custom;
              if (this.filters.length)
                  object.filters = this.filters;
              return object;
          }
      };
  }

  const EffectDefinitionWithModular = ModularDefinitionMixin(DefinitionBase);
  class EffectDefinitionClass extends EffectDefinitionWithModular {
      constructor(...args) {
          super(...args);
          this.properties.push(propertyInstance({ name: "label", defaultValue: "" }));
      }
      instanceArgs(object) {
          const args = super.instanceArgs(object);
          args.label ||= this.label;
          return args;
      }
      instanceFromObject(object = {}) {
          return new EffectClass(this.instanceArgs(object));
      }
      type = exports.DefinitionType.Effect;
  }

  const label$7 = "Blur";
  const type$7 = "effect";
  const id$7 = "com.moviemasher.effect.blur";
  const filters$5 = [
    {
      id: "com.moviemasher.filter.convolution",
      parameters: [
        {
          name: "matrix",
          value: "1,1,1,1,1,1,1,1,1"
        },
        {
          name: "multiplier",
          value: "0.11"
        }
      ]
    }
  ];
  var effectBlurJson = {
    label: label$7,
    type: type$7,
    id: id$7,
    filters: filters$5
  };

  const label$6 = "Chromakey";
  const type$6 = "effect";
  const id$6 = "com.moviemasher.effect.chromakey";
  const properties$2 = [
    {
      name: "blend",
      defaultValue: 0,
      step: 0.01,
      min: 0,
      max: 1
    },
    {
      name: "similarity",
      defaultValue: 0.9,
      step: 0.01,
      min: 0,
      max: 1
    },
    {
      name: "color",
      type: "rgb",
      defaultValue: "#00FF00"
    }
  ];
  const filters$4 = [
    {
      id: "com.moviemasher.filter.chromakey",
      parameters: [
        {
          name: "color",
          value: "color",
          dataType: "string"
        },
        {
          name: "blend",
          value: "blend",
          dataType: "string"
        },
        {
          name: "similarity",
          value: "similarity",
          dataType: "string"
        }
      ]
    }
  ];
  var effectChromaKeyJson = {
    label: label$6,
    type: type$6,
    id: id$6,
    properties: properties$2,
    filters: filters$4
  };

  const label$5 = "Emboss";
  const type$5 = "effect";
  const id$5 = "com.moviemasher.effect.emboss";
  const properties$1 = [
  ];
  const filters$3 = [
    {
      id: "com.moviemasher.filter.convolution",
      parameters: [
        {
          name: "matrix",
          value: "-2,-1,0,-1,1,1,0,1,2"
        }
      ]
    }
  ];
  var effectEmbossJson = {
    label: label$5,
    type: type$5,
    id: id$5,
    properties: properties$1,
    filters: filters$3
  };

  const label$4 = "Grayscale";
  const type$4 = "effect";
  const id$4 = "com.moviemasher.effect.grayscale";
  const filters$2 = [
    {
      id: "com.moviemasher.filter.colorchannelmixer",
      parameters: [
        {
          name: "rr",
          value: 0.3
        },
        {
          name: "rg",
          value: 0.4
        },
        {
          name: "rb",
          value: 0.3
        },
        {
          name: "ra",
          value: 0
        },
        {
          name: "gr",
          value: 0.3
        },
        {
          name: "gg",
          value: 0.4
        },
        {
          name: "gb",
          value: 0.3
        },
        {
          name: "ga",
          value: 0
        },
        {
          name: "br",
          value: 0.3
        },
        {
          name: "bg",
          value: 0.4
        },
        {
          name: "bb",
          value: 0.3
        },
        {
          name: "ba",
          value: 0
        },
        {
          name: "ar",
          value: 0
        },
        {
          name: "ag",
          value: 0
        },
        {
          name: "ab",
          value: 0
        },
        {
          name: "aa",
          value: 1
        }
      ]
    }
  ];
  var effectGrayscaleJson = {
    label: label$4,
    type: type$4,
    id: id$4,
    filters: filters$2
  };

  const label$3 = "Sepia";
  const type$3 = "effect";
  const id$3 = "com.moviemasher.effect.sepia";
  const filters$1 = [
    {
      id: "com.moviemasher.filter.colorchannelmixer",
      parameters: [
        {
          name: "rr",
          value: 0.393
        },
        {
          name: "rg",
          value: 0.769
        },
        {
          name: "rb",
          value: 0.189
        },
        {
          name: "gr",
          value: 0.349
        },
        {
          name: "gg",
          value: 0.686
        },
        {
          name: "gb",
          value: 0.168
        },
        {
          name: "br",
          value: 0.272
        },
        {
          name: "bg",
          value: 0.534
        },
        {
          name: "bb",
          value: 0.131
        }
      ]
    }
  ];
  var effectSepiaJson = {
    label: label$3,
    type: type$3,
    id: id$3,
    filters: filters$1
  };

  const label$2 = "Sharpen";
  const type$2 = "effect";
  const id$2 = "com.moviemasher.effect.sharpen";
  const properties = [
  ];
  const filters = [
    {
      id: "com.moviemasher.filter.convolution",
      parameters: [
        {
          name: "matrix",
          value: "0,-1,0,-1,5,-1,0,-1,0"
        }
      ]
    }
  ];
  var effectSharpenJson = {
    label: label$2,
    type: type$2,
    id: id$2,
    properties: properties,
    filters: filters
  };

  // import effectTextJson from "../../Definitions/DefinitionObjects/effect/text.json"
  const effectDefinition = (object) => {
      const { id } = object;
      assertPopulatedString(id);
      return new EffectDefinitionClass({ ...object, type: exports.DefinitionType.Effect });
  };
  const effectDefaults = [
      effectDefinition(effectBlurJson),
      effectDefinition(effectChromaKeyJson),
      effectDefinition(effectEmbossJson),
      effectDefinition(effectGrayscaleJson),
      effectDefinition(effectSepiaJson),
      effectDefinition(effectSharpenJson),
      // effectDefinition(effectTextJson),
  ];
  const effectDefinitionFromId = (id) => {
      const definition = effectDefaults.find(definition => definition.id === id);
      if (definition)
          return definition;
      return effectDefinition({ id });
  };
  const effectInstance = (object) => {
      const { definitionId = '' } = object;
      // console.log("effectInstance", definitionId, object)
      const definition = effectDefinitionFromId(definitionId);
      return definition.instanceFromObject(object);
  };
  const effectFromId = (definitionId) => {
      const definition = effectDefinitionFromId(definitionId);
      return definition.instanceFromObject();
  };
  Factories[exports.DefinitionType.Effect] = {
      definition: effectDefinition,
      definitionFromId: effectDefinitionFromId,
      fromId: effectFromId,
      instance: effectInstance,
      defaults: effectDefaults,
  };

  const isAudio = (value) => {
      return isContent(value) && isAudioDefinition(value.definition);
  };
  const isAudioDefinition = (value) => {
      return isDefinition(value) && value.type === exports.DefinitionType.Audio;
  };

  function ContentMixin(Base) {
      return class extends Base {
          constructor(...args) {
              super(...args);
              const [object] = args;
              const { isDefaultOrAudio, container } = this;
              if (!(isDefaultOrAudio || container)) {
                  this.addProperties(object, propertyInstance({
                      name: 'x', type: exports.DataType.Percent, defaultValue: 0.5,
                      group: exports.DataGroup.Point, tweenable: true,
                  }));
                  this.addProperties(object, propertyInstance({
                      name: 'y', type: exports.DataType.Percent, defaultValue: 0.5,
                      group: exports.DataGroup.Point, tweenable: true,
                  }));
                  this.addProperties(object, propertyInstance({
                      name: 'lock', type: exports.DataType.String, defaultValue: exports.Orientation.H,
                      group: exports.DataGroup.Size,
                  }));
              }
              const { effects } = object;
              if (effects)
                  this.effects.push(...effects.map(effectObject => {
                      const instance = effectInstance(effectObject);
                      instance.tweenable = this;
                      return instance;
                  }));
          }
          audibleCommandFiles(args) {
              const graphFileArgs = {
                  ...args, audible: true, visible: false
              };
              return this.fileCommandFiles(graphFileArgs);
          }
          audibleCommandFilters(args) {
              const commandFilters = [];
              const { time, quantize, commandFiles, clipTime } = args;
              // console.log(this.constructor.name, "initialCommandFilters", time, clipTime)
              const timeDuration = time.isRange ? time.lengthSeconds : 0;
              const duration = timeDuration ? Math.min(timeDuration, clipTime.lengthSeconds) : 0;
              const { id } = this;
              // console.log(this.constructor.name, "audibleCommandFilters calling commandFilesInput", id)
              let filterInput = commandFilesInput(commandFiles, id, false);
              const trimFilter = 'atrim';
              const trimId = idGenerate(trimFilter);
              const trimOptions = {};
              const { frame } = this.definitionTime(time, clipTime);
              if (duration)
                  trimOptions.duration = duration;
              if (frame)
                  trimOptions.start = timeFromArgs(frame, quantize).seconds;
              const commandFilter = {
                  inputs: [filterInput],
                  ffmpegFilter: trimFilter,
                  options: trimOptions,
                  outputs: [trimId]
              };
              commandFilters.push(commandFilter);
              filterInput = trimId;
              const delays = (clipTime.seconds - time.seconds) * 1000;
              if (delays) {
                  const adelayFilter = 'adelay';
                  const adelayId = idGenerate(adelayFilter);
                  const adelayCommandFilter = {
                      ffmpegFilter: adelayFilter,
                      options: { delays, all: 1 },
                      inputs: [filterInput], outputs: [adelayId]
                  };
                  commandFilters.push(adelayCommandFilter);
                  filterInput = adelayId;
              }
              commandFilters.push(...this.amixCommandFilters({ ...args, filterInput }));
              return commandFilters;
          }
          contentCommandFilters(args, tweening) {
              // console.log(this.constructor.name, "contentCommandFilters returning empty")
              return this.effectsCommandFilters(args);
          }
          contentPreviewItemPromise(containerRect, time, timeRange, icon) {
              return this.itemPromise(containerRect, time, timeRange, icon);
          }
          contentRects(args) {
              const { containerRects: rects, time, timeRange, loading, editing } = args;
              const tuple = isArray(rects) ? rects : [rects, rects];
              if (loading && !this.intrinsicsKnown({ editing, size: true })) {
                  return tuple;
              }
              const intrinsicRect = this.intrinsicRect(editing);
              if (!sizeAboveZero(intrinsicRect))
                  return tuple;
              const { lock } = this;
              const tweenRects = this.tweenRects(time, timeRange);
              const locked = tweenRectsLock(tweenRects, lock);
              const coverSizes = tweenCoverSizes(intrinsicRect, rects, locked);
              const [size, sizeEnd] = coverSizes;
              const coverPoints = tweenCoverPoints(coverSizes, rects, locked);
              const [point, pointEnd] = coverPoints;
              const rect = rectFromSize(size, point);
              const rectEnd = rectFromSize(sizeEnd, pointEnd);
              // console.log(this.constructor.name, "contentRects", lock, locked, isArray(rects) ? rects[0] : rects,  "->", rect)
              return [rect, rectEnd];
          }
          contentSvgFilter(contentItem, outputSize, containerRect, time, clipTime) {
              const { effects, isDefaultOrAudio } = this;
              if (isDefaultOrAudio || !effects.length)
                  return;
              const svgFilters = this.effects.flatMap(effect => effect.svgFilters(outputSize, containerRect, time, clipTime));
              // const size = sizeCopy(this.contentRect(containerRect, time, clipTime))
              const filter = svgFilterElement(svgFilters, contentItem);
              svgSet(filter, '200%', 'width');
              svgSet(filter, '200%', 'height');
              return filter;
          }
          definitionIds() {
              return [
                  ...super.definitionIds(),
                  ...this.effects.flatMap(effect => effect.definitionIds()),
              ];
          }
          effectsCommandFilters(args) {
              const commandFilters = [];
              const { filterInput: input } = args;
              let filterInput = input;
              assertPopulatedString(filterInput);
              const { effects, isDefaultOrAudio } = this;
              if (isDefaultOrAudio)
                  return commandFilters;
              commandFilters.push(...effects.flatMap(effect => {
                  const filters = effect.commandFilters({ ...args, filterInput });
                  if (filters.length)
                      filterInput = arrayLast(arrayLast(filters).outputs);
                  return filters;
              }));
              return commandFilters;
          }
          effects = [];
          intrinsicRect(_ = false) { return RectZero; }
          get isDefault() {
              return this.definitionId === "com.moviemasher.content.default";
          }
          get isDefaultOrAudio() {
              return this.isDefault || isAudio(this);
          }
          itemPromise(containerRect, time, range, icon) {
              throw new Error(Errors.unimplemented);
          }
          selectedItems(actions) {
              const selectedItems = super.selectedItems(actions);
              if (this.isDefaultOrAudio || this.container)
                  return selectedItems;
              // add effects 
              const { effects, selectType } = this;
              const undoEffects = [...effects];
              const effectable = this;
              const selectedEffects = {
                  selectType,
                  value: this.effects,
                  removeHandler: (effect) => {
                      const options = {
                          redoSelection: { ...actions.selection, effect: undefined },
                          effects,
                          undoEffects,
                          redoEffects: effects.filter(other => other !== effect),
                          type: exports.ActionType.MoveEffect
                      };
                      actions.create(options);
                  },
                  moveHandler: (effect, index = 0) => {
                      assertPositive(index, 'index');
                      const redoEffects = undoEffects.filter(e => e !== effect);
                      const currentIndex = undoEffects.indexOf(effect);
                      const insertIndex = currentIndex < index ? index - 1 : index;
                      redoEffects.splice(insertIndex, 0, effect);
                      const options = {
                          effects, undoEffects, redoEffects, type: exports.ActionType.MoveEffect,
                          effectable
                      };
                      actions.create(options);
                  },
                  addHandler: (effect, insertIndex = 0) => {
                      assertPositive(insertIndex, 'index');
                      const redoEffects = [...effects];
                      redoEffects.splice(insertIndex, 0, effect);
                      effect.tweenable = this;
                      const options = {
                          effects,
                          undoEffects,
                          redoEffects,
                          redoSelection: { ...actions.selection, effect },
                          type: exports.ActionType.MoveEffect
                      };
                      actions.create(options);
                  },
              };
              selectedItems.push(selectedEffects);
              return selectedItems;
          }
          selectedProperty(property) {
              const { name } = property;
              switch (name) {
                  case 'effects': // return !(this.container || this.isDefaultOrAudio)
                  case 'lock': //return this.container && !isAudio(this)
                  case 'width':
                  case 'height':
                  case 'x':
                  case 'y': return !(this.isDefaultOrAudio);
              }
              return super.selectedProperty(property);
          }
          toJSON() {
              const json = super.toJSON();
              json.effects = this.effects;
              return json;
          }
      };
  }

  const isColorContent = (value) => {
      return isContent(value) && "color" in value;
  };

  const ColorContentWithTweenable = TweenableMixin(InstanceBase);
  const ColorContentWithContent = ContentMixin(ColorContentWithTweenable);
  class ColorContentClass extends ColorContentWithContent {
      constructor(...args) {
          super(...args);
          const [object] = args;
          this.addProperties(object, propertyInstance({
              tweenable: true, name: 'color', type: exports.DataType.Rgb,
              defaultValue: this.definition.color, group: exports.DataGroup.Color
          }));
      }
      _colorFilter;
      get colorFilter() { return this._colorFilter ||= filterFromId('color'); }
      contentColors(time, range) {
          const [color, colorEndOrNot] = this.tweenValues('color', time, range);
          assertPopulatedString(color);
          const colorEnd = isPopulatedString(colorEndOrNot) ? colorEndOrNot : color;
          return [color, colorEnd];
      }
      contentPreviewItemPromise(containerRect, time, range, icon) {
          const { colorFilter } = this;
          const [color] = this.tweenValues('color', time, range);
          const { x, y, width, height } = containerRect;
          colorFilter.setValues({ width, height, color });
          const svg = colorFilter.filterSvg();
          svg.setAttribute('x', String(x));
          svg.setAttribute('y', String(y));
          return Promise.resolve(svg);
      }
  }

  const ColorContentDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase);
  const ColorContentDefinitionWithContent = ContentDefinitionMixin(ColorContentDefinitionWithTweenable);
  class ColorContentDefinitionClass extends ColorContentDefinitionWithContent {
      constructor(...args) {
          super(...args);
          const [object] = args;
          const { color } = object;
          if (isPopulatedString(color))
              this.color = color;
      }
      color = colorBlack;
      instanceFromObject(object = {}) {
          return new ColorContentClass(this.instanceArgs(object));
      }
  }

  const label$1 = "Color";
  const type$1 = "content";
  const id$1 = "com.moviemasher.content.default";
  const color = "#FFFFFF";
  var defaultContent = {
    label: label$1,
    type: type$1,
    id: id$1,
    color: color
  };

  const contentDefaults = [
      new ColorContentDefinitionClass({ ...defaultContent, id: DefaultContentId })
  ];
  const contentDefinition = (object) => {
      const { id } = object;
      assertPopulatedString(id, 'contentDefinition id');
      throw 'contentDefinition';
      // return new ContentDefinitionClass({ ...object, type: DefinitionType.Content })
  };
  const contentDefinitionFromId = (id) => {
      const definition = contentDefaults.find(definition => definition.id === id);
      if (definition)
          return definition;
      return contentDefinition({ id });
  };
  const contentInstance = (object) => {
      const { definitionId } = object;
      if (!definitionId)
          throw Errors.id;
      const definition = contentDefinitionFromId(definitionId);
      const instance = definition.instanceFromObject(object);
      return instance;
  };
  const contentFromId = (id) => {
      const definition = contentDefinitionFromId(id);
      const instance = definition.instanceFromObject({ definitionId: id });
      return instance;
  };
  Factories[exports.DefinitionType.Content] = {
      definition: contentDefinition,
      definitionFromId: contentDefinitionFromId,
      fromId: contentFromId,
      instance: contentInstance,
      defaults: contentDefaults,
  };

  const AudibleSampleRate = 44100;
  const AudibleChannels = 2;
  class AudibleContext {
      addSource(id, source) {
          // console.log("addSource", id)
          this.sourcesById.set(id, source);
      }
      _context;
      get context() {
          if (!this._context) {
              const Klass = AudioContext || window.webkitAudioContext;
              if (!Klass)
                  throw Errors.audibleContext;
              this._context = new Klass();
          }
          return this._context;
      }
      createBuffer(seconds) {
          const length = AudibleSampleRate * seconds;
          return this.context.createBuffer(AudibleChannels, length, AudibleSampleRate);
      }
      createBufferSource(buffer) {
          // console.trace(this.constructor.name, "createBufferSource")
          const sourceNode = this.context.createBufferSource();
          if (buffer)
              sourceNode.buffer = buffer;
          return sourceNode;
      }
      createGain() { return this.context.createGain(); }
      get currentTime() { return this.context.currentTime; }
      decode(buffer) {
          return new Promise((resolve, reject) => (this.context.decodeAudioData(buffer, audioData => resolve(audioData), error => reject(error))));
      }
      deleteSource(id) {
          // console.log("deleteSource", id)
          const source = this.getSource(id);
          if (!source)
              return;
          this.sourcesById.delete(id);
          const { gainSource, gainNode } = source;
          gainNode.disconnect(this.destination);
          gainSource.disconnect(gainNode);
          gainSource.stop();
      }
      get destination() { return this.context.destination; }
      getSource(id) {
          return this.sourcesById.get(id);
      }
      hasSource(id) { return this.sourcesById.has(id); }
      sourcesById = new Map();
      startAt(id, source, start, duration, offset, loops = false) {
          const gainNode = this.createGain();
          source.loop = loops;
          source.connect(gainNode);
          gainNode.connect(this.destination);
          source.start(this.currentTime + start, offset, duration);
          this.addSource(id, { gainSource: source, gainNode });
      }
  }
  const AudibleContextInstance = new AudibleContext();

  const createContextAudible = () => { return new AudibleContext(); };
  const ContextFactory = {
      audible: createContextAudible,
  };

  const isMashAndDefinitionsObject = (value) => {
      return isObject(value) && "mashObject" in value && "definitionObjects" in value;
  };
  const isMash = (value) => {
      return isObject(value) && "composition" in value;
  };
  function assertMash(value, name) {
      if (!isMash(value))
          throwError(value, "Mash", name);
  }

  class EditedClass extends PropertiedClass {
      constructor(args) {
          super();
          const { createdAt, id, icon, preloader, quantize } = args;
          if (preloader)
              this._preloader = preloader;
          if (isPopulatedString(id))
              this._id = id;
          if (isPopulatedString(icon))
              this.icon = icon;
          if (isPopulatedString(createdAt))
              this.createdAt = createdAt;
          if (isAboveZero(quantize))
              this.quantize = quantize;
          this.properties.push(propertyInstance({
              name: 'label', type: exports.DataType.String, defaultValue: ''
          }));
          this.properties.push(propertyInstance({
              name: 'color', type: exports.DataType.Rgb, defaultValue: colorBlack
          }));
          this.propertiesInitialize(args);
      }
      get buffer() { throw new Error(Errors.unimplemented + 'get buffer'); }
      set buffer(value) { throw new Error(Errors.unimplemented + 'set buffer'); }
      createdAt = '';
      data = {};
      dataPopulate(rest) {
          const propertyNames = this.properties.map(property => property.name);
          Object.entries(rest).forEach(([key, value]) => {
              if (propertyNames.find(name => name === key))
                  return;
              this.data[key] = value;
          });
      }
      destroy() { }
      _editor;
      get editor() { return this._editor; }
      set editor(value) { this._editor = value; }
      _emitter;
      get emitter() { return this._emitter; }
      set emitter(value) {
          this._emitter = value;
          this.emitterChanged();
      }
      emitterChanged() { }
      editedGraphFiles(args) { return []; }
      icon = '';
      _id = '';
      get id() { return this._id ||= idTemporary(); }
      set id(value) {
          this._id = value;
          this.emitter?.emit(exports.EventType.Save);
      }
      _imageSize = { ...SizeZero };
      get imageSize() { return this._imageSize; }
      set imageSize(value) {
          assertSizeAboveZero(value, 'imageSize');
          this._imageSize = value;
      }
      loadPromise(args) { throw Errors.unimplemented; }
      get loading() { return false; }
      get mashes() { throw Errors.unimplemented; }
      _preloader;
      get preloader() {
          return this._preloader;
      }
      putPromise() { throw new Error(Errors.unimplemented); }
      quantize = Default.mash.quantize;
      reload() { return; }
      selectables() { return []; }
      selectType = exports.SelectType.None;
      selectedItems(actions) { return []; }
      previewItems(options) { throw Errors.unimplemented; }
      toJSON() {
          const json = super.toJSON();
          json.createdAt = this.createdAt;
          json.quantize = this.quantize;
          json.id = this.id;
          if (this.icon)
              json.icon = this.icon;
          Object.entries(this.data).forEach(([key, value]) => {
              if (isUndefined(json[key]))
                  json[key] = value;
          });
          return json;
      }
  }

  const isClipObject = (value) => {
      return isInstanceObject(value);
  };
  const isClip = (value) => {
      return isInstance(value) && "contentId" in value;
  };
  function assertClip(value, name) {
      if (!isClip(value))
          throwError(value, "Clip", name);
  }

  const isTrack = (value) => {
      return isObject(value) && "frameForClipNearFrame" in value;
  };
  function assertTrack(value, name) {
      if (!isTrack(value))
          throwError(value, 'Track', name);
  }

  function PreloadableDefinitionMixin(Base) {
      return class extends Base {
          constructor(...args) {
              super(...args);
              const [object] = args;
              const { source, url, bytes, mimeType } = object;
              const sourceOrUrl = source || url || '';
              this.source = source || sourceOrUrl;
              this.url = url || sourceOrUrl;
              if (bytes)
                  this.bytes = bytes;
              if (mimeType)
                  this.mimeType = mimeType;
          }
          bytes = 0;
          loadType;
          mimeType = '';
          source;
          toJSON() {
              const json = super.toJSON();
              if (this.url)
                  json.url = this.url;
              if (this.source)
                  json.source = this.source;
              if (this.bytes)
                  json.bytes = this.bytes;
              if (this.mimeType)
                  json.mimeType = this.mimeType;
              return json;
          }
          url;
      };
  }

  function PreloadableMixin(Base) {
      return class extends Base {
      };
  }

  function UpdatableSizeMixin(Base) {
      return class extends Base {
          constructor(...args) {
              super(...args);
              const [object] = args;
              const { container } = object;
              const min = container ? 0.0 : 1.0;
              this.addProperties(object, propertyInstance({
                  tweenable: true, name: 'width', type: exports.DataType.Percent,
                  group: exports.DataGroup.Size, defaultValue: 1.0, max: 2.0, min
              }));
              this.addProperties(object, propertyInstance({
                  tweenable: true, name: 'height', type: exports.DataType.Percent,
                  group: exports.DataGroup.Size, defaultValue: 1.0, max: 2.0, min
              }));
          }
          colorMaximize = true;
          containerCommandFilters(args, tweening) {
              // console.log(this.constructor.name, "containerCommandFilters")
              const commandFilters = [];
              const { commandFiles, containerRects, filterInput: input, videoRate, track } = args;
              let filterInput = input;
              const maxSize = tweening.size ? tweenMaxSize(...containerRects) : containerRects[0];
              // add color box first
              const colorArgs = {
                  ...args,
                  contentColors: [colorBlackOpaque, colorBlackOpaque],
                  outputSize: maxSize, //{ width: maxSize.width * 2, height: maxSize.height * 2 }
              };
              commandFilters.push(...this.colorBackCommandFilters(colorArgs, `container-${track}-back`));
              const colorInput = arrayLast(arrayLast(commandFilters).outputs);
              const { id } = this;
              // console.log(this.constructor.name, "containerCommandFilters calling commandFilesInput", id)
              const fileInput = commandFilesInput(commandFiles, id, true);
              // then add file input, scaled
              commandFilters.push(...this.scaleCommandFilters({ ...args, filterInput: fileInput }));
              filterInput = arrayLast(arrayLast(commandFilters).outputs);
              if (tweening.size) {
                  // overlay scaled file input onto color box
                  assertPopulatedString(filterInput, 'overlay input');
                  commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput));
                  filterInput = arrayLast(arrayLast(commandFilters).outputs);
              }
              // crop file input
              const cropArgs = { duration: 0, videoRate };
              assertPopulatedString(filterInput, 'crop input');
              const { cropFilter } = this;
              cropFilter.setValue(maxSize.width, "width");
              cropFilter.setValue(maxSize.height, "height");
              cropFilter.setValue(0, "x");
              cropFilter.setValue(0, "y");
              commandFilters.push(...cropFilter.commandFilters({ ...cropArgs, filterInput }));
              filterInput = arrayLast(arrayLast(commandFilters).outputs);
              if (!tweening.size) {
                  // overlay scaled and cropped file input onto color box
                  assertPopulatedString(filterInput, 'overlay input');
                  commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput));
                  filterInput = arrayLast(arrayLast(commandFilters).outputs);
              }
              assertPopulatedString(filterInput, 'alphamerge input');
              commandFilters.push(...this.alphamergeCommandFilters({ ...args, filterInput }));
              filterInput = arrayLast(arrayLast(commandFilters).outputs);
              // then we need to do effects, opacity, etc, and merge
              commandFilters.push(...this.containerFinalCommandFilters({ ...args, filterInput }));
              return commandFilters;
          }
          containerPreviewItemPromise(containerRect, time, range, icon) {
              return this.itemPromise(containerRect, time, range, icon);
          }
          contentCommandFilters(args, tweening) {
              const commandFilters = [];
              const { containerRects, visible, time, videoRate, clipTime, commandFiles, filterInput: input, track, upload } = args;
              if (!visible)
                  return commandFilters;
              assertTimeRange(clipTime);
              assertPopulatedArray(containerRects, 'containerRects');
              const { id } = this;
              let filterInput = input || commandFilesInput(commandFiles, id, visible);
              const contentArgs = {
                  containerRects: containerRects, time, timeRange: clipTime
              };
              const contentRects = this.contentRects(contentArgs);
              const tweeningContainer = !rectsEqual(...containerRects);
              const [contentRect, contentRectEnd] = contentRects;
              const duration = isTimeRange(time) ? time.lengthSeconds : 0;
              const maxContainerSize = tweeningContainer ? tweenMaxSize(...containerRects) : containerRects[0];
              const colorInput = `content-${track}-back`;
              if (!upload) {
                  const colorArgs = {
                      ...args, contentColors: [colorTransparent, colorTransparent],
                      outputSize: maxContainerSize
                  };
                  commandFilters.push(...this.colorBackCommandFilters(colorArgs, colorInput));
              }
              const scaleArgs = {
                  ...args, filterInput, containerRects: contentRects
              };
              commandFilters.push(...this.scaleCommandFilters(scaleArgs));
              if (upload)
                  return commandFilters;
              filterInput = arrayLast(arrayLast(commandFilters).outputs);
              if (tweening.size) {
                  commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput));
                  filterInput = arrayLast(arrayLast(commandFilters).outputs);
              }
              const cropArgs = {
                  duration, videoRate
              };
              const { cropFilter } = this;
              cropFilter.setValue(maxContainerSize.width, "width");
              cropFilter.setValue(maxContainerSize.height, "height");
              cropFilter.setValue(contentRect.x, "x");
              cropFilter.setValue(contentRect.y, "y");
              cropFilter.setValue(contentRectEnd.x, `x${PropertyTweenSuffix}`);
              cropFilter.setValue(contentRectEnd.y, `y${PropertyTweenSuffix}`);
              commandFilters.push(...cropFilter.commandFilters({ ...cropArgs, filterInput }));
              filterInput = arrayLast(arrayLast(commandFilters).outputs);
              const { setsarFilter } = this;
              setsarFilter.setValue("1/1", "sar");
              commandFilters.push(...setsarFilter.commandFilters({ ...cropArgs, filterInput }));
              filterInput = arrayLast(arrayLast(commandFilters).outputs);
              if (!tweening.size) {
                  commandFilters.push(...this.overlayCommandFilters(colorInput, filterInput, this.definition.alpha));
                  filterInput = arrayLast(arrayLast(commandFilters).outputs);
              }
              commandFilters.push(...super.contentCommandFilters({ ...args, filterInput }, tweening));
              return commandFilters;
          }
          _setsarFilter;
          get setsarFilter() { return this._setsarFilter ||= filterFromId('setsar'); }
          hasIntrinsicSizing = true;
          iconUrl(size, time, clipTime) {
              return this.definition.url;
          }
          initialCommandFilters(args, tweening, container = false) {
              const commandFilters = [];
              const { filterInput, track } = args;
              if (container) {
                  // relabel input as content
                  assertPopulatedString(filterInput);
                  commandFilters.push(this.copyCommandFilter(filterInput, track));
              }
              return commandFilters;
          }
          intrinsicRect(editing = false) {
              const key = editing ? 'previewSize' : 'sourceSize';
              const { [key]: size } = this.definition;
              assertSizeAboveZero(size, key);
              const rect = { ...PointZero, ...size };
              // console.log(this.constructor.name, "intrinsicRect", editing, rect)
              return rect;
          }
          intrinsicsKnown(options) {
              const { editing, size } = options;
              if (!size)
                  return true;
              const key = editing ? 'previewSize' : 'sourceSize';
              const { [key]: definitionSize } = this.definition;
              return sizeAboveZero(definitionSize);
          }
          itemIconPromise(rect, time, range, cache) {
              const { clip } = this;
              const { preloader } = clip.track.mash;
              const url = this.iconUrl(sizeCopy(rect), time, range);
              const imageUrl = urlPrependProtocol('image', url);
              // const lock = stretch ? '' : Orientation.V
              const svgUrl = urlPrependProtocol('svg', imageUrl, { ...rect });
              const definition = cache ? this.definition : undefined;
              return preloader.loadPromise(svgUrl, definition);
          }
          // protected previewItem?: SvgItem
          itemPreviewPromise(rect, time, range) {
              return this.itemIconPromise(rect, time, range);
          }
          itemPromise(containerRect, time, range, icon) {
              const { container } = this;
              const rect = container ? containerRect : this.itemContentRect(containerRect, time, range);
              if (icon)
                  return this.itemIconPromise(rect, time, range);
              return this.itemPreviewPromise(rect, time, range).then(svgItem => {
                  svgSetDimensions(svgItem, rect);
                  return svgItem;
              });
          }
          itemContentRect(containerRect, time, timeRange) {
              const contentArgs = {
                  containerRects: containerRect, time, timeRange, editing: true
              };
              const [contentRect] = this.contentRects(contentArgs);
              const { x, y } = contentRect;
              const point = { x: containerRect.x - x, y: containerRect.y - y };
              const rect = rectFromSize(contentRect, point);
              return rect;
          }
      };
  }

  function UpdatableSizeDefinitionMixin(Base) {
      return class extends Base {
          constructor(...args) {
              super(...args);
              const [object] = args;
              const { sourceSize, previewSize } = object;
              if (sizeAboveZero(previewSize))
                  this.previewSize = previewSize;
              if (sizeAboveZero(sourceSize))
                  this.sourceSize = sourceSize;
          }
          alpha;
          previewSize;
          sourceSize;
          toJSON() {
              const json = super.toJSON();
              const { sourceSize, previewSize } = this;
              if (sourceSize)
                  json.sourceSize = this.sourceSize;
              if (previewSize)
                  json.previewSize = this.previewSize;
              return json;
          }
      };
  }

  const UpdatableDurationDefinitionTypes = [
      exports.DefinitionType.Audio,
      exports.DefinitionType.Video,
      exports.DefinitionType.VideoSequence,
  ];
  const isUpdatableDuration = (value) => {
      return isPreloadable(value) && "startOptions" in value;
  };
  function assertUpdatableDuration(value, name) {
      if (!isUpdatableDuration(value))
          throwError(value, "Updatable", name);
  }
  const isUpdatableDurationType = (value) => {
      return isDefinitionType(value) && UpdatableDurationDefinitionTypes.includes(value);
  };
  const isUpdatableDurationDefinition = (value) => {
      return isPreloadableDefinition(value) && "audibleSource" in value;
  };
  function assertUpdatableDurationDefinition(value, name) {
      if (!isUpdatableDurationDefinition(value))
          throwError(value, "UpdatableDefinition", name);
  }

  const AudibleGainDelimiter = ',';
  function UpdatableDurationMixin(Base) {
      return class extends Base {
          constructor(...args) {
              super(...args);
              const [object] = args;
              const { gain } = object;
              if (isDefined(gain)) {
                  if (isString(gain)) {
                      if (gain.includes(AudibleGainDelimiter)) {
                          const floats = gain.split(AudibleGainDelimiter).map(string => parseFloat(string));
                          const z = floats.length / 2;
                          for (let i = 0; i < z; i += 1) {
                              this.gainPairs.push([floats[i * 2], floats[i * 2 + 1]]);
                          }
                          this.gain = -1;
                      }
                      else
                          this.gain = Number(gain);
                  }
                  else if (isPositive(gain))
                      this.gain = gain;
              }
          }
          definitionTime(masherTime, clipRange) {
              const superTime = super.definitionTime(masherTime, clipRange);
              const { startTrim, endTrim, definition } = this;
              const { duration } = definition;
              const durationTime = timeFromSeconds(duration, clipRange.fps);
              const durationFrames = durationTime.frame - (startTrim + endTrim);
              const offset = superTime.frame % durationFrames;
              return superTime.withFrame(offset + startTrim).divide(this.speed);
          }
          frames(quantize) {
              const { definition, startTrim, endTrim } = this;
              const frames = definition.frames(quantize);
              return frames - (startTrim + endTrim);
          }
          gain = 1.0;
          gainPairs = [];
          fileUrls(args) {
              const { editing, audible, time } = args;
              if (!audible || (editing && !time.isRange)) {
                  return [];
              }
              if (!(this.mutable() && !this.muted))
                  return [];
              const { definition } = this;
              const file = definition.urlAudible(editing);
              const graphFile = {
                  type: exports.LoadType.Audio, file, definition, input: true
              };
              return [graphFile];
          }
          hasGain() {
              if (this.gain === 0)
                  return true;
              if (isPositive(this.gain))
                  return false;
              if (this.gainPairs.length !== 2)
                  return false;
              const [first, second] = this.gainPairs;
              if (first.length !== 2)
                  return false;
              if (second.length !== 2)
                  return false;
              if (Math.max(...first))
                  return false;
              const [time, value] = second;
              return time === 1 && value === 0;
          }
          hasIntrinsicTiming = true;
          initialCommandFilters(args, tweening, container = false) {
              const commandFilters = [];
              const { time, quantize, commandFiles, clipTime, videoRate, duration } = args;
              const { id } = this;
              // console.log(this.constructor.name, "initialCommandFilters calling commandFilesInput", id)
              let filterInput = commandFilesInput(commandFiles, id, true);
              assertPopulatedString(filterInput, 'filterInput');
              const trimFilter = 'trim';
              const trimId = idGenerate(trimFilter);
              const trimOptions = {};
              if (duration)
                  trimOptions.duration = duration;
              const { frame } = this.definitionTime(time, clipTime);
              if (frame)
                  trimOptions.start = timeFromArgs(frame, quantize).seconds;
              const commandFilter = {
                  inputs: [filterInput],
                  ffmpegFilter: trimFilter,
                  options: trimOptions,
                  outputs: [trimId]
              };
              commandFilters.push(commandFilter);
              filterInput = trimId;
              if (duration) {
                  const fpsFilter = 'fps';
                  const fpsId = idGenerate(fpsFilter);
                  const fpsCommandFilter = {
                      ffmpegFilter: fpsFilter,
                      options: { fps: videoRate },
                      inputs: [filterInput], outputs: [fpsId]
                  };
                  commandFilters.push(fpsCommandFilter);
                  filterInput = fpsId;
              }
              const setptsFilter = 'setpts';
              const setptsId = idGenerate(setptsFilter);
              const setptsCommandFilter = {
                  ffmpegFilter: setptsFilter,
                  options: { expr: 'PTS-STARTPTS' },
                  inputs: [filterInput], outputs: [setptsId]
              };
              commandFilters.push(setptsCommandFilter);
              return commandFilters;
          }
          intrinsicsKnown(options) {
              const superKnown = super.intrinsicsKnown(options);
              if (!superKnown)
                  return false;
              const { duration } = options;
              if (!duration)
                  return true;
              return isAboveZero(this.definition.duration);
          }
          mutable() { return this.definition.audio; }
          selectedProperty(property) {
              const { name } = property;
              switch (name) {
                  case 'gain': return this.mutable() && !this.muted;
              }
              return super.selectedProperty(property);
          }
          setValue(value, name, property) {
              super.setValue(value, name, property);
              if (property)
                  return;
              switch (name) {
                  case 'startTrim':
                  case 'endTrim':
                  case 'speed':
                      // console.log(this.constructor.name, "setValue", name, value)
                      this.clip.resetTiming(this);
                      break;
              }
          }
          startOptions(seconds, timeRange) {
              let offset = timeRange.withFrame(this.startTrim).seconds;
              let start = timeRange.seconds - seconds;
              let duration = timeRange.lengthSeconds;
              if (start < 0) {
                  offset -= start;
                  duration += start;
                  start = 0;
              }
              return { start, offset, duration };
          }
          toJSON() {
              const json = super.toJSON();
              const { speed, gain } = this;
              if (speed !== 1.0)
                  json.speed = speed;
              if (gain !== 1.0)
                  json.gain = gain;
              return json;
          }
          _trimFilter;
          get trimFilter() { return this._trimFilter ||= filterFromId('trim'); }
      };
  }

  function UpdatableDurationDefinitionMixin(Base) {
      return class extends Base {
          constructor(...args) {
              super(...args);
              const [object] = args;
              const { audioUrl, audio, loop, duration, waveform, loadedAudio } = object;
              if (audio || audioUrl || loadedAudio) {
                  this.audio = true;
                  if (isPopulatedString(audioUrl))
                      this.audioUrl = audioUrl;
                  if (waveform)
                      this.waveform = waveform;
                  if (loadedAudio)
                      this.loadedAudio = loadedAudio;
              }
              // console.log(this.constructor.name, "audio", audio, this.audio, this.audioUrl)
              if (isAboveZero(duration))
                  this.duration = duration;
              // console.log(this.constructor.name, "duration", duration, this.duration)
              if (loop) {
                  this.loop = loop;
                  this.properties.push(propertyInstance({ name: 'loops', defaultValue: 1 }));
              }
              // group: DataGroup.Timing, 
              this.properties.push(propertyInstance({
                  name: "gain", defaultValue: 1.0, type: exports.DataType.Percent,
                  min: 0, max: 2.0, step: 0.01
              }));
              this.properties.push(propertyInstance({
                  name: "speed", defaultValue: 1.0, type: exports.DataType.Percent,
                  min: 0.1, max: 2.0, step: 0.1,
                  group: exports.DataGroup.Timing,
              }));
              this.properties.push(propertyInstance({
                  name: "startTrim", defaultValue: 0, type: exports.DataType.Frame,
                  step: 1, min: 0,
                  group: exports.DataGroup.Timing,
              }));
              this.properties.push(propertyInstance({
                  name: "endTrim", defaultValue: 0, type: exports.DataType.Frame,
                  step: 1, min: 0,
                  group: exports.DataGroup.Timing,
              }));
          }
          audibleSource(preloader) {
              const { loadedAudio } = this;
              if (loadedAudio) {
                  // console.log(this.constructor.name, "audibleSource loadedAudio")
                  return AudibleContextInstance.createBufferSource(loadedAudio);
              }
              const { audioUrl } = this;
              if (!isPopulatedString(audioUrl)) {
                  // console.log(this.constructor.name, "audibleSource no audioUrl")
                  this.audio = false;
                  return;
              }
              const protocolUrl = urlPrependProtocol('audio', audioUrl);
              // console.log(this.constructor.name, "audibleSource", protocolUrl)
              const cache = preloader.getCache(protocolUrl);
              if (!cache) {
                  // console.log(this.constructor.name, "audibleSource not cached", protocolUrl)
                  return;
              }
              const { error, result } = cache;
              if (error || !isLoadedAudio(result)) {
                  // console.log(this.constructor.name, "audibleSource error", error, protocolUrl, result)
                  this.audio = false;
                  this.audioUrl = '';
                  return;
              }
              this.loadedAudio = result;
              // console.log(this.constructor.name, "audibleSource cached", protocolUrl)
              return AudibleContextInstance.createBufferSource(result);
          }
          audio = false;
          audioUrl = '';
          duration = 0;
          frames(quantize) {
              const { duration } = this;
              // console.log(this.constructor.name, "frames duration =", duration)
              if (!duration)
                  return exports.Duration.Unknown;
              return timeFromSeconds(this.duration, quantize, 'floor').frame;
          }
          loadedAudio;
          loop = false;
          toJSON() {
              const json = super.toJSON();
              const { duration, audio, loop, waveform, audioUrl, url } = this;
              if (duration)
                  json.duration = duration;
              if (audio)
                  json.audio = audio;
              if (loop)
                  json.loop = loop;
              if (waveform)
                  json.waveform = waveform;
              if (url)
                  json.url = url;
              else if (audioUrl)
                  json.audioUrl = audioUrl;
              return json;
          }
          urlAudible(editing = false) {
              // console.log(this.constructor.name, "urlAudible", editing, this.audioUrl)
              if (editing) {
                  return urlPrependProtocol('audio', this.audioUrl || this.url);
              }
              return this.source;
          }
          waveform;
      };
  }

  class AudioPreview {
      constructor(object) {
          const { buffer, gain, preloader } = object;
          if (isPositive(gain))
              this.gain = gain;
          if (isAboveZero(buffer))
              this.buffer = buffer;
          this.preloader = preloader;
      }
      adjustClipGain(clip, quantize) {
          const timeRange = clip.timeRange(quantize);
          const avs = this.clipSources(clip);
          avs.forEach(av => { this.adjustSourceGain(av, timeRange); });
      }
      adjustSourceGain(av, timeRange) {
          const source = AudibleContextInstance.getSource(av.id);
          if (!source) {
              // console.log(this.constructor.name, "adjustSourceGain no source", clip.id)
              return;
          }
          const { gainNode } = source;
          if (this.gain === 0.0) {
              gainNode.gain.value = 0.0;
              return;
          }
          const gain = av.gain;
          if (isPositive(gain)) {
              gainNode.gain.value = this.gain * gain;
              return;
          }
          // position/gain pairs...
          const options = isTimeRange(timeRange) ? av.startOptions(this.seconds, timeRange) : timeRange;
          const { start, duration } = options;
          gainNode.gain.cancelScheduledValues(0);
          av.gainPairs.forEach(pair => {
              const [position, value] = pair;
              gainNode.gain.linearRampToValueAtTime(this.gain * value, start + position * duration);
          });
      }
      buffer = Default.mash.buffer;
      bufferClips(clips, quantize) {
          // console.log(this.constructor.name, "compositeAudible", clips.length)
          if (!this.createSources(clips, quantize))
              return false;
          this.destroySources(clips);
          return true;
      }
      bufferSource;
      clear() { }
      clipSources(clip) {
          const avs = [];
          const { container, content } = clip;
          if (isUpdatableDuration(container) && !container.muted)
              avs.push(container);
          if (isUpdatableDuration(content) && !content.muted)
              avs.push(content);
          return avs;
      }
      createSources(clips, quantize, time) {
          // console.log(this.constructor.name, "createSources", clips.length, "clip(s)", quantize, time, this.playing)
          if (!this.playing && !time)
              return false;
          const addingClips = clips.filter(clip => !this.playingClips.includes(clip));
          // console.log(this.constructor.name, "createSources", addingClips.length, "addingClip(s)")
          if (!addingClips.length)
              return true;
          let okay = true;
          addingClips.forEach(clip => {
              const avs = this.clipSources(clip);
              const timeRange = clip.timeRange(quantize);
              const filtered = avs.filter(av => !AudibleContextInstance.hasSource(av.id));
              okay &&= filtered.every(av => {
                  const startSeconds = this.playing ? this.seconds : time?.seconds || 0;
                  const options = av.startOptions(startSeconds, timeRange);
                  const { start, duration, offset } = options;
                  if (isPositive(start) && isAboveZero(duration)) {
                      const { definition, id } = av;
                      assertUpdatableDurationDefinition(definition);
                      const audibleSource = definition.audibleSource(this.preloader);
                      if (!audibleSource) {
                          if (!start) {
                              // console.log(this.constructor.name, "createSources no audible source", definition.label)
                              // wanted to start immediately but it's not loaded
                              return false;
                          }
                          return true;
                      }
                      const { loop } = definition;
                      // console.log(this.constructor.name, "createSources", options, loop)
                      AudibleContextInstance.startAt(id, audibleSource, start, duration, offset, loop);
                      this.adjustSourceGain(av, options);
                  }
                  else
                      console.error(this.constructor.name, "createSources", options);
                  return true;
              });
          });
          this.playingClips.push(...addingClips);
          return okay;
      }
      destroySources(clipsToKeep = []) {
          const sourceClips = [...this.playingClips];
          const clipsToRemove = sourceClips.filter(clip => !clipsToKeep.includes(clip));
          clipsToRemove.forEach(clip => {
              const avs = this.clipSources(clip);
              avs.forEach(av => AudibleContextInstance.deleteSource(av.id));
          });
          this.playingClips = clipsToKeep;
          // console.log(this.constructor.name, "destroySources removed", clipsToRemove.length, "kept", this.playingClips.length)
      }
      gain = Default.mash.gain;
      setGain(value, quantize) {
          if (this.gain === value)
              return;
          this.gain = value;
          if (this.playing) {
              this.playingClips.forEach(clip => this.adjustClipGain(clip, quantize));
          }
      }
      playing = false;
      playingClips = [];
      preloader;
      get seconds() {
          const ellapsed = AudibleContextInstance.currentTime - this.contextSecondsWhenStarted;
          const started = ellapsed + this.startedMashAt;
          // console.log("seconds", started, "=", this.startedMashAt, "+", ellapsed, '=', audibleContext.currentTime, '-', this.contextSecondsWhenStarted)
          return started;
      }
      startContext() {
          // console.log(this.constructor.name, "startContext")
          if (this.bufferSource)
              throw Errors.internal + 'bufferSource startContext';
          if (this.playing)
              throw Errors.internal + 'playing';
          const buffer = AudibleContextInstance.createBuffer(this.buffer);
          this.bufferSource = AudibleContextInstance.createBufferSource(buffer);
          this.bufferSource.loop = true;
          this.bufferSource.connect(AudibleContextInstance.destination);
          this.bufferSource.start(0);
      }
      // called when playhead starts moving
      startPlaying(time, clips, quantize) {
          if (!this.bufferSource)
              throw Errors.internal + 'bufferSource startPlaying';
          if (this.playing)
              throw Errors.internal + 'playing';
          const { seconds } = time;
          this.playing = true;
          this.startedMashAt = seconds;
          this.contextSecondsWhenStarted = AudibleContextInstance.currentTime;
          // console.log(this.constructor.name, "startPlaying", "startedMashAt", this.startedMashAt, "contextSecondsWhenStarted", this.contextSecondsWhenStarted)
          if (!this.createSources(clips, quantize, time)) {
              // console.log(this.constructor.name, "startPlaying stalled")
              this.stopPlaying();
              return false;
          }
          // console.log(this.constructor.name, "startPlaying", this.startedMashAt, this.contextSecondsWhenStarted)
          return true;
      }
      // position of masher (in seconds) when startPlaying called
      startedMashAt = 0;
      // currentTime of context (in seconds) was created when startPlaying called
      contextSecondsWhenStarted = 0;
      stopContext() {
          if (!this.bufferSource)
              return;
          this.bufferSource.stop();
          this.bufferSource.disconnect(AudibleContextInstance.destination);
          delete this.bufferSource;
      }
      stopPlaying() {
          // console.log(this.constructor.name, "stopPlaying")
          if (!this.playing)
              return;
          this.playing = false;
          this.destroySources();
          this.startedMashAt = 0;
          this.contextSecondsWhenStarted = 0;
      }
  }

  const FilterGraphInputVisible = 'BACKCOLOR';
  const FilterGraphInputAudible = 'SILENCE';
  class FilterGraphClass {
      constructor(args) {
          const { upload, mash, background, size, time, streaming, videoRate, visible } = args;
          assertMash(mash);
          this.mash = mash;
          this.time = time;
          this.videoRate = videoRate;
          this.background = background;
          this.upload = upload;
          // console.log(this.constructor.name, "upload", args.upload)
          this.size = size;
          // console.log(this.constructor.name, this.id, "size", size)
          // console.log(this.constructor.name, this.id, "visible", visible)
          if (visible)
              this.visible = true;
          if (streaming)
              this.streaming = true;
          assertTrue(isAboveZero(this.videoRate), 'videoRate');
          assertTrue(this.time.fps === this.quantize, 'time is in mash rate');
      }
      _id;
      get id() { return this._id ||= idGenerate('filtergraph'); }
      get avType() { return this.visible ? exports.AVType.Video : exports.AVType.Audio; }
      background;
      get commandFilterVisible() {
          const { duration, videoRate: rate, background, size } = this;
          // console.log(this.constructor.name, this.id, "commandFilterVisible size", size)
          const color = background || colorTransparent;
          const colorCommandFilter = {
              ffmpegFilter: 'color',
              options: { color, rate, size: `${size.width}x${size.height}` },
              inputs: [], outputs: [FilterGraphInputVisible]
          };
          if (duration)
              colorCommandFilter.options.duration = duration;
          return colorCommandFilter;
      }
      get commandFilterAudible() {
          const { duration } = this;
          const silenceCommandFilter = {
              ffmpegFilter: 'aevalsrc',
              options: { exprs: 0, duration },
              inputs: [], outputs: [FilterGraphInputAudible]
          };
          if (duration)
              silenceCommandFilter.options.duration = duration;
          return silenceCommandFilter;
      }
      _clips;
      get clips() { return this._clips ||= this.clipsInitialize; }
      get clipsInitialize() {
          const { time, mash, avType } = this;
          return mash.clipsInTimeOfType(time, avType).sort(sortByTrack);
      }
      get commandInputs() {
          return this.inputCommandFiles.map(commandFile => {
              const { options } = commandFile;
              const input = { source: this.preloader.key(commandFile), options };
              return input;
          });
      }
      _commandFiles;
      get filterGraphCommandFiles() {
          return this._commandFiles ||= this.commandFilesInitialize;
      }
      get commandFilesInitialize() {
          // console.log(this.constructor.name, "commandFilesInitialize")
          const { time, videoRate, quantize, size: outputSize, clips, visible, preloader } = this;
          // console.log(this.constructor.name, this.id, "commandFilesInitialize", visible, outputSize)
          const commandFiles = clips.flatMap(clip => {
              const clipTime = clip.timeRange(quantize);
              const chainArgs = {
                  time, quantize, visible, outputSize: outputSize, videoRate, clipTime
              };
              return clip.clipCommandFiles(chainArgs);
          });
          commandFiles.forEach(commandFile => {
              const { definition } = commandFile;
              assertDefinition(definition);
              const resolved = preloader.key(commandFile);
              // console.log(this.constructor.name, "commandFilesInitialize", label, resolved)
              commandFile.resolved = resolved;
          });
          return commandFiles;
      }
      get commandFilters() {
          const filters = [];
          const { time, quantize, size: outputSize, clips, visible, videoRate, filterGraphCommandFiles: commandFiles, upload } = this;
          // console.log(this.constructor.name, "commandFilters upload", upload)
          // console.log(this.constructor.name, this.id, "commandFilters", visible, outputSize)
          const chainArgs = {
              videoRate, time, quantize, visible, outputSize, commandFiles,
              chainInput: '', clipTime: timeRangeFromTime(time), track: 0, upload
          };
          if (visible) {
              if (!upload) {
                  filters.push(this.commandFilterVisible);
                  chainArgs.chainInput = FilterGraphInputVisible;
              }
          }
          else {
              filters.push(this.commandFilterAudible);
              chainArgs.chainInput = FilterGraphInputAudible;
          }
          const { length } = clips;
          clips.forEach((clip, index) => {
              chainArgs.clipTime = clip.timeRange(quantize);
              chainArgs.track = index;
              // console.log(this.constructor.name, "commandFilters", chainArgs)
              filters.push(...clip.commandFilters(chainArgs));
              const lastFilter = arrayLast(filters);
              if (index < length - 1) {
                  if (!lastFilter.outputs.length)
                      lastFilter.outputs.push(idGenerate('clip'));
              }
              chainArgs.chainInput = arrayLast(lastFilter.outputs);
          });
          return filters;
      }
      get duration() { return this.time.lengthSeconds; }
      get inputCommandFiles() { return this.filterGraphCommandFiles.filter(file => file.input); }
      mash;
      get preloader() { return this.mash.preloader; }
      get quantize() { return this.mash.quantize; }
      size;
      streaming = false;
      time;
      upload;
      visible = false;
      videoRate;
  }

  class FilterGraphsClass {
      args;
      constructor(args) {
          this.args = args;
          const { avType, times, mash, ...rest } = args;
          // console.log(this.constructor.name, "upload", args.upload)
          const { length } = times;
          if (!length) { // no clips in timeline
              this.time = timeFromArgs();
              return;
          }
          const [time] = times;
          const startFrames = [];
          const endFrames = [];
          const rates = [];
          times.forEach(time => {
              rates.push(time.fps);
              startFrames.push(time.frame);
              if (time.isRange)
                  endFrames.push(time.timeRange.end);
          });
          if (endFrames.length) {
              const rate = Math.max(...rates);
              if (rate !== Math.min(...rates))
                  throw Errors.internal + 'timeranges fps';
              const startFrame = Math.min(...startFrames);
              const endFrame = Math.max(...endFrames);
              this.time = timeRangeFromArgs(startFrame, rate, endFrame);
          }
          else {
              assertTrue(length === 1, 'just one time');
              this.time = time;
          }
          if (avType !== exports.AVType.Video) {
              assertTrue(length === 1 || avType !== exports.AVType.Audio, 'single time for avtype audio');
              const filterGraphArgs = {
                  ...rest, time: this.time, mash, visible: false,
              };
              this.filterGraphAudible = new FilterGraphClass(filterGraphArgs);
          }
          if (avType !== exports.AVType.Audio) {
              this.filterGraphsVisible.push(...times.map(time => {
                  const filterGraphArgs = {
                      ...rest, time, mash, visible: true
                  };
                  const filterGraph = new FilterGraphClass(filterGraphArgs);
                  return filterGraph;
              }));
          }
      }
      assureDuration() { }
      assureSize() { }
      get duration() { return this.time.lengthSeconds; }
      filterGraphsVisible = [];
      filterGraphAudible;
      get filterGraphVisible() { return this.filterGraphsVisible[0]; }
      _graphFiles;
      get fileUrls() {
          const graphs = [...this.filterGraphsVisible];
          if (this.filterGraphAudible)
              graphs.push(this.filterGraphAudible);
          return this._graphFiles ||= graphs.flatMap(graph => graph.filterGraphCommandFiles);
      }
      get graphFilesInput() {
          return this.fileUrls.filter(graphFile => graphFile.input);
      }
      get loadPromise() {
          return this.args.mash.preloader.loadFilesPromise(this.fileUrls);
      }
      time;
  }

  const TrackPreviewHandleSize = 8;
  const TrackPreviewLineSize = 2;
  class TrackPreviewClass {
      args;
      constructor(args) {
          this.args = args;
      }
      get clip() { return this.args.clip; }
      get container() { return this.clip.container; }
      get editor() { return this.preview.editor; }
      get icon() { return !!this.args.icon; }
      get id() { return this.clip.id; }
      pointerDown() {
          const clickPoint = { ...PointZero };
          const { editor, container, timeRange, rect, clip } = this;
          const { rect: contentRect } = editor;
          const removeWindowHandlers = () => {
              // console.log("removeWindowHandlers")
              globalThis.window.removeEventListener('pointermove', pointerMoveStart);
              globalThis.window.removeEventListener('pointermove', pointerMove);
              globalThis.window.removeEventListener('pointerup', pointerUp);
              globalThis.window.removeEventListener('pointerup', pointerDown);
          };
          const pointerUp = (event) => {
              eventStop(event);
              removeWindowHandlers();
              // if (editor.dragging) {
              // console.log("pointerUp unsetting dragging and redrawing")
              editor.dragging = false;
              editor.redraw();
              // }
          };
          const pointerMove = (event) => {
              // console.log("pointerMove")
              eventStop(event);
              const { offE, offN, offS, offW } = container;
              const { x, y, width, height } = rect;
              let totalWidth = contentRect.width - width;
              let totalHeight = contentRect.height - height;
              let initialX = 0;
              let initialY = 0;
              if (offE) {
                  initialX -= width;
                  totalWidth += width;
              }
              if (offW)
                  totalWidth += width;
              if (offN) {
                  initialY -= height;
                  totalHeight += height;
              }
              if (offS)
                  totalHeight += height;
              const { clientX, clientY } = event;
              const localX = clientX - contentRect.x;
              const localY = clientY - contentRect.y;
              const clickX = clickPoint.x - contentRect.x;
              const clickY = clickPoint.y - contentRect.y;
              const xPos = localX - (clickX - x);
              const yPos = localY - (clickY - y);
              const limitedX = tweenMinMax(xPos, initialX, initialX + totalWidth);
              const limitedY = tweenMinMax(yPos, initialY, initialY + totalHeight);
              const pointsTweening = tweeningPoints(container);
              const { lastTime } = timeRange;
              const timesEqual = editor.time.equalsTime(lastTime);
              const tweening = pointsTweening && timesEqual;
              const xKey = tweening ? `x${PropertyTweenSuffix}` : 'x';
              const yKey = tweening ? `y${PropertyTweenSuffix}` : 'y';
              const undoValues = {
                  [xKey]: container.value(xKey), [yKey]: container.value(yKey)
              };
              const redoValues = {
                  [xKey]: totalWidth ? limitedX / totalWidth : undoValues[xKey],
                  [yKey]: totalHeight ? limitedY / totalHeight : undoValues[yKey]
              };
              const args = {
                  property: exports.DataGroup.Point, target: container,
                  type: exports.ActionType.ChangeMultiple, redoValues, undoValues
              };
              editor.actions.create(args);
          };
          const pointerMoveStart = (event) => {
              // console.log("pointerMoveStart setting dragging")
              eventStop(event);
              const { clientX: x, clientY: y } = event;
              const nowPoint = { x, y };
              if (pointsEqual(nowPoint, clickPoint))
                  return;
              // make sure we're either not tweening, or on start/end frame
              if (tweeningPoints(container)) {
                  const { time } = editor;
                  const closest = time.closest(timeRange);
                  if (!time.equalsTime(closest)) {
                      removeWindowHandlers();
                      // console.log("pointerMoveStart going to", closest)
                      editor.goToTime(closest);
                      return;
                  }
              }
              // set new move listener, and call it
              // console.log("pointerMoveStart setting dragging")
              editor.dragging = true;
              globalThis.window.removeEventListener('pointermove', pointerMoveStart);
              globalThis.window.addEventListener('pointermove', pointerMove);
              pointerMove(event);
          };
          const pointerDown = (event) => {
              // console.log("pointerDown")
              eventStop(event);
              // event.stopPropagation()
              if (!(event instanceof PointerEvent))
                  return;
              const { clientX: x, clientY: y } = event;
              clickPoint.x = x;
              clickPoint.y = y;
              globalThis.window.addEventListener('pointermove', pointerMoveStart);
              globalThis.window.addEventListener('pointerup', pointerUp);
              if (editor.selection.clip !== clip) {
                  editor.selection.set(clip);
              }
          };
          return pointerDown;
      }
      get preview() { return this.args.preview; }
      get quantize() { return this.preview.quantize; }
      _rect;
      get rect() { return this._rect || this.rectInitialize; }
      get rectInitialize() {
          const { time, timeRange, clip, size } = this;
          assertSizeAboveZero(size, `${this.constructor.name}.rectInitialize size`);
          const containerRectArgs = {
              size, time, timeRange, editing: true,
          };
          const containerRects = clip.rects(containerRectArgs);
          assertTrue(rectsEqual(...containerRects));
          return containerRects[0];
      }
      get size() { return this.preview.size; }
      editingSvgItem(classes, inactive) {
          // console.log(this.constructor.name, "editingSvgItem", className)
          const { container, rect } = this;
          const svgItem = container.pathElement(rect);
          svgItem.setAttribute('vector-effect', 'non-scaling-stroke');
          svgAddClass(svgItem, classes);
          if (!inactive)
              svgItem.addEventListener('pointerdown', this.pointerDown());
          return svgItem;
      }
      svgBoundsElement(lineClasses, handleClasses, inactive) {
          const items = [];
          const handle = TrackPreviewHandleSize;
          const line = TrackPreviewLineSize;
          const halfLine = line / 2;
          const { rect, container } = this;
          const { directions } = container;
          const { width, height, x, y } = rect;
          const lineRect = { x: x - halfLine, y: y - halfLine, width: width, height: line };
          items.push(svgPolygonElement(lineRect, lineClasses));
          lineRect.y = y + height - halfLine;
          items.push(svgPolygonElement(lineRect, lineClasses));
          lineRect.x = x + width - halfLine;
          lineRect.height = height;
          lineRect.width = line;
          lineRect.y = y;
          items.push(svgPolygonElement(lineRect, lineClasses));
          lineRect.x = x - halfLine;
          items.push(svgPolygonElement(lineRect, lineClasses));
          const size = { width, height };
          directions.forEach(direction => {
              const point = this.svgHandlePoint(size, direction);
              const rect = { x: x + point.x, y: y + point.y, width: handle, height: handle };
              const element = svgPolygonElement(rect, [...handleClasses, direction.toLowerCase()]);
              items.push(element);
              if (inactive)
                  return;
              element.addEventListener('pointerdown', (event) => {
                  // console.log("pointerdown", direction)
                  this.editor.selection.set(this.clip);
                  eventStop(event);
              });
          });
          // svgSetTransformPoint(groupElement, rect)
          return items;
      }
      svgHandlePoint(dimensions, direction) {
          const handle = TrackPreviewHandleSize;
          const halfHandle = handle / 2;
          const { width, height } = dimensions;
          const point = { ...PointZero };
          const [first, second] = String(direction).split('');
          assertDirection(first, direction);
          const last = second || first;
          assertDirection(last);
          switch (last) {
              case exports.Direction.W:
                  point.x = -halfHandle;
                  break;
              case exports.Direction.E:
                  point.x = width - halfHandle;
                  break;
              default: point.x = Math.round(width / 2) - halfHandle;
          }
          switch (first) {
              case exports.Direction.N:
                  point.y = -halfHandle;
                  break;
              case exports.Direction.S:
                  point.y = height - halfHandle;
                  break;
              default: point.y = Math.round(height / 2) - halfHandle;
          }
          return point;
      }
      get time() { return this.preview.time; }
      _timeRange;
      get timeRange() { return this._timeRange ||= this.clip.timeRange(this.quantize); }
  }

  class PreviewClass {
      constructor(args) {
          const { selectedClip, editor, time, mash, background, onlyClip, size } = args;
          this.mash = mash;
          this.size = size || mash.imageSize;
          this.time = time;
          this.background = background;
          this.selectedClip = selectedClip;
          this.onlyClip = onlyClip;
          if (isObject(editor))
              this.editor = editor;
      }
      audible = false;
      background;
      _clips;
      get clips() { return this._clips ||= this.clipsInitialize; }
      get clipsInitialize() {
          const { mash, time, onlyClip } = this;
          if (onlyClip)
              return [onlyClip];
          return mash.clipsInTimeOfType(time, exports.AVType.Video).sort(sortByTrack);
      }
      combine = false;
      get duration() { return this.time.lengthSeconds; }
      get editing() { return isObject(this.editor); }
      editor;
      get intrinsicSizePromise() {
          const { clips, preloader } = this;
          const options = { editing: true, size: true };
          const unknownClips = clips.filter(clip => !clip.intrinsicsKnown(options));
          const files = unknownClips.flatMap(clip => clip.intrinsicGraphFiles(options));
          return preloader.loadFilesPromise(files);
      }
      get itemsPromise() {
          const { clips, size, time, onlyClip } = this;
          let promise = Promise.resolve([]);
          const icon = !!onlyClip;
          clips.forEach(clip => {
              promise = promise.then(lastTuple => {
                  return clip.previewItemsPromise(size, time, icon).then(svgItems => {
                      return [...lastTuple, ...svgItems];
                  });
              });
          });
          return promise;
      }
      mash;
      onlyClip;
      get preloader() { return this.mash.preloader; }
      get quantize() { return this.mash.quantize; }
      size;
      selectedClip;
      streaming = false;
      _svgItems;
      time;
      _trackPreviews;
      get trackPreviews() { return this._trackPreviews ||= this.trackPreviewsInitialize; }
      get trackPreviewsInitialize() {
          const trackPreviews = [];
          const { time, quantize, clips } = this;
          const tweenTime = time.isRange ? undefined : time.scale(quantize);
          clips.forEach(clip => {
              const clipTimeRange = clip.timeRange(quantize);
              const range = clipTimeRange.scale(time.fps);
              const frame = Math.max(0, time.frame - range.frame);
              const timeRange = range.withFrame(frame);
              const filterChainArgs = {
                  clip, preview: this, tweenTime, timeRange, icon: !!this.onlyClip
              };
              trackPreviews.push(new TrackPreviewClass(filterChainArgs));
          });
          return trackPreviews;
      }
      get svgItemsPromise() {
          return this.previewItemsPromise;
      }
      get previewItemsPromise() {
          if (this._svgItems)
              return Promise.resolve(this._svgItems);
          const sizePromise = this.intrinsicSizePromise;
          const itemsPromise = sizePromise.then(() => this.itemsPromise);
          return itemsPromise.then(svgItems => {
              return this._svgItems = this.tupleItems(svgItems);
          });
      }
      tupleItems(svgItems) {
          const { size, editing, background, selectedClip, editor } = this;
          const previewItems = [...svgItems];
          const trackClasses = 'track';
          previewItems.forEach(item => svgAddClass(item, trackClasses));
          const backgroundClasses = 'background';
          if (background) {
              const backgroundPolygon = svgPolygonElement(size, backgroundClasses, background);
              const backgroundSvg = svgElement(size, backgroundPolygon);
              previewItems.unshift(backgroundSvg);
          }
          if (!(editing && svgItems.length))
              return previewItems;
          assertObject(editor);
          // TODO: get classes from theme
          const { dragging } = editor;
          const { trackPreviews } = this;
          const selectedPreview = trackPreviews.find(preview => preview.clip === selectedClip);
          const hoverItems = trackPreviews.map(trackPreview => {
              const trackSelected = trackPreview === selectedPreview;
              const classes = ['outline'];
              if (!(dragging || trackSelected))
                  classes.push('animate');
              // console.log(this.constructor.name, "tupleItems", dragging, trackSelected)
              return trackPreview.editingSvgItem(classes);
          });
          const outlineClasses = ['outlines'];
          const hoversSvg = svgElement(size, hoverItems);
          svgAddClass(hoversSvg, outlineClasses);
          previewItems.push(hoversSvg);
          if (!selectedPreview)
              return previewItems;
          const classes = ['bounds', 'back'];
          const lineClasses = ['line'];
          const handleClasses = ['handle'];
          const activeSvg = svgElement(size, selectedPreview.svgBoundsElement(lineClasses, handleClasses, true));
          svgAddClass(activeSvg, classes);
          classes[1] = 'fore';
          const passiveSvg = svgElement(size, selectedPreview.svgBoundsElement(lineClasses, handleClasses));
          svgAddClass(passiveSvg, classes);
          previewItems.push(activeSvg, passiveSvg);
          return previewItems;
      }
      visible = true;
  }

  class ClipClass extends InstanceBase {
      constructor(...args) {
          super(...args);
          const [object] = args;
          const { container, content } = object;
          this.containerInitialize(container || {});
          this.contentInitialize(content || {});
      }
      assureTimingAndSizing(timing, sizing, tweenable) {
          const { timing: myTiming, sizing: mySizing, containerId } = this;
          // const containerOk = containerId !== DefaultContainerId
          // const contentOk = contentId !== DefaultContentId
          let timingOk = myTiming !== timing;
          let sizingOk = mySizing !== sizing;
          timingOk ||= tweenable.hasIntrinsicTiming;
          sizingOk ||= tweenable.hasIntrinsicSizing;
          // timingOk ||= timing === Timing.Container ? containerOk : contentOk
          // sizingOk ||= sizing === Sizing.Container ? containerOk : contentOk
          if (!timingOk) {
              if (timing === exports.Timing.Content && containerId) {
                  this.timing = exports.Timing.Container;
              }
              else
                  this.timing = exports.Timing.Custom;
              // console.log(this.constructor.name, "assureTimingAndSizing setting timing", type, isTimingDefinitionType(type), myTiming, "->", this.timing)
          }
          if (!sizingOk) {
              if (sizing === exports.Sizing.Content && containerId) {
                  this.sizing = exports.Sizing.Container;
              }
              else
                  this.sizing = exports.Sizing.Preview;
              // console.log(this.constructor.name, "assureTimingAndSizing setting sizing", type, isSizingDefinitionType(type), mySizing, "->", this.sizing)
          }
          return !(sizingOk && timingOk);
      }
      get audible() {
          return this.mutable;
      }
      clipFileUrls(args) {
          const files = [];
          const { quantize } = args;
          const { content, container, frames } = this;
          if (isAboveZero(frames))
              args.clipTime ||= this.timeRange(quantize);
          if (container)
              files.push(...container.fileUrls(args));
          files.push(...content.fileUrls(args));
          return files;
      }
      clipIcon(size, scale, buffer = 1) {
          const { container } = this;
          // TODO: display audio waveform...
          if (!container)
              return;
          const { track } = this;
          const { quantize, imageSize } = track.mash;
          assertSizeAboveZero(imageSize, 'track.mash.imageSize');
          const frameSize = sizeEven(sizeCover(imageSize, size, true));
          assertSizeAboveZero(frameSize, `${this.constructor.name}.clipIcon containedSize`);
          const widthAndBuffer = frameSize.width + buffer;
          const cellCount = Math.ceil(size.width / widthAndBuffer);
          const clipTime = this.timeRange(quantize);
          const { startTime } = clipTime;
          const previews = [];
          const { mash } = track;
          let pixel = 0;
          for (let i = 0; i < cellCount; i++) {
              const { copy: time } = startTime;
              const previewArgs = {
                  mash, time, onlyClip: this, size: frameSize,
              };
              const preview = new PreviewClass(previewArgs);
              previews.push(preview);
              pixel += widthAndBuffer;
              startTime.frame = clipTime.frame + pixelToFrame(pixel, scale, 'floor');
          }
          let svgItemPromise = Promise.resolve([]);
          previews.forEach(preview => {
              svgItemPromise = svgItemPromise.then(items => {
                  return preview.svgItemsPromise.then(svgItems => {
                      return [...items, ...svgItems];
                  });
              });
          });
          return svgItemPromise.then(svgItems => {
              const point = { ...PointZero };
              const containerSvg = svgElement(size);
              svgItems.forEach(groupItem => {
                  svgSetDimensions(groupItem, point);
                  svgAppend(containerSvg, groupItem);
                  point.x += widthAndBuffer;
              });
              return containerSvg;
          });
      }
      clipCommandFiles(args) {
          const commandFiles = [];
          const { visible, quantize, outputSize: outputSize, time } = args;
          const clipTime = this.timeRange(quantize);
          const { content, container } = this;
          const contentArgs = { ...args, clipTime };
          // console.log(this.constructor.name, "commandFiles", visible, outputSize)
          if (visible) {
              assertSizeAboveZero(outputSize, 'outputSize');
              assertContainer(container);
              const containerRectArgs = {
                  size: outputSize, time, timeRange: clipTime, loading: true
              };
              const containerRects = this.rects(containerRectArgs);
              // console.log(this.constructor.name, "clipCommandFiles", containerRects)
              const colors = isColorContent(content) ? content.contentColors(time, clipTime) : undefined;
              const fileArgs = {
                  ...contentArgs, outputSize, contentColors: colors, containerRects
              };
              if (!colors) {
                  const contentFiles = content.visibleCommandFiles(fileArgs);
                  // console.log(this.constructor.name, "commandFiles content:", contentFiles.length)
                  commandFiles.push(...contentFiles);
              }
              const containerFiles = container.visibleCommandFiles(fileArgs);
              // console.log(this.constructor.name, "commandFiles container:", containerFiles.length)
              commandFiles.push(...containerFiles);
          }
          else {
              assertTrue(!visible, 'outputSize && container');
              commandFiles.push(...this.content.audibleCommandFiles(contentArgs));
          }
          return commandFiles;
      }
      commandFilters(args) {
          const commandFilters = [];
          const { visible, quantize, outputSize, time } = args;
          const clipTime = this.timeRange(quantize);
          const contentArgs = { ...args, clipTime };
          const { content, container } = this;
          if (!visible)
              return this.content.audibleCommandFilters(contentArgs);
          assertSizeAboveZero(outputSize, 'outputSize');
          assertContainer(container);
          const containerRectArgs = {
              size: outputSize, time, timeRange: clipTime
          };
          const containerRects = this.rects(containerRectArgs);
          contentArgs.containerRects = containerRects;
          const tweening = {
              point: !pointsEqual(...containerRects),
              size: !sizesEqual(...containerRects),
          };
          // console.log(this.constructor.name, "commandFilters", contentArgs.containerRects)
          const isColor = isColorContent(content);
          const colors = isColor ? content.contentColors(time, clipTime) : undefined;
          const hasColorContent = isPopulatedArray(colors);
          if (hasColorContent) {
              tweening.color = colors[0] !== colors[1];
              tweening.canColor = tweening.color ? container.canColorTween(args) : container.canColor(args);
          }
          const timeDuration = time.isRange ? time.lengthSeconds : 0;
          const duration = timeDuration ? Math.min(timeDuration, clipTime.lengthSeconds) : 0;
          const containerArgs = {
              ...contentArgs, contentColors: colors, outputSize, containerRects, duration
          };
          if (hasColorContent) {
              if (!tweening.canColor) {
                  // inject color filter, I will alphamerge to colorize myself later
                  commandFilters.push(...container.containerColorCommandFilters(containerArgs));
                  containerArgs.filterInput = arrayLast(arrayLast(commandFilters).outputs);
              }
          }
          else {
              commandFilters.push(...content.commandFilters(containerArgs, tweening));
              containerArgs.filterInput = arrayLast(arrayLast(commandFilters).outputs);
          }
          commandFilters.push(...container.commandFilters(containerArgs, tweening, true));
          return commandFilters;
      }
      _container;
      get container() { return this._container || this.containerInitialize(); }
      containerInitialize(containerObject = {}) {
          const { containerId } = this;
          const definitionId = containerId || containerObject.definitionId;
          if (!isPopulatedString(definitionId))
              return;
          const definition = Defined.fromId(definitionId);
          const object = { ...containerObject, definitionId, container: true };
          const instance = definition.instanceFromObject(object);
          assertContainer(instance);
          this.assureTimingAndSizing(exports.Timing.Container, exports.Sizing.Container, instance);
          instance.clip = this;
          if (this.timing === exports.Timing.Container && this._track)
              this.resetTiming(instance);
          // console.log(this.constructor.name, "containerInitialize", object, instance.constructor.name, instance.definitionId, instance.type)
          return this._container = instance;
      }
      _content;
      get content() { return this._content || this.contentInitialize(); }
      contentInitialize(contentObject = {}) {
          const { contentId } = this;
          const definitionId = contentId || contentObject.definitionId;
          assertPopulatedString(definitionId);
          const definition = Defined.fromId(definitionId);
          const object = { ...contentObject, definitionId };
          const instance = definition.instanceFromObject(object);
          assertContent(instance);
          if (this.assureTimingAndSizing(exports.Timing.Content, exports.Sizing.Content, instance)) {
              const { container } = this;
              if (container) {
                  this.assureTimingAndSizing(exports.Timing.Container, exports.Sizing.Container, container);
              }
          }
          instance.clip = this;
          if (this.timing === exports.Timing.Content && this._track)
              this.resetTiming(instance);
          // console.log(this.constructor.name, "contentInitialize", object, instance.constructor.name, instance.definitionId, instance.type)
          return this._content = instance;
      }
      copy() {
          const object = { ...this.toJSON(), id: '' };
          return this.definition.instanceFromObject(object);
      }
      definitionIds() {
          const ids = [
              ...super.definitionIds(),
              ...this.content.definitionIds(),
          ];
          if (this.container)
              ids.push(...this.container.definitionIds());
          return ids;
      }
      get endFrame() { return this.frame + this.frames; }
      endTime(quantize) {
          return timeFromArgs(this.endFrame, quantize);
      }
      intrinsicsKnown(options) {
          const { content, container } = this;
          let known = content.intrinsicsKnown(options);
          if (container)
              known &&= container.intrinsicsKnown(options);
          return known;
      }
      intrinsicGraphFiles(options) {
          const { content, container } = this;
          const files = [];
          if (!content.intrinsicsKnown(options)) {
              files.push(content.intrinsicGraphFile(options));
          }
          if (container && !container.intrinsicsKnown(options)) {
              files.push(container.intrinsicGraphFile(options));
          }
          return files;
      }
      maxFrames(_quantize, _trim) { return 0; }
      get mutable() {
          const { content } = this;
          const contentMutable = content.mutable();
          if (contentMutable) {
              // console.log(this.constructor.name, "mutable content", content.definitionId, content.definition.id)
              return true;
          }
          const { container } = this;
          if (!container)
              return false;
          const containerMutable = container.mutable();
          // console.log(this.constructor.name, "mutable container", containerMutable, container.definitionId, container.definition.id)
          return containerMutable;
      }
      get notMuted() {
          const { content, muted } = this;
          if (muted)
              return false;
          if (content.mutable() && !content.muted)
              return true;
          const { container } = this;
          if (!container?.mutable())
              return true;
          return !container.muted;
      }
      previewItemsPromise(size, time, icon) {
          assertSizeAboveZero(size, 'previewItemsPromise');
          const timeRange = this.timeRange(this.track.mash.quantize);
          const svgTime = time || timeRange.startTime;
          const { container, content } = this;
          assertContainer(container);
          const containerRectArgs = {
              size, time: svgTime, timeRange, editing: true,
          };
          const containerRects = this.rects(containerRectArgs);
          assertTrue(rectsEqual(...containerRects));
          const [containerRect] = containerRects;
          return container.containedContent(content, containerRect, size, svgTime, timeRange, icon);
      }
      rectIntrinsic(size, loading, editing) {
          const rect = { ...size, ...PointZero };
          const { sizing } = this;
          if (sizing === exports.Sizing.Preview)
              return rect;
          const target = sizing === exports.Sizing.Container ? this.container : this.content;
          assertTweenable(target);
          const known = target.intrinsicsKnown({ editing, size: true });
          if (loading && !known)
              return rect;
          assertTrue(known, 'intrinsicsKnown');
          const targetRect = target.intrinsicRect(editing);
          // console.log(this.constructor.name, "rectIntrinsic KNOWN", targetRect, sizing, target.definition.label)
          return targetRect;
      }
      rects(args) {
          const { size, loading, editing } = args;
          const intrinsicRect = this.rectIntrinsic(size, loading, editing);
          // console.log(this.constructor.name, "rects intrinsicRect", intrinsicRect, args)
          const { container } = this;
          assertContainer(container);
          return container.containerRects(args, intrinsicRect);
      }
      resetTiming(tweenable, quantize) {
          const { timing } = this;
          // console.log("resetTiming", timing)
          const track = this._track;
          switch (timing) {
              case exports.Timing.Custom: {
                  // console.log("resetTiming", this.frames)
                  if (isAboveZero(this.frames))
                      break;
                  this.frames = Default.duration * (quantize || track.mash.quantize);
                  break;
              }
              case exports.Timing.Container: {
                  const container = isContainer(tweenable) ? tweenable : this.container;
                  if (!container)
                      break;
                  // if (!isUpdatableDuration(container)) break
                  this.frames = container.frames(quantize || track.mash.quantize);
                  break;
              }
              case exports.Timing.Content: {
                  const content = isContent(tweenable) ? tweenable : this.content;
                  if (!content)
                      break;
                  // if (!isUpdatableDuration(content)) break    
                  this.frames = content.frames(quantize || track.mash.quantize);
                  break;
              }
          }
      }
      selectType = exports.SelectType.Clip;
      selectables() { return [this, ...this.track.selectables()]; }
      selectedItems(actions) {
          const selected = [];
          const { properties } = this;
          const props = properties.filter(property => this.selectedProperty(property));
          props.forEach(property => {
              const { name } = property;
              const isFrames = name === 'frames' || name === 'frame';
              const undoValue = this.value(name);
              const target = this;
              selected.push({
                  value: undoValue,
                  selectType: exports.SelectType.Clip, property,
                  changeHandler: (property, redoValue) => {
                      assertPopulatedString(property);
                      const options = { property, target, redoValue, undoValue,
                          type: isFrames ? exports.ActionType.ChangeFrame : exports.ActionType.Change
                      };
                      actions.create(options);
                  }
              });
          });
          return selected;
      }
      selectedProperty(property) {
          const { name, type } = property;
          switch (type) {
              case exports.DataType.ContainerId:
              case exports.DataType.ContentId: return false;
          }
          switch (name) {
              case 'sizing': return !isAudio(this.content);
              case 'timing': {
                  if (this.content.hasIntrinsicTiming)
                      break;
                  return !!this.container?.hasIntrinsicSizing;
              }
              case 'frame': return !this.track.dense;
              case 'frames': return this.timing === exports.Timing.Custom;
          }
          return true;
      }
      setValue(value, name, property) {
          super.setValue(value, name, property);
          switch (name) {
              case 'containerId': {
                  // console.log(this.constructor.name, "setValue", name, value, !!property)
                  if (this._container)
                      this.containerInitialize(this._container.toJSON());
                  break;
              }
              case 'contentId': {
                  // console.log(this.constructor.name, "setValue", name, value, !!property)
                  if (this._content)
                      this.contentInitialize(this._content.toJSON());
                  break;
              }
          }
      }
      // private _svgElement?: SVGSVGElement
      // private get svgElement() { 
      //   return this._svgElement ||= svgElement() 
      // }
      // private updateSvg(rect: Rect) {
      //   svgSetDimensions(this.svgElement, rect)
      // }
      time(quantize) { return timeFromArgs(this.frame, quantize); }
      timeRange(quantize) {
          const { frame, frames } = this;
          assertPositive(frame, "timeRange frame");
          assertAboveZero(frames, "timeRange frames");
          return timeRangeFromArgs(this.frame, quantize, this.frames);
      }
      timeRangeRelative(timeRange, quantize) {
          const range = this.timeRange(quantize).scale(timeRange.fps);
          const frame = Math.max(0, timeRange.frame - range.frame);
          return timeRange.withFrame(frame);
      }
      toJSON() {
          const json = super.toJSON();
          const { container, content } = this;
          json.content = content;
          json.contentId = content.definitionId;
          if (container) {
              json.container = container;
              json.containerId = container.definitionId;
          }
          else
              json.containerId = "";
          return json;
      }
      toString() {
          return `[Clip ${this.label}]`;
      }
      _track;
      get track() { return this._track; }
      set track(value) { this._track = value; }
      get trackNumber() {
          const { track } = this;
          return track ? track.index : -1;
      }
      set trackNumber(value) { if (value < 0)
          delete this._track; }
      get visible() {
          return !!this.containerId;
      }
  }

  class ClipDefinitionClass extends DefinitionBase {
      constructor(...args) {
          super(...args);
          this.properties.push(propertyInstance({
              name: "containerId", type: exports.DataType.ContainerId,
              defaultValue: DefaultContainerId
          }));
          this.properties.push(propertyInstance({
              name: "contentId", type: exports.DataType.ContentId,
              defaultValue: DefaultContentId
          }));
          this.properties.push(propertyInstance({
              name: "label", type: exports.DataType.String
          }));
          this.properties.push(propertyInstance({
              name: "sizing", type: exports.DataType.Sizing, defaultValue: exports.Sizing.Content,
              // group: DataGroup.Sizing,
          }));
          this.properties.push(propertyInstance({
              name: "timing", type: exports.DataType.Timing, defaultValue: exports.Timing.Content,
              group: exports.DataGroup.Timing,
          }));
          this.properties.push(propertyInstance({
              name: "frame",
              type: exports.DataType.Frame,
              group: exports.DataGroup.Timing,
              defaultValue: exports.Duration.None, min: 0, step: 1
          }));
          this.properties.push(propertyInstance({
              name: "frames", type: exports.DataType.Frame, defaultValue: exports.Duration.Unknown,
              min: 1, step: 1,
              group: exports.DataGroup.Timing,
          }));
      }
      audible = false;
      instanceArgs(object = {}) {
          const args = super.instanceArgs(object);
          const { containerId, contentId } = args;
          const defaultContent = isUndefined(contentId) || contentId === DefaultContentId;
          let defaultContainer = isUndefined(containerId) || containerId === DefaultContainerId;
          if (args.sizing === exports.Sizing.Content && defaultContent) {
              // console.log("instanceArgs setting sizing to container", object)
              args.sizing = exports.Sizing.Container;
          }
          if (args.sizing === exports.Sizing.Container && defaultContainer) {
              // console.log("instanceArgs setting sizing to preview", object)
              args.sizing = exports.Sizing.Preview;
          }
          if (args.timing === exports.Timing.Content && defaultContent) {
              args.timing = exports.Timing.Container;
          }
          if (args.timing === exports.Timing.Container && defaultContainer) {
              args.timing = exports.Timing.Custom;
          }
          // console.log("instanceArgs", args)
          return args;
      }
      instanceFromObject(object = {}) {
          return new ClipClass(this.instanceArgs(object));
      }
      streamable = false;
      type = exports.DefinitionType.Clip;
      visible = false;
  }

  const label = "Visible";
  const type = "visible";
  const id = "com.moviemasher.clip.default";
  const containerId = "com.moviemasher.container.default";
  const contentId = "com.moviemasher.content.default";
  var clipDefaultJson = {
    label: label,
    type: type,
    id: id,
    containerId: containerId,
    contentId: contentId
  };

  const clipDefault = new ClipDefinitionClass(clipDefaultJson);
  const clipDefaultId = clipDefault.id;
  const clipDefaults = [clipDefault];
  const clipDefinition = (object) => {
      const { id } = object;
      assertPopulatedString(id);
      return new ClipDefinitionClass({ ...object, type: exports.DefinitionType.Clip });
  };
  const clipDefinitionFromId = (id) => {
      const definition = clipDefaults.find(definition => definition.id === id);
      if (definition)
          return definition;
      return clipDefinition({ id });
  };
  const clipInstance = (object = {}) => {
      const { definitionId = clipDefaultId } = object;
      if (!definitionId)
          throw Errors.id;
      const definition = clipDefinitionFromId(definitionId);
      const instance = definition.instanceFromObject(object);
      return instance;
  };
  const clipFromId = (id) => {
      const definition = clipDefinitionFromId(id);
      const instance = definition.instanceFromObject({ definitionId: id });
      return instance;
  };
  Factories[exports.DefinitionType.Clip] = {
      definition: clipDefinition,
      definitionFromId: clipDefinitionFromId,
      fromId: clipFromId,
      instance: clipInstance,
      defaults: clipDefaults,
  };

  class TrackClass extends PropertiedClass {
      constructor(args) {
          super();
          const { clips, index: layer, dense } = args;
          if (isPositive(layer))
              this.index = layer;
          this.dense = isDefined(dense) ? !!dense : !this.index;
          this.properties.push(propertyInstance({ name: "dense", defaultValue: false }));
          this.propertiesInitialize(args);
          if (clips) {
              this.clips.push(...clips.map(clip => {
                  const instance = clipInstance(clip);
                  instance.track = this;
                  return instance;
              }));
          }
      }
      addClips(clips, insertIndex = 0) {
          let clipIndex = insertIndex || 0;
          if (!this.dense)
              clipIndex = 0; // ordered by clip.frame values
          const origIndex = clipIndex; // note original, since it may decrease...
          // build array of my clips excluding the clips we're inserting
          const spliceClips = this.clips.filter((other, index) => {
              const moving = clips.includes(other);
              // insert index should be decreased when clip is moving and comes before
              if (origIndex && moving && index < origIndex)
                  clipIndex -= 1;
              return !moving;
          });
          // insert the clips we're adding at the correct index, then sort properly
          spliceClips.splice(clipIndex, 0, ...clips);
          this.sortClips(spliceClips);
          arraySet(this.clips, spliceClips);
      }
      assureFrame(clips) {
          const clipsArray = clips || this.clips;
          let changed = false;
          let endFrame = 0;
          const ranges = [];
          const { dense } = this;
          clipsArray.forEach(clip => {
              const { frame } = clip;
              if (dense ? frame !== endFrame : ranges.some(range => range.includes(frame))) {
                  changed = true;
                  clip.frame = endFrame;
              }
              endFrame = clip.frame + clip.frames;
              if (!dense)
                  ranges.push(clip.timeRange(1));
          });
          return changed;
      }
      assureFrames(quantize, clips) {
          const suppliedClips = isDefined(clips);
          const clipsArray = clips || this.clips;
          // console.log(this.constructor.name, "assureFrames", clipsArray.length, "clip(s)")
          clipsArray.forEach(clip => {
              const { frames } = clip;
              if (isAboveZero(frames))
                  return;
              clip.resetTiming(undefined, quantize);
              if (isAboveZero(clip.frames) || !suppliedClips)
                  return;
              clip.frames = Math.floor(Default.duration * quantize);
          });
      }
      clips = [];
      dense = false;
      frameForClipNearFrame(clip, frame = 0) {
          if (this.dense)
              return frame;
          const others = this.clips.filter(other => clip !== other && other.endFrame > frame);
          if (!others.length)
              return frame;
          const startFrame = clip.frame;
          const endFrame = clip.endFrame;
          const frames = endFrame - startFrame;
          let lastFrame = frame;
          others.find(clip => {
              if (clip.frame >= lastFrame + frames)
                  return true;
              lastFrame = clip.endFrame;
          });
          return lastFrame;
      }
      get frames() {
          const { clips } = this;
          const { length } = clips;
          if (!length)
              return exports.Duration.None;
          for (const clip of clips) {
              const { frames: clipFrames } = clip;
              switch (clipFrames) {
                  case exports.Duration.Unknown:
                  case exports.Duration.Unlimited: return clipFrames;
              }
          }
          const clip = arrayLast(clips);
          const { frame, frames } = clip;
          return frame + frames;
      }
      _identifier;
      get identifier() { return this._identifier ||= idGenerate('track'); }
      index = 0;
      _mash;
      get mash() {
          const { _mash } = this;
          assertMash(_mash);
          return _mash;
      }
      set mash(value) { this._mash = value; }
      removeClips(clips) {
          const newClips = this.clips.filter(other => !clips.includes(other));
          assertTrue(newClips.length !== this.clips.length);
          clips.forEach(clip => clip.trackNumber = -1);
          this.sortClips(newClips);
          arraySet(this.clips, newClips);
      }
      selectType = exports.SelectType.Track;
      selectables() { return [this, ...this.mash.selectables()]; }
      selectedItems(actions) {
          return this.properties.map(property => {
              const undoValue = this.value(property.name);
              const target = this;
              return {
                  value: undoValue,
                  property, selectType: exports.SelectType.Track,
                  changeHandler: (property, redoValue) => {
                      assertPopulatedString(property);
                      const options = { target, property, redoValue, undoValue };
                      actions.create(options);
                  }
              };
          });
      }
      sortClips(clips) {
          const sortClips = clips || this.clips;
          const changed = this.assureFrame(sortClips);
          sortClips.sort(sortByFrame);
          return changed;
      }
      toJSON() {
          const json = super.toJSON();
          json.clips = this.clips;
          return json;
      }
  }

  const trackInstance = (object) => new TrackClass(object);
  /**
   * @category Factory
   */
  const TrackFactory = { instance: trackInstance };

  class NonePreview extends PreviewClass {
      get clips() { return []; }
  }

  class MashClass extends EditedClass {
      constructor(args) {
          super(args);
          const { createdAt, icon, id, label, frame, preloader, rendering, tracks, ...rest } = args;
          this.dataPopulate(rest);
          if (isPopulatedString(rendering))
              this._rendering = rendering;
          if (isPopulatedString(createdAt))
              this.createdAt = createdAt;
          if (isAboveZero(frame))
              this._frame = frame;
          if (isPopulatedArray(tracks))
              tracks.forEach((trackObject, index) => {
                  const trackArgs = {
                      dense: !index, ...trackObject, index
                  };
                  const track = trackInstance(trackArgs);
                  track.mash = this;
                  track.assureFrames(this.quantize);
                  track.sortClips();
                  this.tracks.push(track);
              });
          this.assureTrack();
          this.tracks.sort(sortByIndex);
          this._preview = new NonePreview({ mash: this, time: timeFromArgs() });
          this.label ||= Default.mash.label;
      }
      addClipToTrack(clip, trackIndex = 0, insertIndex = 0, frame) {
          const clipsArray = isArray(clip) ? clip : [clip];
          const trackClips = this.trackClips(clipsArray, trackIndex);
          this.emitIfFramesChange(() => {
              trackClips.forEach(entry => {
                  const [index, clips] = entry;
                  const newTrack = this.tracks[index];
                  assertTrack(newTrack, 'track');
                  clips.forEach(clip => {
                      const oldTrackNumber = clip.trackNumber;
                      if (isPositive(oldTrackNumber) && oldTrackNumber !== index) {
                          clip.track.removeClips([clip]);
                      }
                      if (isPositive(frame))
                          clip.frame = frame;
                      clip.track = newTrack;
                  });
                  newTrack.assureFrames(this.quantize, clips);
                  newTrack.addClips(clips, insertIndex);
              });
          });
      }
      addTrack(options = {}) {
          if (!isPositive(options.index))
              options.index = this.tracks.length;
          const track = trackInstance(options);
          track.mash = this;
          this.tracks.push(track);
          this.tracks.sort(sortByIndex);
          this.emitter?.emit(exports.EventType.Track);
          return track;
      }
      assureTrack() {
          if (!this.tracks.length) {
              const trackArgs = { dense: true };
              const track = trackInstance(trackArgs);
              track.mash = this;
              this.tracks.push(track);
          }
      }
      _buffer = Default.mash.buffer;
      get buffer() { return this._buffer; }
      set buffer(value) {
          if (!isAboveZero(value))
              throw Errors.invalid.argument + 'buffer ' + value;
          if (this._buffer !== value) {
              this._buffer = value;
              if (this._composition)
                  this.composition.buffer = value;
          }
      }
      bufferStart() {
          if (this._bufferTimer)
              return;
          this._bufferTimer = setInterval(() => {
              if (this._paused)
                  return;
              const options = {
                  editing: true, audible: true
              };
              this.loadPromiseUnlessBuffered(options);
              const clips = this.clipsAudibleInTime(this.timeToBuffer);
              this.composition.bufferClips(clips, this.quantize);
          }, Math.round((this.buffer * 1000) / 2));
      }
      bufferStop() {
          if (!this._bufferTimer)
              return;
          clearInterval(this._bufferTimer);
          delete this._bufferTimer;
      }
      _bufferTimer;
      changeTiming(propertied, property, value) {
          this.emitIfFramesChange(() => {
              propertied.setValue(value, property);
          });
      }
      clearDrawInterval() {
          if (!this.drawInterval)
              return;
          clearInterval(this.drawInterval);
          this.drawInterval = undefined;
      }
      clearPreview() {
          // console.log(this.constructor.name, "clearPreview")
          delete this._preview;
      }
      clipIntersects(clip, range) {
          if (!clip.frames)
              return true;
          return clip.timeRange(this.quantize).intersects(range);
      }
      get clips() {
          return this.tracks.map(track => track.clips).flat();
      }
      clipsAudibleInTime(time) {
          const { clips } = this;
          const clipsAudible = clips.filter(clip => clip.mutable && clip.notMuted);
          return this.filterIntersecting(clipsAudible, time);
      }
      clipsInTime(time) {
          return this.filterIntersecting(this.clips, time);
      }
      clipsInTimeOfType(time, avType = exports.AVType.Both) {
          switch (avType) {
              case exports.AVType.Both: return this.clipsInTime(time);
              case exports.AVType.Audio: return this.clipsAudibleInTime(time);
              case exports.AVType.Video: return this.clipsVisibleInTime(time);
          }
      }
      get clipsVisible() {
          return this.clips.filter(clip => clip.container);
      }
      clipsVisibleInTime(time) {
          return this.filterIntersecting(this.clipsVisible, time);
      }
      compositeVisible(time) {
          this.drawingTime = time;
          this.clearPreview();
          this.emitter?.emit(exports.EventType.Draw);
      }
      // private counter = 0
      compositeVisibleRequest(time) {
          // console.log(this.constructor.name, "compositeVisibleRequest", time)
          requestAnimationFrame(() => {
              // if (this.counter) console.timeEnd(`anim-frame-${this.counter}`)
              // this.counter++
              // console.time(`anim-frame-${this.counter}`)
              this.compositeVisible(time);
          });
      }
      _composition;
      get composition() {
          if (!this._composition) {
              const options = {
                  buffer: this.buffer,
                  gain: this.gain,
                  preloader: this.preloader,
              };
              // console.log(this.constructor.name, "composition creating")
              this._composition = new AudioPreview(options);
          }
          return this._composition;
      }
      get definitionIds() {
          const { clips } = this;
          const ids = clips.flatMap(clip => clip.definitionIds());
          const set = [...new Set(ids)];
          // console.log(this.constructor.name, "definitionIds", set.length)
          return set;
      }
      destroy() {
          this.paused = true;
          this.clearDrawInterval();
      }
      draw() {
          const { time } = this;
          this.compositeVisible(time);
      }
      drawInterval;
      drawRequest() {
          // console.log(this.constructor.name, "drawRequest")
          const { time } = this;
          this.compositeVisibleRequest(time);
      }
      drawTime(time) {
          // console.log(this.constructor.name, "drawTime")
          const timeChange = time !== this.time;
          this.drawnTime = time;
          this.drawRequest();
          this.emitter?.emit(timeChange ? exports.EventType.Time : exports.EventType.Loaded);
      }
      drawWhilePlayerNotPlaying() {
          // console.log(this.constructor.name, "drawWhilePlayerNotPlaying")
          const now = performance.now();
          const ellapsed = now - this.drawnSeconds;
          if (ellapsed < 1.0 / this.quantize)
              return;
          this.drawnSeconds = now;
          const { time } = this;
          const clips = this.clipsVisibleInTime(time);
          const streamableClips = clips.filter(clip => clip.definition.streamable);
          if (!streamableClips.length)
              return;
          const files = this.graphFilesUnloaded({ time, editing: true, visible: true });
          const loading = files.length;
          if (loading)
              return;
          this.drawRequest();
      }
      drawingTime;
      drawnSeconds = 0;
      drawnTime;
      get duration() { return this.endTime.seconds; }
      emitIfFramesChange(method) {
          const origFrames = this.frames;
          method();
          const { frames } = this;
          if (origFrames !== frames) {
              this.emitter?.emit(exports.EventType.Duration);
              if (this.frame > frames)
                  this.seekToTime(timeFromArgs(frames, this.quantize));
          }
      }
      get endTime() { return timeFromArgs(this.frames, this.quantize); }
      filterGraphs(options = {}) {
          const { background, time, avType, graphType, size, videoRate, ...rest } = options;
          const definedTime = time || this.time;
          const definedAVType = avType || (definedTime.isRange ? exports.AVType.Both : exports.AVType.Video);
          const filterGraphsOptions = {
              ...rest,
              times: this.timeRanges(definedAVType, definedTime),
              avType: definedAVType,
              graphType: graphType || exports.GraphType.Mash,
              size: size || this.imageSize,
              videoRate: videoRate || definedTime.fps,
              mash: this,
              background: background || this.color,
          };
          // console.log(this.constructor.name, "filterGraphs filterGraphsOptions", filterGraphsOptions.upload, options.upload)
          return new FilterGraphsClass(filterGraphsOptions);
      }
      filterIntersecting(clips, time) {
          const scaled = time.scale(this.quantize);
          return clips.filter(clip => this.clipIntersects(clip, scaled));
      }
      _frame = 0; // initial frame supplied to constructor
      get frame() { return this.time.scale(this.quantize, "floor").frame; }
      get frames() {
          const { tracks } = this;
          if (tracks.length) {
              const frames = this.tracks.map(track => track.frames);
              if (isPositive(Math.min(...frames)))
                  return Math.max(0, ...frames);
              return exports.Duration.Unknown;
          }
          return exports.Duration.None;
      }
      _gain = Default.mash.gain;
      get gain() { return this._gain; }
      set gain(value) {
          if (!isPositive(value))
              throw Errors.invalid.argument + 'gain ' + value;
          if (this._gain !== value) {
              this._gain = value;
              if (this._composition)
                  this.composition.setGain(value, this.quantize);
          }
      }
      graphFileOptions(options = {}) {
          const { time, audible, visible, editing, streaming } = options;
          const definedTime = time || this.time;
          const { isRange } = definedTime;
          const definedVisible = visible || !isRange;
          const definedAudible = isRange && audible;
          const args = {
              editing,
              streaming,
              audible: definedAudible, visible: definedVisible,
              time: definedTime,
              quantize: this.quantize,
          };
          const okay = definedVisible || definedAudible;
          // if (!okay) console.log(this.constructor.name, "graphFileArgs", args)
          assertTrue(okay, "audible || visible");
          return args;
      }
      editedGraphFiles(options) {
          const args = this.graphFileOptions(options);
          const { time, audible, visible } = args;
          const { quantize } = this;
          assertTime(time);
          const scaled = time.scale(this.quantize);
          const type = (audible && visible) ? exports.AVType.Both : (audible ? exports.AVType.Audio : exports.AVType.Video);
          const clips = this.clipsInTimeOfType(scaled, type);
          return clips.flatMap(clip => {
              const clipTime = clip.timeRange(quantize);
              const graphFileArgs = {
                  ...args, clipTime, quantize, time
              };
              return clip.clipFileUrls(graphFileArgs);
          });
      }
      graphFilesUnloaded(options) {
          const files = this.editedGraphFiles(options);
          if (!files.length)
              return [];
          const { preloader } = this;
          return files.filter(file => !preloader.loadedFile(file));
      }
      handleDrawInterval() {
          // console.log(this.constructor.name, "handleDrawInterval", this._playing)
          // what time does the audio context think it is?
          const { seconds } = this.composition;
          // what time would masher consider to be in end frame?
          const nextFrameTime = this.time.withFrame(this.time.frame);
          // are we beyond the end of mash?
          if (seconds >= this.endTime.seconds) {
              // should we loop back to beginning?
              if (this.loop)
                  this.seekToTime(this.time.withFrame(0));
              else {
                  this.paused = true;
                  this.emitter?.emit(exports.EventType.Ended);
              }
          }
          else {
              // are we at or beyond the next frame?
              if (seconds >= nextFrameTime.seconds) {
                  const compositionTime = timeFromSeconds(seconds, this.time.fps);
                  // go to where the audio context thinks we are
                  this.drawTime(compositionTime);
              }
          }
      }
      _layer;
      get layer() { return this._layer; }
      set layer(value) { this._layer = value; }
      loadPromise(args = {}) {
          const promise = this.loadPromiseUnlessBuffered(args);
          // console.log(this.constructor.name, "loadPromise", args, "loadPromiseUnlessBuffered", promise)
          return promise || Promise.resolve();
      }
      loadingPromises = [];
      get loading() { return !!this.loadingPromises.length; }
      loadPromiseUnlessBuffered(options = {}) {
          options.time ||= this.timeToBuffer;
          const files = this.graphFilesUnloaded(options);
          if (!files.length) {
              // console.log(this.constructor.name, "loadPromiseUnlessBuffered no unloaded graph files")
              return;
          }
          const promise = this.preloader.loadFilesPromise(files);
          const removedPromise = promise.then(() => {
              const index = this.loadingPromises.indexOf(promise);
              if (index < 0)
                  throw Errors.internal + "couldn't find promise~";
              this.loadingPromises.splice(index, 1);
          });
          this.loadingPromises.push(promise);
          return removedPromise;
      }
      loop = false;
      get mashes() { return [this]; }
      _paused = true;
      get paused() { return this._paused; }
      set paused(value) {
          const paused = value || !this.frames;
          // console.log(this.constructor.name, "set paused", forcedValue)
          if (this._paused === paused)
              return;
          this._paused = paused;
          if (paused) {
              this.playing = false;
              this.bufferStop();
              if (this._bufferTimer) {
                  clearInterval(this._bufferTimer);
                  delete this._bufferTimer;
              }
              this.composition.stopContext();
              this.emitter?.emit(exports.EventType.Pause);
          }
          else {
              this.composition.startContext();
              this.bufferStart();
              const promise = this.loadPromiseUnlessBuffered({
                  editing: true, audible: true, visible: true
              });
              if (promise)
                  promise.then(() => {
                      this.playing = true;
                  });
              else
                  this.playing = true;
              // console.log("Mash emit", EventType.Play)
              this.emitter?.emit(exports.EventType.Play);
          }
      }
      _playing = false;
      get playing() { return this._playing; }
      set playing(value) {
          // console.trace(this.constructor.name, "set playing", value)
          if (this._playing !== value) {
              this._playing = value;
              if (value) {
                  const { quantize, time } = this;
                  const clips = this.clipsAudibleInTime(this.timeToBuffer);
                  // console.log("playing", value, this.time, clips.length)
                  if (!this.composition.startPlaying(time, clips, quantize)) {
                      // console.log(this.constructor.name, "playing audio not cached on first try", this.time, clips.length)
                      // audio was not cached
                      const currentClips = this.clipsAudibleInTime(this.timeToBuffer);
                      if (!this.composition.startPlaying(time, currentClips, quantize)) {
                          // console.log(this.constructor.name, "playing audio not cached on second try", this.time, currentClips.length)
                          this._playing = false;
                          return;
                      }
                  }
                  this.emitter?.emit(exports.EventType.Playing);
                  this.setDrawInterval();
              }
              else {
                  this.composition.stopPlaying();
                  this.clearDrawInterval();
              }
          }
      }
      _preview;
      preview(options) {
          return this._preview ||= this.previewInitialize(options);
      }
      previewInitialize(options) {
          return new PreviewClass(this.previewArgs(options));
      }
      previewArgs(options = {}) {
          const { editor } = options;
          const clip = editor?.selection.clip;
          const selectedClip = isClip(clip) ? clip : undefined;
          const { drawingTime, time, quantize } = this;
          const svgTime = drawingTime || time;
          const args = {
              selectedClip,
              time: svgTime.scale(quantize),
              mash: this,
              ...options,
          };
          if (isUndefined(options.background))
              args.background = this.color;
          return args;
      }
      putPromise() {
          const { quantize, preloader } = this;
          // make sure we've loaded fonts in order to calculate intrinsic rect
          const files = this.clips.flatMap(clip => {
              const { container } = clip;
              if (isTextContainer(container)) {
                  if (!container.intrinsicsKnown({ editing: true, size: true })) {
                      const args = {
                          editing: true, visible: true, quantize,
                          time: clip.time(quantize), clipTime: clip.timeRange(quantize)
                      };
                      return container.fileUrls(args);
                  }
              }
              return [];
          });
          return preloader.loadFilesPromise(files);
      }
      removeClipFromTrack(clip) {
          const clips = isArray(clip) ? clip : [clip];
          this.emitIfFramesChange(() => {
              clips.forEach(clip => {
                  const track = clip.track;
                  track.removeClips([clip]);
              });
          });
      }
      removeTrack(index) {
          const trackIndex = isPositive(index) ? index : this.tracks.length - 1;
          assertPositive(trackIndex);
          this.emitIfFramesChange(() => { this.tracks.splice(trackIndex, 1); });
          this.emitter?.emit(exports.EventType.Track);
      }
      _rendering = '';
      get rendering() { return this._rendering; }
      set rendering(value) {
          this._rendering = value;
          this.emitter?.emit(exports.EventType.Render);
      }
      restartAfterStop(time, paused, seeking) {
          // console.log(this.constructor.name, "restartAfterStop", time, this.time)
          if (time.equalsTime(this.time)) { // otherwise we must have gotten a seek call
              if (seeking) {
                  delete this.seekTime;
                  this.emitter?.emit(exports.EventType.Seeked);
              }
              this.drawTime(time);
              if (!paused) {
                  // this.composition.startContext()
                  this.playing = true;
              }
          }
      }
      reload() { return this.stopLoadAndDraw(); }
      seekTime;
      seekToTime(time) {
          if (this.seekTime !== time) {
              this.seekTime = time;
              this.emitter?.emit(exports.EventType.Seeking);
              this.emitter?.emit(exports.EventType.Time);
          }
          return this.stopLoadAndDraw(true);
      }
      selectType = exports.SelectType.Mash;
      selectables() {
          const selectables = [this];
          if (this._layer)
              selectables.push(...this.layer.selectables());
          return selectables;
      }
      selectedItems(actions) {
          return this.properties.map(property => {
              const undoValue = this.value(property.name);
              const target = this;
              return {
                  value: undoValue,
                  selectType: exports.SelectType.Mash, property,
                  changeHandler: (property, redoValue) => {
                      assertPopulatedString(property);
                      const options = { property, target, redoValue, undoValue };
                      actions.create(options);
                  }
              };
          });
      }
      setDrawInterval() {
          if (this.drawInterval)
              return;
          this.clearDrawInterval();
          this.drawInterval = setInterval(() => { this.handleDrawInterval(); }, 500 / this.time.fps);
      }
      stopLoadAndDraw(seeking) {
          const { time, paused, playing } = this;
          if (playing)
              this.playing = false;
          const promise = this.loadPromiseUnlessBuffered({
              editing: true, visible: true, audible: playing
          });
          if (promise)
              return promise.then(() => {
                  this.restartAfterStop(time, paused, seeking);
              });
          this.restartAfterStop(time, paused, seeking);
      }
      previewItems(options) {
          return this.preview(options).previewItemsPromise;
      }
      get time() {
          return this.seekTime || this.drawnTime || timeFromArgs(this._frame, this.quantize);
      }
      get timeRange() {
          const { endTime, time } = this;
          const scaled = endTime.scale(time.fps);
          const range = timeRangeFromTime(time, scaled.frame);
          // console.log(this.constructor.name, "timeRange", range, time, endTime)
          return range;
      }
      timeRanges(avType, startTime) {
          // const { time: startTime, graphType, avType } = args
          const time = startTime || this.time;
          const { quantize } = this;
          const start = time.scale(this.quantize, 'floor');
          const end = start.isRange ? start.timeRange.endTime : undefined;
          const fullRangeClips = this.clipsInTimeOfType(time, avType);
          const { length } = fullRangeClips;
          if (!length)
              return [];
          if (length === 1 || !start.isRange || avType === exports.AVType.Audio)
              return [time];
          const frames = new Set();
          fullRangeClips.forEach(clip => {
              frames.add(Math.max(clip.frame, start.frame));
              frames.add(Math.min(clip.frame + clip.frames, end.frame));
          });
          const uniqueFrames = [...frames].sort((a, b) => a - b);
          let frame = uniqueFrames.shift();
          const ranges = uniqueFrames.map(uniqueFrame => {
              const range = timeRangeFromArgs(frame, quantize, uniqueFrame - frame);
              frame = uniqueFrame;
              return range;
          });
          return ranges;
      }
      get timeToBuffer() {
          const { time, quantize, buffer, paused } = this;
          if (paused)
              return timeFromArgs(time.scale(quantize, 'floor').frame, quantize);
          return timeRangeFromTimes(time, timeFromSeconds(buffer + time.seconds, time.fps));
      }
      toJSON() {
          const json = super.toJSON();
          json.tracks = this.tracks;
          if (this._rendering)
              json.rendering = this.rendering;
          return json;
      }
      trackClips(clips, trackIndex) {
          const oneTrack = isPositive(trackIndex);
          if (oneTrack)
              return [[trackIndex, clips]];
          let index = this.tracks.length - clips.length;
          return clips.map(clip => [index++, [clip]]);
      }
      tracks = [];
  }

  const mashInstance = (object = {}) => new MashClass(object);
  const isMashClass = (value) => value instanceof MashClass;
  function assertMashClass(value) {
      if (!isMashClass(value))
          throw new Error("expected MashClass");
  }

  class LayerClass extends PropertiedClass {
      constructor(args) {
          super();
          this.properties.push(propertyInstance({ name: 'label', type: exports.DataType.String }));
          this.propertiesInitialize(args);
      }
      _cast;
      get cast() { return this._cast; }
      set cast(value) { this._cast = value; }
      _id;
      get id() { return this._id ||= idGenerate('layer'); }
      get mashes() { throw Errors.unimplemented + 'mashes'; }
      selectType = exports.SelectType.Layer;
      selectables() { return [this, ...this.cast.selectables()]; }
      selectedItems(actions) {
          return this.properties.map(property => {
              const undoValue = this.value(property.name);
              const target = this;
              return {
                  value: undoValue,
                  selectType: exports.SelectType.Layer, property,
                  changeHandler: (property, redoValue) => {
                      assertPopulatedString(property);
                      const options = { property, target, redoValue, undoValue };
                      actions.create(options);
                  }
              };
          });
      }
      toJSON() {
          const json = super.toJSON();
          json.type = this.type;
          json.triggers = this.triggers;
          return json;
      }
      triggers = [];
      type;
  }

  class LayerFolderClass extends LayerClass {
      constructor(args) {
          super(args);
          // propertiesInitialize doesn't set defaults
          const { label, layers, collapsed } = args;
          if (!label)
              this.label = Default.label;
          this.collapsed = collapsed;
          this.layers = layers;
      }
      collapsed;
      layers;
      get mashes() {
          return this.layers.flatMap(layer => layer.mashes);
      }
      toJSON() {
          const json = super.toJSON();
          json.layers = this.layers;
          json.collapsed = this.collapsed;
          return json;
      }
      type = exports.LayerType.Folder;
  }

  const DirectionLabels = [
      "top",
      "right",
      "bottom",
      "left",
      "top right",
      "bottom right",
      "bottom left",
      "top left",
  ];

  class LayerMashClass extends LayerClass {
      constructor(args) {
          super(args);
          const { mash } = args;
          // console.log("LayerMashClass", this.label, mash.label)
          if (!this.label)
              this.label = mash.label;
          this.mash = mash;
          mash.layer = this;
      }
      get mashes() { return [this.mash]; }
      mash;
      toJSON() {
          const json = super.toJSON();
          json.mash = this.mash;
          return json;
      }
      type = exports.LayerType.Mash;
  }

  const isLayerObject = (value) => {
      return isObject(value) && "type" in value && isLayerType(value.type);
  };
  const isLayerFolderObject = (value) => {
      return isLayerObject(value) && value.type === exports.LayerType.Folder;
  };
  const isLayerMashObject = (value) => {
      return isLayerObject(value) && value.type === exports.LayerType.Mash;
  };

  ({ type: exports.LayerType.Folder, collapsed: false, layers: [] });
  ({ type: exports.LayerType.Mash, mash: {} });
  const layerFolderInstance = (object, cast) => {
      const { preloader } = object;
      object.layers ||= [];
      const args = {
          ...object,
          layers: object.layers.map(layer => layerInstance({ preloader, ...layer }))
      };
      return new LayerFolderClass(args);
  };
  const layerMashInstance = (object, cast) => {
      const { preloader } = object;
      object.mash ||= {};
      const mash = mashInstance({ preloader, ...object.mash });
      const args = {
          ...object,
          mash
      };
      return new LayerMashClass(args);
  };
  const layerInstance = (layerObject, cast) => {
      if (isLayerMashObject(layerObject))
          return layerMashInstance(layerObject);
      if (isLayerFolderObject(layerObject))
          return layerFolderInstance(layerObject);
      throw new Error("expected LayerObject");
  };
  const isLayer = (value) => value instanceof LayerClass;
  function assertLayer(value) {
      if (!isLayer(value))
          throw "expected Layer";
  }
  const isLayerMash = (value) => value instanceof LayerMashClass;
  function assertLayerMash(value) {
      if (!isLayerMash(value))
          throw "expected LayerMash";
  }
  const isLayerFolder = (value) => value instanceof LayerFolderClass;
  function assertLayerFolder(value) {
      if (!isLayerFolder(value))
          throw "expected LayerFolder";
  }

  const CastLayerFolders = (layers) => {
      return layers.flatMap(layer => {
          if (isLayerFolder(layer)) {
              return [layer, ...CastLayerFolders(layer.layers)];
          }
          return [];
      });
  };
  const CastPositionIndex = (index, droppingPosition) => {
      if (droppingPosition === exports.DroppingPosition.After)
          return index + 1;
      return index;
  };
  const CastFindLayerFolder = (layer, layers) => {
      if (layers.includes(layer))
          return;
      const layerFolders = CastLayerFolders(layers);
      return layerFolders.find(layerFolder => layerFolder.layers.includes(layer));
  };
  const CastLayersAndIndex = (layers, layerAndPosition) => {
      const { layer, position = exports.DroppingPosition.At } = layerAndPosition;
      const numeric = isNumber(position);
      const defined = !!layer;
      const folder = defined && isLayerFolder(layer);
      const index = numeric ? position : 0;
      if (!defined || numeric)
          return {
              index: index, layers: folder ? layer.layers : layers
          };
      if (folder && position === exports.DroppingPosition.At)
          return {
              index: 0, layers: layer.layers
          };
      const layerFolder = CastFindLayerFolder(layer, layers);
      if (!layerFolder)
          return { index, layers };
      const { layers: folderLayers } = layerFolder;
      const currentIndex = folderLayers.indexOf(layer);
      if (currentIndex < 0)
          throw new Error(Errors.internal);
      return { layers: folderLayers, index: CastPositionIndex(currentIndex, position) };
  };
  class CastClass extends EditedClass {
      constructor(args) {
          super(args);
          const { createdAt, icon, id, label, definitions, layers, preloader, ...rest } = args;
          this.dataPopulate(rest);
          if (isPopulatedArray(layers))
              this.layers.push(...layers.map(object => this.createLayer(object)));
          this.label ||= Default.cast.label;
      }
      addLayer(layer, layerAndPosition = {}) {
          const { layers, index } = CastLayersAndIndex(this.layers, layerAndPosition);
          layers.splice(index, 0, layer);
      }
      _buffer = Default.cast.buffer;
      get buffer() { return this._buffer; }
      set buffer(value) {
          if (!isAboveZero(value))
              throw Errors.invalid.argument + 'buffer ' + value;
          if (this._buffer !== value) {
              this._buffer = value;
              this.mashes.forEach(mash => { mash.buffer = value; });
          }
      }
      createLayer(layerObject) {
          const { preloader } = this;
          const object = {
              preloader,
              ...layerObject
          };
          const layer = layerInstance(object);
          assertLayer(layer);
          layer.cast = this;
          return layer;
      }
      destroy() {
          this.mashes.forEach(mash => mash.destroy());
      }
      emitterChanged() {
          this.mashes.forEach(mash => mash.emitter = this.emitter);
      }
      editedGraphFiles(args) {
          return this.mashes.flatMap(mash => mash.editedGraphFiles(args));
      }
      get imageSize() { return super.imageSize; }
      set imageSize(value) {
          super.imageSize = value;
          const { imageSize } = this;
          this.mashes.forEach(mash => { mash.imageSize = imageSize; });
      }
      layers = [];
      get layerFolders() {
          return CastLayerFolders(this.layers);
      }
      loadPromise(args) {
          return Promise.all(this.mashes.map(mash => mash.loadPromise(args))).then(EmptyMethod);
      }
      get loading() {
          return this.mashes.some(mash => mash.loading);
      }
      get mashes() { return this.layers.flatMap(layer => layer.mashes); }
      moveLayer(layer, layerAndPosition) {
          const result = this.removeLayer(layer);
          this.addLayer(layer, layerAndPosition);
          return result;
      }
      putPromise() {
          return Promise.all(this.mashes.map(mash => mash.putPromise())).then(EmptyMethod);
      }
      reload() {
          // TODO: reload mashes?
          return;
      }
      removeLayer(layer) {
          const layerFolder = CastFindLayerFolder(layer, this.layers);
          const layers = layerFolder?.layers || this.layers;
          const index = layers.indexOf(layer);
          if (index < 0) {
              console.error("removeLayer", index, layers.length, layer.label, layerFolder?.label);
              throw new Error(Errors.internal);
          }
          layers.splice(index, 1);
          return { position: index, layer: layerFolder };
      }
      selectType = exports.SelectType.Cast;
      selectables() { return [this]; }
      selectedItems(actions) {
          return this.properties.map(property => {
              const undoValue = this.value(property.name);
              const target = this;
              return {
                  value: undoValue,
                  selectType: exports.SelectType.Cast, property,
                  changeHandler: (property, redoValue) => {
                      assertPopulatedString(property);
                      const options = { property, target, redoValue, undoValue };
                      actions.create(options);
                  },
              };
          });
      }
      setValue(value, name, property) {
          super.setValue(value, name, property);
          if (property)
              return;
          switch (name) {
              case 'color': {
                  this.mashes.forEach(mash => mash.setValue(value, name, property));
                  break;
              }
          }
      }
      previewItems(args) {
          const { mashes, imageSize } = this;
          const allSvgs = [];
          const { background = this.color } = args;
          const mashArgs = { ...args, color: '' };
          const element = svgElement(imageSize, svgPolygonElement(imageSize, '', background));
          let promise = Promise.resolve([element]);
          arrayReversed(mashes).forEach((mash) => {
              promise = promise.then(svgs => {
                  allSvgs.push(...svgs);
                  return mash.previewItems(mashArgs);
              });
          });
          return promise.then(svgs => {
              allSvgs.push(...svgs);
              return allSvgs;
          });
      }
      toJSON() {
          const json = super.toJSON();
          json.layers = this.layers;
          return json;
      }
  }

  const castInstance = (object = {}, preloader) => {
      const castArgs = { ...object, preloader };
      return new CastClass(castArgs);
  };
  const isCast = (value) => value instanceof CastClass;
  function assertCast(value) {
      if (!isCast(value))
          throw new Error("expected Cast");
  }

  const isEdited = (value) => {
      return isMash(value) || isCast(value);
  };
  function assertEdited(value) {
      if (!isEdited(value))
          throwError(value, 'Edited');
  }

  class Action {
      constructor(object) {
          const { redoSelection, type, undoSelection } = object;
          this.redoSelection = redoSelection;
          this.type = type;
          this.undoSelection = undoSelection;
      }
      get cast() {
          const { cast } = this.redoSelection;
          if (isCast(cast))
              return cast;
          const { cast: undoCast } = this.undoSelection;
          assertCast(undoCast);
          return undoCast;
      }
      done = false;
      get mash() {
          const { mash } = this.redoSelection;
          if (isMash(mash))
              return mash;
          const { mash: undoMash } = this.undoSelection;
          assertMash(undoMash);
          return undoMash;
      }
      redo() {
          this.redoAction();
          this.done = true;
      }
      redoAction() { throw Errors.unimplemented + 'redoAction'; }
      redoSelection;
      get selection() {
          if (this.done)
              return this.redoSelection;
          return this.undoSelection;
      }
      type;
      undo() {
          this.undoAction();
          this.done = false;
      }
      undoAction() { throw Errors.unimplemented + 'undoAction'; }
      undoSelection;
  }
  const isAction = (value) => value instanceof Action;
  function assertAction(value) {
      if (!isAction(value))
          throw new Error('expected Action');
  }
  const isActionInit = (value) => isAction(value.action);
  const isActionEvent = (value) => {
      return isCustomEvent(value) && value.detail;
  };

  /**
   * @category Action
   */
  class AddTrackAction extends Action {
      constructor(object) {
          super(object);
          const { createTracks } = object;
          this.createTracks = createTracks;
      }
      createTracks;
      redoAction() {
          for (let i = 0; i < this.createTracks; i += 1) {
              this.mash.addTrack();
          }
      }
      undoAction() {
          for (let i = 0; i < this.createTracks; i += 1) {
              this.mash.removeTrack();
          }
      }
  }

  /**
   * @category Action
   */
  class AddClipToTrackAction extends AddTrackAction {
      constructor(object) {
          super(object);
          const { clips, insertIndex, trackIndex, redoFrame, undoFrame } = object;
          this.clips = clips;
          this.insertIndex = insertIndex;
          this.trackIndex = trackIndex;
          this.redoFrame = redoFrame;
          this.undoFrame = undoFrame;
      }
      clips;
      insertIndex;
      trackIndex;
      get track() { return this.mash.tracks[this.trackIndex]; }
      redoAction() {
          super.redoAction();
          const { mash, redoFrame, trackIndex, insertIndex, clips } = this;
          mash.addClipToTrack(clips, trackIndex, insertIndex, redoFrame);
      }
      redoFrame;
      undoAction() {
          const { mash, clips } = this;
          mash.removeClipFromTrack(clips);
          super.undoAction();
      }
      undoFrame;
  }

  /**
   * @category Action
   */
  class AddEffectAction extends Action {
      constructor(object) {
          super(object);
          const { effect, effects, index } = object;
          this.effect = effect;
          this.effects = effects;
          this.index = index;
      }
      effect;
      effects;
      index;
      redoAction() { this.effects.splice(this.index, 0, this.effect); }
      undoAction() { this.effects.splice(this.index, 1); }
  }

  const isChangeActionObject = (value) => {
      return isObject(value) && "target" in value && "property" in value;
  };
  /**
   * @category Action
   */
  class ChangeAction extends Action {
      constructor(object) {
          super(object);
          const { property, redoValue, target, undoValue } = object;
          this.property = property;
          this.redoValue = redoValue;
          this.target = target;
          this.undoValue = undoValue;
      }
      property;
      redoValue;
      target;
      undoValue;
      get redoValueNumeric() { return Number(this.redoValue); }
      get undoValueNumeric() { return Number(this.undoValue); }
      redoAction() {
          this.target.setValue(this.redoValue, this.property);
      }
      undoAction() {
          this.target.setValue(this.undoValue, this.property);
      }
      updateAction(object) {
          // console.log(this.constructor.name, "updateAction", object)
          const { redoValue } = object;
          this.redoValue = redoValue;
          this.redo();
      }
  }
  const isChangeAction = (value) => (value instanceof ChangeAction);
  function assertChangeAction(value) {
      if (!isChangeAction(value))
          throw new Error('expected ChangeAction');
  }

  /**
   * @category Action
   */
  class ChangeFramesAction extends ChangeAction {
      constructor(object) {
          super(object);
      }
      redoAction() {
          this.mash.changeTiming(this.target, this.property, this.redoValueNumeric);
      }
      undoAction() {
          this.mash.changeTiming(this.target, this.property, this.undoValueNumeric);
      }
  }

  /**
   * @category Action
   */
  class MoveClipAction extends AddTrackAction {
      constructor(object) {
          super(object);
          const { clip, insertIndex, redoFrame, trackIndex, undoFrame, undoInsertIndex, undoTrackIndex } = object;
          this.clip = clip;
          this.insertIndex = insertIndex;
          this.redoFrame = redoFrame;
          this.trackIndex = trackIndex;
          this.undoFrame = undoFrame;
          this.undoInsertIndex = undoInsertIndex;
          this.undoTrackIndex = undoTrackIndex;
      }
      clip;
      insertIndex;
      trackIndex;
      undoTrackIndex;
      undoInsertIndex;
      undoFrame;
      redoFrame;
      addClip(trackIndex, insertIndex, frame) {
          this.mash.addClipToTrack(this.clip, trackIndex, insertIndex, frame);
      }
      redoAction() {
          super.redoAction();
          this.addClip(this.trackIndex, this.insertIndex, this.redoFrame);
      }
      undoAction() {
          this.addClip(this.undoTrackIndex, this.undoInsertIndex, this.undoFrame);
          super.undoAction();
      }
  }

  /**
   * @category Action
   */
  class MoveEffectAction extends Action {
      constructor(object) {
          super(object);
          const { effects, redoEffects, undoEffects } = object;
          this.effects = effects;
          this.redoEffects = redoEffects;
          this.undoEffects = undoEffects;
      }
      effects;
      redoEffects;
      redoAction() {
          this.effects.splice(0, this.effects.length, ...this.redoEffects);
      }
      undoAction() {
          this.effects.splice(0, this.effects.length, ...this.undoEffects);
      }
      undoEffects;
  }

  /**
   * @category Action
   */
  class RemoveClipAction extends Action {
      constructor(object) {
          super(object);
          const { clip, index, track } = object;
          this.clip = clip;
          this.index = index;
          this.track = track;
      }
      track;
      clip;
      index;
      get trackIndex() { return this.track.index; }
      redoAction() {
          this.mash.removeClipFromTrack(this.clip);
      }
      undoAction() {
          this.mash.addClipToTrack(this.clip, this.trackIndex, this.index);
      }
  }

  /**
   * @category Action
   */
  class AddLayerAction extends Action {
      constructor(object) {
          super(object);
          const { layerAndPosition } = object;
          if (layerAndPosition)
              this.layerAndPosition = layerAndPosition;
      }
      layerAndPosition;
      get layer() {
          const { layer } = this.redoSelection;
          assertLayer(layer);
          return layer;
      }
      redoAction() { this.cast.addLayer(this.layer, this.layerAndPosition); }
      undoAction() { this.cast.removeLayer(this.layer); }
  }

  /**
   * @category Action
   */
  class RemoveLayerAction extends Action {
      get layer() {
          const { layer } = this.redoSelection;
          assertLayer(layer);
          return layer;
      }
      layerAndPosition;
      redoAction() { this.layerAndPosition = this.cast.removeLayer(this.layer); }
      undoAction() { this.cast.addLayer(this.layer, this.layerAndPosition); }
  }

  /**
   * @category Action
   */
  class MoveLayerAction extends AddLayerAction {
      get layer() {
          const { layer } = this.redoSelection;
          assertLayer(layer);
          return layer;
      }
      undoLayerAndPosition;
      redoAction() { this.undoLayerAndPosition = this.cast.moveLayer(this.layer, this.layerAndPosition); }
      undoAction() { this.cast.moveLayer(this.layer, this.undoLayerAndPosition); }
  }

  /**
   * @category Action
   */
  class ChangeMultipleAction extends ChangeAction {
      constructor(object) {
          const { redoValues, undoValues } = object;
          super(object);
          this.undoValues = undoValues;
          this.redoValues = redoValues;
      }
      redoAction() {
          const { target, redoValues } = this;
          Object.entries(redoValues).forEach(([property, value]) => {
              target.setValue(value, property);
          });
      }
      redoValues;
      undoAction() {
          const { target, undoValues } = this;
          Object.entries(undoValues).forEach(([property, value]) => {
              target.setValue(value, property);
          });
      }
      updateAction(object) {
          const { redoValues } = object;
          this.redoValues = redoValues;
          this.redo();
      }
      undoValues;
  }

  const actionInstance = (object) => {
      const { type } = object;
      if (!isPopulatedString(type))
          throw Errors.type + JSON.stringify(object);
      switch (type) {
          case exports.ActionType.AddClipToTrack: return new AddClipToTrackAction(object);
          case exports.ActionType.AddEffect: return new AddEffectAction(object);
          case exports.ActionType.AddLayer: return new AddLayerAction(object);
          case exports.ActionType.AddTrack: return new AddTrackAction(object);
          case exports.ActionType.Change: return new ChangeAction(object);
          case exports.ActionType.ChangeFrame: return new ChangeFramesAction(object);
          case exports.ActionType.ChangeMultiple: return new ChangeMultipleAction(object);
          case exports.ActionType.MoveClip: return new MoveClipAction(object);
          case exports.ActionType.MoveEffect: return new MoveEffectAction(object);
          case exports.ActionType.MoveLayer: return new MoveLayerAction(object);
          case exports.ActionType.RemoveClip: return new RemoveClipAction(object);
          case exports.ActionType.RemoveLayer: return new RemoveLayerAction(object);
          default: throw Errors.type + type;
      }
  };
  const ActionFactory = {
      createFromObject: actionInstance
  };

  class Actions {
      editor;
      constructor(editor) {
          this.editor = editor;
      }
      add(action) {
          const remove = this.instances.length - (this.index + 1);
          if (isPositive(remove))
              this.instances.splice(this.index + 1, remove);
          this.instances.push(action);
      }
      get canRedo() { return this.index < this.instances.length - 1; }
      get canSave() { return this.canUndo; }
      get canUndo() { return this.index > -1; }
      create(object) {
          const { editor } = this;
          const { undoSelection, redoSelection, type = exports.ActionType.Change, ...rest } = object;
          const clone = {
              ...rest,
              type,
              undoSelection: undoSelection || { ...editor.selection.object },
              redoSelection: redoSelection || { ...editor.selection.object },
          };
          if (isChangeActionObject(object) && this.currentActionLast) {
              const { currentAction } = this;
              if (isChangeAction(currentAction)) {
                  const { target, property } = object;
                  if (currentAction.target === target && currentAction.property === property) {
                      currentAction.updateAction(object);
                      editor.handleAction(currentAction);
                      return;
                  }
              }
          }
          const action = actionInstance(clone);
          this.add(action);
          editor.handleAction(this.redo());
      }
      get currentAction() { return this.instances[this.index]; }
      get currentActionLast() { return this.canUndo && !this.canRedo; }
      destroy() {
          this.index = -1;
          this.instances.splice(0, this.instances.length);
      }
      index = -1;
      instances = [];
      redo() {
          this.index += 1;
          const action = this.currentAction;
          assertAction(action);
          action.redo();
          return action;
      }
      reusableChangeAction(target, property) {
          if (!this.currentActionLast)
              return;
          const action = this.currentAction;
          if (isChangeAction(action) && action.target === target && action.property === property) {
              return action;
          }
      }
      save() {
          this.instances.splice(0, this.index + 1);
          this.index = -1;
      }
      get selection() { return this.editor.selection; }
      undo() {
          const action = this.currentAction;
          assertAction(action);
          this.index -= 1;
          action.undo();
          return action;
      }
  }

  const isCastData = (data) => (isObject(data) && "cast" in data);
  const isMashData = (data) => (isObject(data) && "mash" in data);
  function assertMashData(data, name) {
      if (!isMashData(data))
          throwError(data, 'MashData', name);
  }

  class Emitter extends EventTarget {
      dispatch(type, detail) {
          // console.log(this.constructor.name, "dispatch", type, detail)
          this.dispatchEvent(this.event(type, detail));
      }
      emit(type, detail) {
          if (!this.trapped.has(type)) {
              this.dispatch(type, detail);
              return;
          }
          const listener = this.trapped.get(type);
          // console.log(this.constructor.name, "emit trapped", type, !!listener)
          if (listener)
              listener(this.event(type, detail));
      }
      event(type, detail) {
          const init = detail ? { detail } : undefined;
          return new CustomEvent(type, init);
      }
      trap(type, listener) {
          if (this.trapped.has(type))
              return;
          this.trapped.set(type, listener || null);
      }
      trapped = new Map();
  }

  const isEffect = (value) => {
      return isInstance(value) && value.type === exports.DefinitionType.Effect;
  };
  function assertEffect(value) {
      if (!isEffect(value))
          throw new Error("expected Effect");
  }
  const isEffectDefinition = (value) => {
      return isDefinition(value) && value.type === exports.DefinitionType.Effect;
  };
  // TODO: consider renaming to ClipFilter

  const isFontDefinition = (value) => {
      return isDefinition(value) && value.type === exports.DefinitionType.Font;
  };
  function assertFontDefinition(value) {
      if (!isFontDefinition(value))
          throw new Error("expected FontDefinition");
  }

  class LoaderClass {
      constructor(endpoint) {
          this.endpoint = endpoint || {};
      }
      absoluteUrl(path) { return path; }
      browsing = true;
      cacheGet(graphFile, createIfNeeded) {
          const key = this.key(graphFile);
          const cacheKey = this.cacheKey(graphFile);
          const found = this.loaderCache.get(cacheKey);
          if (found || !createIfNeeded)
              return found;
          const { definition, type } = graphFile;
          const definitions = [];
          if (isDefinition(definition))
              definitions.push(definition);
          const cache = { loaded: false, definitions };
          this.cacheSet(cacheKey, cache);
          cache.promise = this.cachePromise(key, graphFile, cache).then(loaded => {
              cache.loaded = true;
              cache.result = loaded;
              return loaded;
          }).catch(error => {
              // console.log(this.constructor.name, "cacheGet.cachePromise", error, error.constructor.name)
              cache.error = error;
              cache.loaded = true;
              return error;
          });
          return cache;
      }
      cacheKey(graphFile) {
          const { type } = graphFile;
          const key = this.key(graphFile);
          return `${type}:/${key}`;
      }
      cachePromise(key, graphFile, cache) {
          const cacheKey = this.cacheKey(graphFile);
          const loaderFile = {
              loaderPath: cacheKey, urlOrLoaderPath: key, loaderType: graphFile.type
          };
          return this.filePromise(loaderFile);
      }
      cacheSet(graphFile, cache) {
          const key = isString(graphFile) ? graphFile : this.cacheKey(graphFile);
          this.loaderCache.set(key, cache);
      }
      endpoint;
      filePromise(file) {
          throw Errors.unimplemented + 'filePromise';
      }
      flushFilesExcept(fileUrls = []) {
          const retainKeys = fileUrls.map(fileUrl => this.cacheKey(fileUrl));
          const keys = [...this.loaderCache.keys()];
          const removeKeys = keys.filter(key => !retainKeys.includes(key));
          removeKeys.forEach(key => {
              const cache = this.loaderCache.get(key);
              if (cache) {
                  // console.log(this.constructor.name, "flushFilesExcept removing", key)
                  this.loaderCache.delete(key);
              }
          });
      }
      getCache(path) {
          const files = this.parseUrlPath(path);
          const [file] = files;
          // console.log(this.constructor.name, "getCache", path, file)
          assertObject(file);
          return this.loaderCache.get(file.loaderPath);
      }
      getError(graphFile) {
          return this.cacheGet(graphFile)?.error;
      }
      getLoaderCache(file, createIfNeeded, definition) {
          const { loaderPath, loaderType } = file;
          const found = this.loaderCache.get(loaderPath);
          if (found || !createIfNeeded) {
              // if (found) console.log(this.constructor.name, "getLoaderCache FOUND", loaderPath)
              // else console.log(this.constructor.name, "getLoaderCache NOT FOUND", loaderPath)
              return found;
          }
          // console.log(this.constructor.name, "getLoaderCache LOADING", loaderPath)
          const definitions = [];
          if (isDefinition(definition))
              definitions.push(definition);
          const cache = { loaded: false, definitions };
          if (loaderType !== exports.GraphFileType.Svg)
              this.setLoaderCache(loaderPath, cache);
          cache.promise = this.filePromise(file).then(loaded => {
              // console.log(this.constructor.name, "getLoaderCache CACHED", loaderPath, loaded?.constructor.name)
              cache.loaded = true;
              cache.result = loaded;
              return loaded;
          }).catch(error => {
              // console.log(this.constructor.name, "getLoaderCache ERROR", loaderPath, error, error?.constructor.name)
              cache.error = error;
              cache.loaded = true;
              return error;
          });
          return cache;
      }
      imagePromise(url) {
          const image = new Image();
          image.src = url;
          return image.decode().then(() => image);
      }
      info(loaderPath) {
          if (!loaderPath)
              console.trace(this.constructor.name, "info NO loaderPath");
          const files = this.parseUrlPath(loaderPath);
          files.reverse();
          for (const file of files) {
              const cache = this.loaderCache.get(file.urlOrLoaderPath);
              if (!cache)
                  continue;
              const { loadedInfo } = cache;
              if (isPopulatedObject(loadedInfo))
                  return loadedInfo;
          }
      }
      key(graphFile) { throw Errors.unimplemented + 'key'; }
      lastCssUrl(string) {
          const exp = /url\(([^)]+)\)(?!.*\1)/g;
          const matches = string.matchAll(exp);
          const matchesArray = [...matches];
          const url = arrayLast(arrayLast(matchesArray));
          // console.log(this.constructor.name, "lastCssUrl", string, url)
          return url;
      }
      loadFilesPromise(graphFiles) {
          const promises = graphFiles.map(file => this.loadGraphFilePromise(file));
          return Promise.all(promises).then(EmptyMethod);
      }
      loadGraphFilePromise(graphFile) {
          const { type, file, definition } = graphFile;
          const url = `${type}:/${file}`;
          return this.loadPromise(url, definition);
      }
      loadPromise(urlPath, definition) {
          // console.log(this.constructor.name, "loadPromise", urlPath)
          const cache = this.loaderCache.get(urlPath);
          if (cache) {
              const { promise, result, loaded, error } = cache;
              if (loaded || error) {
                  // console.log(this.constructor.name, "loadPromise FOUND", error ? 'ERROR' : 'RESULT', urlPath)
                  return Promise.resolve(result);
              }
              // console.log(this.constructor.name, "loadPromise FOUND PROMISE", urlPath)
              assertObject(promise);
              return promise;
          }
          const files = this.parseUrlPath(urlPath);
          files.reverse();
          // console.log(this.constructor.name, "loadPromise START", files.map(file => file.urlOrLoaderPath))
          const file = files.shift();
          assertObject(file);
          let promise = this.loaderFilePromise(file, definition);
          files.forEach(file => {
              promise = promise.then(() => {
                  return this.loaderFilePromise(file);
              });
          });
          return promise.then(something => {
              // console.log(this.constructor.name, "loadPromise FINISH returning", something?.constructor.name)
              return something;
          });
      }
      loadedFile(graphFile) {
          const file = this.cacheGet(graphFile);
          return !!file?.loaded;
      }
      loaderCache = new Map();
      loaderFilePromise(file, definition) {
          // const { loaderType, options, urlOrLoaderPath, loaderPath } = file
          let cache = this.getLoaderCache(file, true, definition);
          assertObject(cache);
          const { promise, result, loaded, error } = cache;
          if (result && loaded && !error) {
              // console.log(this.constructor.name, "loaderFilePromise RESULT", file.loaderPath, result?.constructor.name)
              return Promise.resolve(result);
          }
          // console.log(this.constructor.name, "loaderFilePromise PROMISE", file.loaderPath)
          assertObject(promise);
          return promise;
      }
      media(urlPath) {
          const cache = this.loaderCache.get(urlPath);
          if (cache) {
              const { result, loaded, error } = cache;
              if (loaded || error)
                  return result;
          }
      }
      parseUrlPath(id) {
          assertPopulatedString(id);
          const urls = urlsAbsolute(id, this.endpoint);
          return urls.map(url => {
              const [loaderType, options, urlOrLoaderPath] = url;
              const loaderPath = `${loaderType}:${options}/${urlOrLoaderPath}`;
              assertLoaderType(loaderType);
              const loaderFile = {
                  loaderPath, urlOrLoaderPath, loaderType, options: urlOptionsObject(options)
              };
              return loaderFile;
          });
      }
      setLoaderCache(path, cache) {
          // console.log(this.constructor.name, 'setLoaderCache', path, cache.result?.constructor.name)
          this.loaderCache.set(path, cache);
      }
      sourceUrl(graphFile) {
          const cache = this.cacheGet(graphFile);
          if (!cache?.loaded)
              return this.key(graphFile);
          const { type } = graphFile;
          const { result } = cache;
          assertObject(result);
          switch (type) {
              case exports.LoadType.Image:
              case exports.LoadType.Video: return result.src;
          }
          return '';
      }
      updateDefinitionDuration(definition, duration, audio) {
          const { duration: definitionDuration } = definition;
          if (!isAboveZero(definitionDuration)) {
              // console.log(this.constructor.name, "updateDefinitionDuration duration", definitionDuration, "=>", duration)
              definition.duration = duration;
          }
          if (audio)
              definition.audio = true;
      }
      updateDefinitionSize(definition, size, alpha) {
          const key = this.browsing ? "previewSize" : "sourceSize";
          const { [key]: definitionSize } = definition;
          if (!sizesEqual(size, definitionSize))
              definition[key] = size;
          definition.alpha ||= alpha;
      }
      updateDefinitionFamily(definition, family) {
          const { family: definitionFamily } = definition;
          if (!definitionFamily)
              definition.family = family;
      }
      updateCache(cache, loadedInfo) {
          cache.loadedInfo ||= {};
          const { definitions, loadedInfo: cachedInfo } = cache;
          const { duration, width, height, audible, family, info, alpha } = loadedInfo;
          const size = { width, height };
          const durating = isAboveZero(duration);
          const sizing = sizeAboveZero(size);
          const informing = isObject(info);
          if (sizing) {
              cachedInfo.width ||= size.width;
              cachedInfo.height ||= size.height;
          }
          if (durating) {
              if (audible)
                  cachedInfo.audible = true;
              cachedInfo.duration ||= duration;
          }
          if (family)
              cachedInfo.family ||= family;
          // console.log(this.constructor.name, "updateCache", loadedInfo, definitions.length)
          definitions.forEach(definition => {
              if (informing && isPreloadableDefinition(definition))
                  definition.info ||= info;
              if (sizing && isUpdatableSizeDefinition(definition)) {
                  this.updateDefinitionSize(definition, size, alpha);
              }
              if (durating && isUpdatableDurationDefinition(definition)) {
                  this.updateDefinitionDuration(definition, duration, audible);
              }
              if (family && isFontDefinition(definition)) {
                  this.updateDefinitionFamily(definition, family);
              }
              // console.log(this.constructor.name, "updateCache", definition.type, definition.label)
          });
      }
      updateLoaderFile(file, info) {
          // console.log(this.constructor.name, "updateLoaderFile", file, info)
          const cache = this.getLoaderCache(file);
          assertObject(cache);
          this.updateCache(cache, info);
      }
      updateDefinitions(graphFile, info) {
          // console.log(this.constructor.name, "updateDefinitions", graphFile.file, info)
          const cache = this.cacheGet(graphFile);
          assertObject(cache);
          this.updateCache(cache, info);
      }
      videoPromise(url) {
          return new Promise((resolve, reject) => {
              const video = this.videoFromUrl(url);
              video.oncanplay = () => {
                  video.oncanplay = null;
                  video.onerror = null;
                  const { videoWidth, clientWidth, videoHeight, clientHeight } = video;
                  const width = videoWidth || clientWidth;
                  const height = videoHeight || clientHeight;
                  video.width = width;
                  video.height = height;
                  // console.log(this.constructor.name, "videoPromise.oncanplay", width, height)
                  resolve(video);
              };
              video.onerror = reject;
              video.autoplay = false;
              // video.requestVideoFrameCallback(() => {})
              video.load();
          });
      }
      videoFromUrl(url) {
          if (!globalThis.document)
              throw 'wrong environment';
          const video = globalThis.document.createElement('video');
          // video.crossOrigin = 'anonymous'
          video.src = url;
          return video;
      }
  }

  class BrowserLoaderClass extends LoaderClass {
      constructor(endpoint) {
          super(endpoint);
          const [canvas, context] = this.canvasContext({ width: 1, height: 1 });
          context.fillRect(0, 0, 1, 1);
          this.svgImagePromise(canvas.toDataURL()).then(() => {
              this.svgImageEmitsLoadEvent = true;
          });
      }
      absoluteUrl(path) {
          return urlForEndpoint(this.endpoint, path);
      }
      arrayBufferPromise(url) {
          // console.log(this.constructor.name, "arrayBufferPromise")
          return fetch(url).then(response => response.arrayBuffer());
      }
      audioBufferPromise(audio) {
          // console.log(this.constructor.name, "audioBufferPromise")
          return AudibleContextInstance.decode(audio);
      }
      audioInfo(buffer) {
          const { duration } = buffer;
          const info = { duration, audible: true };
          return info;
      }
      audioPromise(url) {
          assertPopulatedString(url, 'url');
          const isBlob = url.startsWith('blob:');
          // console.log(this.constructor.name, "audioPromise", isBlob ? 'BLOB' : url)
          const promise = isBlob ? this.blobAudioPromise(url) : this.arrayBufferPromise(url);
          return promise.then(buffer => this.audioBufferPromise(buffer));
      }
      blobAudioPromise(url) {
          // console.log(this.constructor.name, "blobAudioPromise")
          return fetch(url).then(response => response.blob()).then(blob => {
              return new Promise((resolve, reject) => {
                  const reader = new FileReader();
                  reader.onload = () => { resolve(reader.result); };
                  reader.onerror = reject;
                  reader.readAsArrayBuffer(blob);
              });
          });
      }
      svgImageEmitsLoadEvent = false;
      canvas(size) {
          const { width, height } = size;
          const canvas = document.createElement('canvas');
          canvas.height = height;
          canvas.width = width;
          return canvas;
      }
      canvasContext(size) {
          const canvas = this.canvas(size);
          const context = canvas.getContext('2d');
          assertTrue(context);
          return [canvas, context];
      }
      copyVideoPromise(url, options) {
          assertObject(options);
          // console.log(this.constructor.name, "copyVideoPromise", url, options)
          const key = url.split(':').pop();
          assertPopulatedString(key);
          const video = this.seekingVideos.get(key);
          if (video)
              return Promise.resolve(video);
          const promise = this.seekingVideoPromises.get(key);
          if (promise)
              return promise;
          const sourcePromise = this.sourcePromise(url);
          const copyPromise = sourcePromise.then(source => {
              return this.videoPromise(source).then(video => {
                  // console.log(this.constructor.name, "copyVideoPromise.videoPromise", source)
                  const initialSeekPromise = this.seekPromise(key, timeFromSeconds(1), video).then(() => {
                      // console.log(this.constructor.name, "copyVideoPromise.seekPromise", source)
                      this.seekingVideos.set(key, video);
                      return video;
                  });
                  return initialSeekPromise;
              });
          });
          this.seekingVideoPromises.set(key, copyPromise);
          return copyPromise;
      }
      filePromise(file) {
          const { loaderType } = file;
          // console.log(this.constructor.name, "filePromise", loaderType)
          switch (loaderType) {
              case exports.LoadType.Audio: return this.requestAudio(file);
              case exports.LoadType.Font: return this.requestFont(file);
              case exports.LoadType.Image: return this.requestImage(file);
              case exports.LoadType.Video: return this.requestVideo(file);
              case exports.GraphFileType.Svg: return this.requestSvgImage(file);
          }
          throw Errors.invalid.type + loaderType;
      }
      filePromises(files, size) {
          return files.map(file => {
              const { name: label, type: fileType } = file;
              const type = fileType.split('/').shift();
              const error = { label, error: '' };
              if (!isUploadType(type)) {
                  return Promise.resolve({ ...error, error: 'import.type', value: type });
              }
              const id = idGenerateString();
              const idKey = urlPrependProtocol('object', id);
              const url = URL.createObjectURL(file);
              const object = {
                  type, label, url: urlPrependProtocol(type, idKey), source: url, id: idTemporary()
              };
              const isAudio = type === exports.LoadType.Audio;
              const isImage = type === exports.LoadType.Image;
              const hasDuration = isAudio || type === exports.LoadType.Video;
              const hasSize = type === exports.LoadType.Image || type === exports.LoadType.Video;
              const mediaPromise = this.mediaPromise(type, url);
              return mediaPromise.then(media => {
                  const info = this.mediaInfo(media);
                  if (hasDuration) {
                      const { duration } = info;
                      if (!isAboveZero(duration))
                          return {
                              ...error, error: 'import.duration', value: duration
                          };
                      // we can't reliably tell if there is an audio track...
                      // so we assume there is one, and catch problems when it's played 
                      object.audio = true;
                      object.duration = duration;
                      object.audioUrl = hasSize ? urlPrependProtocol('video', idKey) : idKey;
                  }
                  if (hasSize) {
                      const inSize = sizeCopy(info);
                      if (!sizeAboveZero(inSize))
                          return {
                              ...error, error: 'import.size', value: sizeString(inSize)
                          };
                      const previewSize = size ? sizeCover(inSize, size, true) : inSize;
                      const { width, height } = previewSize;
                      object.previewSize = previewSize;
                      if (isImage) {
                          object.icon = urlPrependProtocol('image', idKey, { width, height });
                          object.loadedImage = media;
                      }
                      else {
                          object.icon = urlPrependProtocol('video', idKey, { fps: 10, frame: 10 });
                          object.loadedVideo = media;
                      }
                  }
                  else
                      object.loadedAudio = media;
                  this.loadLocalFile(media, idKey, info);
                  return object;
              });
          });
      }
      fontFamily(url) {
          return url.replaceAll(/[^a-z0-9]/gi, '_');
      }
      imageInfo(size) {
          return sizeCopy(size);
      }
      key(graphFile) {
          const { file, type } = graphFile;
          if (isLoadType(type))
              return urlForEndpoint(this.endpoint, file);
          return file;
      }
      loadLocalFile(media, cacheKey, loadedInfo) {
          const cache = {
              definitions: [], result: media, loadedInfo,
              promise: Promise.resolve(media), loaded: true,
          };
          this.setLoaderCache(cacheKey, cache);
      }
      mediaInfo(media) {
          if (isLoadedVideo(media))
              return this.videoInfo(media);
          if (isLoadedImage(media))
              return this.imageInfo(media);
          return this.audioInfo(media);
      }
      mediaPromise(type, url) {
          assertLoadType(type);
          assertPopulatedString(url, 'url');
          switch (type) {
              case exports.LoadType.Audio: return this.audioPromise(url);
              case exports.LoadType.Image: return this.imagePromise(url);
              case exports.LoadType.Video: return this.videoPromise(url);
          }
          throw Errors.internal;
      }
      requestAudio(file) {
          const { urlOrLoaderPath, options } = file;
          // console.log(this.constructor.name, "requestAudio", urlOrLoaderPath)
          assertPopulatedString(urlOrLoaderPath, 'urlOrLoaderPath');
          const http = urlIsHttp(urlOrLoaderPath);
          const video = http ? false : urlOrLoaderPath.startsWith('video:');
          if (!(http || video))
              return this.loadPromise(urlOrLoaderPath);
          const promise = http ? this.audioPromise(urlOrLoaderPath) : this.requestVideoAudio(file);
          return promise.then(buffer => {
              assertObject(buffer);
              this.updateLoaderFile(file, this.audioInfo(buffer));
              return buffer;
          });
      }
      requestFont(file) {
          const { urlOrLoaderPath: url } = file;
          const bufferPromise = fetch(url).then(response => {
              const type = response.headers.get('content-type');
              // console.log(this.constructor.name, "requestFont.fetch", type)
              if (!isPopulatedString(type) || type.startsWith(exports.LoadType.Font)) {
                  return response.arrayBuffer();
              }
              assertTrue(type.startsWith('text/css'));
              return response.text().then(string => this.arrayBufferPromise(this.lastCssUrl(string)));
          });
          const family = this.fontFamily(url);
          // console.log(this.constructor.name, "requestFont", url)
          const facePromise = bufferPromise.then(buffer => {
              // console.log(this.constructor.name, "requestFont.bufferPromise", url)
              const face = new FontFace(family, buffer);
              return face.load();
          });
          return facePromise.then(face => {
              // console.log(this.constructor.name, "requestFont.facePromise", url)
              const { fonts } = globalThis.document;
              fonts.add(face);
              return fonts.ready.then(() => {
                  // console.log(this.constructor.name, "requestFont.ready", url)
                  const info = { family };
                  this.updateLoaderFile(file, info);
                  return face;
              });
          });
      }
      requestImage(file) {
          const { urlOrLoaderPath } = file;
          if (!urlIsHttp(urlOrLoaderPath))
              return this.requestLoadedImage(file);
          return this.imagePromise(urlOrLoaderPath).then(image => {
              const { width, height } = image;
              // console.log(this.constructor.name, "requestImage.imagePromise", width, height)
              const info = { width, height };
              this.updateLoaderFile(file, info);
              return image;
          });
      }
      requestLoadedImage(file) {
          const { urlOrLoaderPath, options } = file;
          // url is loader path pointing to video or image
          // options might be size 
          // console.log(this.constructor.name, "requestLoadedImage", urlOrLoaderPath, options)
          const promise = this.loadPromise(urlOrLoaderPath);
          const protocol = urlOrLoaderPath.split(':').shift();
          if (!(protocol === exports.LoadType.Video || options))
              return promise;
          return promise.then(videoOrImage => {
              // console.log(this.constructor.name, "requestLoadedImage.loadPromise", urlOrLoaderPath, videoOrImage.constructor.name)
              const inSize = sizeCopy(videoOrImage);
              const size = sizeAboveZero(options) ? sizeCover(inSize, options) : inSize;
              const { width, height } = size;
              const [canvas, context] = this.canvasContext(size);
              context.drawImage(videoOrImage, 0, 0, width, height);
              return this.imagePromise(canvas.toDataURL());
          });
      }
      requestSvgImage(file) {
          const { urlOrLoaderPath, options } = file;
          // console.log(this.constructor.name, "requestSvgImage", urlOrLoaderPath)
          return this.sourcePromise(urlOrLoaderPath).then(src => {
              // console.log(this.constructor.name, "requestSvgImage.sourcePromise", urlOrLoaderPath, src.length)
              const promise = this.svgImagePromise(src);
              if (!options) {
                  // console.log(this.constructor.name, "requestSvgImage.sourcePromise NO OPTIONS", urlOrLoaderPath)
                  return promise;
              }
              return promise.then(item => {
                  // console.log(this.constructor.name, "requestSvgImage.svgImagePromise OPTIONS", urlOrLoaderPath, options)
                  const { lock, ...rest } = options;
                  const lockDefined = isOrientation(lock) ? lock : undefined;
                  // console.log(this.constructor.name, "requestSvgImage.svgImagePromise lock", lockDefined, rest)
                  svgSetDimensionsLock(item, rest, lockDefined);
                  // console.log(this.constructor.name, "requestSvgImage.svgImagePromise returning", item?.constructor.name)
                  return item;
              });
          });
      }
      requestVideo(file) {
          const { urlOrLoaderPath, options } = file;
          // console.log(this.constructor.name, "requestVideo", urlOrLoaderPath, options)
          urlIsObject(urlOrLoaderPath);
          const isHttp = urlIsHttp(urlOrLoaderPath);
          if (options) {
              // console.log(this.constructor.name, "requestVideo with OPTIONS", urlOrLoaderPath, options)
              return this.seekingVideoPromise(urlOrLoaderPath, options);
          }
          else if (isHttp) {
              // console.log(this.constructor.name, "requestVideo HTTP without OPTIONS", urlOrLoaderPath)
              return this.videoPromise(urlOrLoaderPath).then(video => {
                  const info = this.videoInfo(video);
                  this.updateLoaderFile(file, info);
                  return video;
              });
          }
          // console.log(this.constructor.name, "requestVideo LOADING", urlOrLoaderPath, options)
          return this.loadPromise(urlOrLoaderPath);
      }
      requestVideoAudio(file) {
          const { urlOrLoaderPath } = file;
          // console.log(this.constructor.name, "requestVideoAudio", urlOrLoaderPath)
          const videoPromise = this.loadPromise(urlOrLoaderPath);
          const audioPromise = videoPromise.then(video => {
              const { src } = video;
              // console.log(this.constructor.name, "requestVideoAudio.loadPromise", urlOrLoaderPath, src?.slice(0, 10))
              assertPopulatedString(src);
              return this.audioPromise(src);
          });
          return audioPromise;
      }
      seek(definitionTime, video) {
          if (!video)
              throw Errors.internal + 'seek';
          video.currentTime = definitionTime.seconds;
      }
      seekNeeded(definitionTime, video) {
          const { currentTime } = video;
          if (!(currentTime || definitionTime.frame))
              return true;
          const videoTime = timeFromSeconds(currentTime, definitionTime.fps);
          return !videoTime.equalsTime(definitionTime);
      }
      seekPromise(key, definitionTime, video) {
          // console.log(this.constructor.name, "seekPromise", key, definitionTime, video.currentTime)
          const promise = new Promise(resolve => {
              if (!this.seekNeeded(definitionTime, video)) {
                  // console.log(this.constructor.name, "seekPromise seekNeeded false", key, definitionTime, video.currentTime)
                  this.seekingPromises.delete(key);
                  return resolve(video);
              }
              video.onseeked = () => {
                  // console.log(this.constructor.name, "seekPromise.onseeked", key, definitionTime, video.currentTime)
                  video.onseeked = null;
                  this.seekingPromises.delete(key);
                  resolve(video);
              };
              this.seek(definitionTime, video);
          });
          const existing = this.seekingPromises.get(key);
          this.seekingPromises.set(key, promise);
          if (existing)
              return existing.then(() => promise);
          return promise;
      }
      seekingVideoPromise = (url, options) => {
          assertObject(options);
          // console.log(this.constructor.name, "seekingVideoPromise", url, options)
          const key = url.split(':').pop();
          assertPopulatedString(key);
          return this.copyVideoPromise(url, options).then(video => {
              // console.log(this.constructor.name, "seekingVideoPromise.copyVideoPromise", key)
              const { frame = 0, fps } = options;
              assertPositive(frame);
              assertPositive(fps);
              const time = timeFromArgs(frame, fps);
              return this.seekPromise(key, time, video);
          });
      };
      seekingVideoPromises = new Map();
      seekingPromises = new Map();
      seekingVideos = new Map();
      sourcePromise(path) {
          if (urlIsHttp(path))
              return Promise.resolve(path);
          return this.loadPromise(path).then((loaded) => {
              assertObject(loaded);
              const { src } = loaded;
              // console.log(this.constructor.name, "sourcePromise", path, "->", src?.length, src?.slice(0, 20))
              assertPopulatedString(src);
              return src;
          });
      }
      _svgElement;
      get svgElement() { return this._svgElement ||= svgElement(); }
      set svgElement(value) { this._svgElement = value; }
      svgImagePromise(url) {
          return new Promise((resolve, reject) => {
              const element = svgImageElement();
              const completed = () => {
                  element.removeEventListener('error', failed);
                  element.removeEventListener('load', passed);
                  if (!this.svgImageEmitsLoadEvent)
                      this.svgElement.removeChild(element);
              };
              const failed = (error) => {
                  // console.log(this.constructor.name, "loadsSvgImagesInitialize failed", error)
                  completed();
                  reject(error);
              };
              const passed = () => {
                  // console.log(this.constructor.name, "loadsSvgImagesInitialize passed")
                  completed();
                  resolve(element);
              };
              element.addEventListener('error', failed, { once: true });
              element.addEventListener('load', passed, { once: true });
              if (!this.svgImageEmitsLoadEvent)
                  this.svgElement.appendChild(element);
              svgSet(element, url, 'href');
          });
      }
      videoInfo(video) {
          const { duration, videoWidth, clientWidth, videoHeight, clientHeight } = video;
          const width = videoWidth || clientWidth;
          const height = videoHeight || clientHeight;
          const object = video;
          let audible = object.mozHasAudio;
          audible ||= Boolean(object.webkitAudioDecodedByteCount);
          audible ||= Boolean(object.audioTracks?.length);
          if (!audible)
              console.log(Object.values(video));
          const info = { width, height, duration, audible };
          return info;
      }
  }

  class EditorSelectionClass {
      get [exports.SelectType.None]() { return undefined; }
      get [exports.SelectType.Cast]() {
          const { cast } = this._object;
          if (isCast(cast))
              return cast;
      }
      get [exports.SelectType.Clip]() {
          const { clip } = this._object;
          if (isClip(clip))
              return clip;
      }
      get [exports.SelectType.Layer]() {
          const { layer } = this._object;
          if (isLayer(layer))
              return layer;
      }
      get [exports.SelectType.Mash]() {
          const { mash } = this._object;
          if (isMash(mash))
              return mash;
          const { layer } = this;
          if (isLayerMash(layer))
              return layer.mash;
      }
      get [exports.SelectType.Track]() {
          const { clip, track } = this._object;
          if (isTrack(track))
              return track;
          if (isClip(clip))
              return clip.track;
      }
      get [exports.SelectType.Container]() {
          const { clip } = this._object;
          if (isClip(clip))
              return clip.container;
      }
      get [exports.SelectType.Content]() {
          const { clip } = this._object;
          if (isClip(clip))
              return clip.content;
      }
      get [exports.SelectType.Effect]() {
          const { effect } = this._object;
          if (isEffect(effect))
              return effect;
      }
      _editor;
      get editor() { return this._editor; }
      set editor(value) { this._editor = value; }
      _focus = exports.SelectType.Mash;
      get focus() { return this._focus; }
      set focus(value) { this._focus = value; }
      get(selectType) {
          return this[selectType];
      }
      unset(selectType) {
          // console.log(this.constructor.name, "unset", selectType)
          const selectable = this.object[selectType];
          if (!selectable)
              return;
          const selectables = selectable.selectables();
          assertTrue(selectables[0] === selectable);
          selectables.shift();
          this.object = this.selectionFromSelectables(selectables);
      }
      set(selectable) {
          const { selectType } = selectable;
          this.object = { [selectType]: selectable };
      }
      _object = {};
      get object() {
          return Object.fromEntries(SelectTypes.map(selectType => ([selectType, this.get(selectType)])));
      }
      set object(selection) {
          const populated = this.selectionPopulated(selection);
          const { object: originalObject } = this;
          this.clear();
          Object.assign(this._object, populated);
          const { object: newObject } = this;
          // if (SelectTypes.every(type => originalObject[type] === newObject[type])) return
          const { mash: oldMash, cast: oldCast, clip: oldClip } = originalObject;
          const { mash, cast, clip } = newObject;
          if (clip !== oldClip) {
              if (isClip(clip) && isPositive(clip.trackNumber))
                  clip.track.mash.clearPreview();
              if (isClip(oldClip) && isPositive(oldClip.trackNumber))
                  oldClip.track.mash.clearPreview();
          }
          Object.assign(this._object, populated);
          this.editor.eventTarget.emit(exports.EventType.Selection);
          if (cast !== oldCast)
              this.editor.eventTarget.emit(exports.EventType.Cast);
          if (mash !== oldMash) {
              this.editor.eventTarget.emit(exports.EventType.Mash);
              this.editor.eventTarget.emit(exports.EventType.Track);
              this.editor.eventTarget.emit(exports.EventType.Duration);
          }
      }
      clear() {
          SelectTypes.forEach(selectType => { delete this._object[selectType]; });
      }
      selectionFromSelectables(selectables) {
          return Object.fromEntries(selectables.map(selectable => ([selectable.selectType, selectable])));
      }
      selectionPopulated(selection) {
          const { mash: mashOld, object } = this;
          const { cast: castOld } = object;
          const { clip, track, layer, cast, mash, effect } = selection;
          const target = effect || clip || track || mash || layer || cast || castOld || mashOld;
          assertTrue(target, 'target');
          return this.selectionFromSelectables(target.selectables());
      }
      get selectTypes() {
          const selectTypes = [];
          const { mash, object } = this;
          const { clip, track, cast, layer, effect } = object;
          if (cast) {
              selectTypes.push(exports.SelectType.Cast);
              if (layer)
                  selectTypes.push(exports.SelectType.Layer);
          }
          if (!mash)
              return selectTypes;
          if (!cast)
              selectTypes.push(exports.SelectType.Mash);
          if (!track)
              return selectTypes;
          selectTypes.push(exports.SelectType.Track);
          if (!isClip(clip))
              return selectTypes;
          selectTypes.push(exports.SelectType.Clip);
          selectTypes.push(exports.SelectType.Content);
          if (isEffect(effect))
              selectTypes.push(exports.SelectType.Effect);
          if (isPopulatedString(clip.containerId)) {
              selectTypes.push(exports.SelectType.Container);
          }
          return selectTypes;
      }
      selectedItems(types = SelectTypes) {
          const { selectTypes, object: selection } = this;
          const filteredTypes = selectTypes.filter(type => types.includes(type));
          const { clip } = selection;
          // console.log(this.constructor.name, "selectedItems", this.object)
          return filteredTypes.flatMap(type => {
              let target = selection[type];
              if (isClipSelectType(type) && isClip(clip))
                  target = clip[type];
              assertTrue(target, type);
              return target.selectedItems(this.editor.actions);
          });
      }
  }

  const editorSelectionInstance = () => {
      return new EditorSelectionClass();
  };

  const isVideoDefinition = (value) => {
      return isDefinition(value) && value.type === exports.DefinitionType.Video;
  };
  const isVideo = (value) => {
      return isInstance(value) && value.definition.type === exports.DefinitionType.Video;
  };
  function assertVideo(value) {
      if (!isVideo(value))
          throw new Error('expected Video');
  }

  const isImageDefinition = (value) => {
      return isDefinition(value) && value.type === exports.DefinitionType.Image;
  };

  class EditorClass {
      constructor(args) {
          const { autoplay, precision, loop, fps, volume, buffer, endpoint, preloader, editType, readOnly, dimensions, edited, } = args;
          const point = isPoint(dimensions) ? pointCopy(dimensions) : PointZero;
          const size = isSize(dimensions) ? sizeCopy(dimensions) : SizeZero;
          this._rect = { ...point, ...size };
          if (isEditType(editType))
              this._editType = editType;
          if (readOnly)
              this.readOnly = true;
          this.editing = !this.readOnly;
          if (isBoolean(autoplay))
              this.autoplay = autoplay;
          if (isNumber(precision))
              this.precision = precision;
          if (isBoolean(loop))
              this._loop = loop;
          if (isNumber(fps))
              this._fps = fps;
          if (isNumber(volume))
              this._volume = volume;
          if (isNumber(buffer))
              this._buffer = buffer;
          this.actions = new Actions(this);
          this.preloader = preloader || new BrowserLoaderClass(endpoint);
          if (edited)
              this.load(edited);
      }
      actions;
      add(object, editorIndex) {
          const objects = isArray(object) ? object : [object];
          if (!objects.length)
              return Promise.resolve([]);
          const definitions = objects.map(definitionObject => {
              assertPopulatedObject(definitionObject);
              return Defined.fromObject(definitionObject);
          });
          if (!editorIndex)
              return Promise.resolve(definitions);
          const clips = definitions.map(definition => {
              const { id, type } = definition;
              const clipObject = {};
              if (isContentDefinition(definition))
                  clipObject.contentId = id;
              else
                  clipObject.containerId = id;
              if (type === exports.DefinitionType.Audio)
                  clipObject.containerId = '';
              return clipDefault.instanceFromObject(clipObject);
          });
          const options = { editing: true, duration: true };
          const unknownClips = clips.filter(clip => clip.intrinsicsKnown(options));
          const files = unknownClips.flatMap(clip => clip.intrinsicGraphFiles(options));
          const { preloader } = this;
          const promise = preloader.loadFilesPromise(files);
          return promise.then(() => {
              return this.addClip(clips, editorIndex).then(() => definitions);
          });
      }
      addClip(clip, editorIndex) {
          const { clip: frameOrIndex = 0, track: trackIndex = 0 } = editorIndex;
          const clips = isArray(clip) ? clip : [clip];
          const [firstClip] = clips;
          if (!firstClip)
              return Promise.resolve();
          const promise = this.assureMash(clip);
          return promise.then(() => {
              const { mash } = this.selection;
              assertMash(mash);
              const { tracks } = mash;
              const { length } = tracks;
              assertAboveZero(length);
              const trackPositive = isPositive(trackIndex);
              const track = trackPositive ? tracks[trackIndex] : undefined;
              const trackClips = track?.clips || [];
              const dense = track?.dense;
              const redoSelection = {
                  ...this.selection.object, clip: firstClip
              };
              const createTracks = trackPositive ? 0 : clips.length;
              const options = {
                  clips, type: exports.ActionType.AddClipToTrack, trackIndex,
                  redoSelection, createTracks
              };
              if (dense) {
                  const insertIndex = isPositive(frameOrIndex) ? frameOrIndex : trackClips.length;
                  options.insertIndex = insertIndex;
              }
              else {
                  if (createTracks)
                      options.redoFrame = isPositive(frameOrIndex) ? frameOrIndex : 0;
                  else {
                      assertTrack(track);
                      const frame = isPositive(frameOrIndex) ? frameOrIndex : track.frames;
                      options.redoFrame = track.frameForClipNearFrame(firstClip, frame);
                  }
              }
              this.actions.create(options);
              return this.loadMashAndDraw();
          });
      }
      addEffect(effect, insertIndex = 0) {
          // console.log(this.constructor.name, "addEffect", effect.definition.label, insertIndex)
          const { clip } = this.selection;
          if (!isClip(clip)) {
              console.error(this.constructor.name, "addEffect expected effectable selection");
              throw Errors.selection + 'effectable';
          }
          const { content } = clip;
          assertContent(content);
          const { effects } = content;
          if (!effects)
              throw Errors.selection;
          const undoEffects = [...effects];
          const redoEffects = [...effects];
          redoEffects.splice(insertIndex, 0, effect);
          const redoSelection = { ...this.selection.object, effect };
          const options = {
              effects,
              undoEffects,
              redoEffects,
              redoSelection,
              type: exports.ActionType.MoveEffect
          };
          this.actions.create(options);
          return this.loadMashAndDraw();
      }
      addFiles(files, editorIndex) {
          const { preloader, eventTarget, rect } = this;
          let promise = Promise.resolve([]);
          preloader.filePromises(files, rect).forEach(filePromise => {
              promise = promise.then(objects => {
                  const id = idGenerate('activity');
                  const info = { id, type: exports.ActivityType.Analyze };
                  eventTarget.emit(exports.EventType.Active, info);
                  return filePromise.then(definitionOrError => {
                      const activityInfo = { ...info };
                      const { label } = definitionOrError;
                      activityInfo.label = label;
                      if (isDefinitionObject(definitionOrError)) {
                          objects.push(definitionOrError);
                          const { url, type } = definitionOrError;
                          assertPopulatedString(url);
                          // console.log(this.constructor.name, "addFiles.filePromises", url, type)
                          const info = preloader.info(url);
                          assertObject(info);
                          activityInfo.type = exports.ActivityType.Complete;
                          activityInfo.value = info;
                      }
                      else {
                          const { error, value } = definitionOrError;
                          activityInfo.type = exports.ActivityType.Error;
                          activityInfo.error = error;
                          activityInfo.value = value;
                      }
                      eventTarget.emit(exports.EventType.Active, activityInfo);
                      return objects;
                  });
              });
          });
          return promise.then(objects => {
              return this.add(objects, editorIndex).then(definitions => {
                  if (definitions.length) {
                      const definitionTypes = arrayUnique(definitions.map(object => object.type));
                      this.eventTarget.emit(exports.EventType.Added, { definitionTypes });
                  }
                  return definitions;
              });
          });
      }
      addFolder(label, layerAndPosition) {
          const { cast } = this.selection;
          assertCast(cast);
          const layer = cast.createLayer({ type: exports.LayerType.Folder, label });
          assertLayerFolder(layer);
          const redoSelection = { cast, layer };
          const options = {
              type: exports.ActionType.AddLayer, redoSelection, layerAndPosition
          };
          this.actions.create(options);
      }
      addMash(mashAndDefinitions, layerAndPosition) {
          const { cast } = this.selection;
          assertCast(cast);
          const mashObject = mashAndDefinitions?.mashObject || {};
          // console.log(this.constructor.name, "addMash", mashObject)
          const definitionObjects = mashAndDefinitions?.definitionObjects || [];
          Defined.define(...definitionObjects);
          const layerObject = { type: exports.LayerType.Mash, mash: mashObject };
          const layer = cast.createLayer(layerObject);
          assertLayerMash(layer);
          const { mash } = layer;
          this.configureMash(mash);
          const redoSelection = { cast, layer, mash };
          const options = {
              type: exports.ActionType.AddLayer, redoSelection, layerAndPosition
          };
          this.actions.create(options);
      }
      addTrack() {
          const { mash, cast } = this.selection;
          const redoSelection = { mash, cast };
          this.actions.create({
              redoSelection, type: exports.ActionType.AddTrack, createTracks: 1
          });
      }
      assureMash(clip) {
          const { selection, editType } = this;
          const { mash } = selection;
          if (!isMash(mash)) {
              const first = isArray(clip) ? clip[0] : clip;
              const { label } = first.content.definition;
              const mashObject = { label };
              if (editType === exports.EditType.Mash)
                  return this.load({ mash: mashObject });
              this.addMash({ mashObject, definitionObjects: [] });
          }
          return Promise.resolve();
      }
      autoplay = Default.editor.autoplay;
      _buffer = Default.editor.buffer;
      get buffer() { return this._buffer; }
      set buffer(value) {
          const number = Number(value);
          if (this._buffer !== number) {
              this._buffer = number;
              const { edited } = this;
              if (edited)
                  edited.buffer = number;
          }
      }
      can(masherAction) {
          const { selection } = this;
          const { track, clip, mash, layer } = selection;
          switch (masherAction) {
              case exports.MasherAction.Save: return this.actions.canSave;
              case exports.MasherAction.Undo: return this.actions.canUndo;
              case exports.MasherAction.Redo: return this.actions.canRedo;
              case exports.MasherAction.Remove: return !!(clip || track || layer);
              case exports.MasherAction.Render: return !this.actions.canSave && !!(mash?.id && !idIsTemporary(mash.id));
              default: throw Errors.argument + 'can';
          }
      }
      castDestroy() {
          const { cast } = this.selection;
          if (!cast)
              return false;
          cast.destroy();
          this.preloader.flushFilesExcept();
          return true;
      }
      clearActions() {
          if (!this.actions.instances.length)
              return;
          this.actions = new Actions(this);
          this.eventTarget.emit(exports.EventType.Action);
      }
      get clips() { return this.selection.mash.clips; }
      configureCast(cast) {
          this.configureEdited(cast);
          return cast.loadPromise({ editing: true, visible: true }).then(() => {
              this.selection.set(cast);
              this.handleDraw();
          });
      }
      configureEdited(edited) {
          edited.editor = this;
          const { rect } = this;
          if (sizeAboveZero(rect))
              edited.imageSize = sizeCopy(rect);
          edited.emitter = this.eventTarget;
      }
      configureMash(mash) {
          mash.buffer = this.buffer;
          mash.gain = this.gain;
          mash.loop = this.loop;
          this.configureEdited(mash);
          return mash.loadPromise({ editing: true, visible: true }).then(() => {
              this.selection.set(mash);
              this.handleDraw();
          });
      }
      create() { this.load({ [this.editType]: {} }); }
      get currentTime() {
          const { mash } = this.selection;
          if (mash && mash.drawnTime)
              return mash.drawnTime.seconds;
          return 0;
      }
      dataPutRequest() {
          const { edited, editType } = this;
          assertObject(edited);
          assertEditType(editType);
          // set edit's label if it's empty
          const { label } = edited;
          if (!isPopulatedString(label)) {
              const defaultLabel = Default[editType].label;
              assertPopulatedString(defaultLabel, 'defaultLabel');
              edited.setValue(defaultLabel, 'label');
          }
          return edited.putPromise().then(() => {
              if (isMash(edited)) {
                  return {
                      mash: edited.toJSON(),
                      definitionIds: edited.definitionIds
                  };
              }
              if (isCast(edited)) {
                  return {
                      cast: edited.toJSON(),
                      definitionIds: Object.fromEntries(edited.mashes.map(mash => ([mash.id, mash.definitionIds])))
                  };
              }
              throw new Error(Errors.internal);
          });
      }
      define(objectOrArray) {
          const objects = Array.isArray(objectOrArray) ? objectOrArray : [objectOrArray];
          objects.forEach(object => {
              const { id, type } = object;
              assertPopulatedString(id, 'define id');
              if (Defined.fromId(id)) {
                  // redefining...
                  console.warn(this.constructor.name, "define NOT redefining", id);
                  return;
              }
              assertDefinitionType(type);
              const definition = Factory[type].definition(object);
              Defined.install(definition);
          });
      }
      get definitions() {
          const { mashes } = this;
          const ids = [...new Set(mashes.flatMap(mash => mash.definitionIds))];
          const definitions = ids.map(id => Defined.fromId(id));
          return definitions;
      }
      get definitionsUnsaved() {
          const { definitions } = this;
          return definitions.filter(definition => {
              const { type, id } = definition;
              if (!isLoadType(type))
                  return false;
              return idIsTemporary(id);
          });
      }
      destroy() { if (!this.castDestroy())
          this.mashDestroy(); }
      dragging = false;
      drawTimeout;
      get duration() { return this.selection.mash?.duration || 0; }
      _editType;
      get editType() {
          if (!this._editType)
              this._editType = this.editingCast ? exports.EditType.Cast : exports.EditType.Mash;
          return this._editType;
      }
      get edited() { return this.selection.cast || this.selection.mash; }
      editedData;
      editing;
      get editingCast() { return !!this.selection.cast; }
      get endTime() {
          const { mash } = this.selection;
          return mash ? mash.endTime.scale(this.fps, 'floor') : timeFromArgs();
      }
      eventTarget = new Emitter();
      _fps = Default.editor.fps;
      get fps() {
          return this._fps || this.selection.mash?.quantize || Default.editor.fps;
      }
      set fps(value) {
          const number = Number(value);
          // setting to zero means fallback to mash rate
          if (this._fps !== number) {
              this._fps = number;
              this.eventTarget.emit(exports.EventType.Fps);
              this.time = this.time.scale(this.fps);
          }
      }
      get frame() { return this.time.frame; }
      set frame(value) { this.goToTime(timeFromArgs(Number(value), this.fps)); }
      get frames() { return this.endTime.frame; }
      get gain() { return this.muted ? 0.0 : this.volume; }
      goToTime(value) {
          const { fps, time } = this;
          const { frame: currentFrame } = time;
          const goTime = value ? value.scaleToFps(fps) : timeFromArgs(0, fps);
          const { frame: attemptFrame } = goTime;
          const { frame: endFrame } = this.endTime;
          const lastFrame = endFrame - 1;
          const goFrame = lastFrame < 1 ? 0 : Math.min(attemptFrame, lastFrame);
          if (value && currentFrame === goFrame)
              return Promise.resolve();
          const promise = this.selection.mash?.seekToTime(timeFromArgs(goFrame, fps));
          if (promise)
              return promise;
          return Promise.resolve();
      }
      handleAction(action) {
          const { edited } = this;
          assertTrue(edited);
          // console.log(this.constructor.name, "handleAction")
          const { selection } = action;
          const { mash } = selection;
          if (isMash(mash)) {
              mash.clearPreview();
              if (action instanceof ChangeAction) {
                  const { property, target } = action;
                  switch (property) {
                      case "gain": {
                          if (isClip(target)) {
                              mash.composition.adjustClipGain(target, mash.quantize);
                          }
                          break;
                      }
                  }
              }
          }
          this.selection.object = selection;
          const promise = edited.reload() || Promise.resolve();
          promise.then(() => {
              if (!mash)
                  this.handleDraw();
              // console.log(this.constructor.name, "handleAction", type)
              this.eventTarget.emit(exports.EventType.Action, { action });
          });
      }
      handleDraw(event) {
          // console.log(this.constructor.name, "handleDraw")
          if (this.drawTimeout || !this.edited?.loading)
              return;
          this.drawTimeout = setTimeout(() => {
              // console.log(this.constructor.name, "handleDraw drawTimeout")
              this.eventTarget.dispatch(exports.EventType.Draw);
              delete this.drawTimeout;
          }, 10);
      }
      load(data) {
          this.editedData = data;
          // console.log(this.constructor.name, "load", data)
          return this.loadEditedData();
      }
      loadCastData(data = {}) {
          const { cast: castObject = {}, definitions: definitionObjects = [] } = data;
          Defined.undefineAll();
          Defined.define(...definitionObjects);
          this.eventTarget.trap(exports.EventType.Draw, this.handleDraw.bind(this));
          const cast = castInstance(castObject, this.preloader);
          return this.configureCast(cast);
      }
      loadEditedData() {
          const { rect, editedData: data } = this;
          if (!sizeAboveZero(rect)) {
              // console.log(this.constructor.name, "loadEditedData DEFFERING LOAD", rect)
              return Promise.resolve();
          }
          assertObject(data);
          delete this.editedData;
          this.destroy();
          this.paused = true;
          this.clearActions();
          this.selection.clear();
          // console.log(this.constructor.name, "loadEditedData LOADING", rect, data)
          if (isCastData(data))
              return this.loadCastData(data);
          assertMashData(data);
          return this.loadMashData(data).then(() => {
              return this.goToTime().then(() => {
                  const { edited: mash } = this;
                  if (isMash(mash))
                      mash.clearPreview();
                  if (this.autoplay)
                      this.paused = false;
              });
          });
      }
      loadMashAndDraw() {
          const { mash } = this.selection;
          if (!mash)
              throw new Error(Errors.selection);
          const args = { editing: true, visible: true };
          if (!this.paused)
              args.audible = true;
          return mash.loadPromise(args).then(() => { mash.draw(); });
      }
      loadMashData(data = {}) {
          const { mash: mashObject = {}, definitions: definitionObjects = [] } = data;
          // console.log(this.constructor.name, "loadMashData LOADING", mashObject, definitionObjects)
          Defined.undefineAll();
          Defined.define(...definitionObjects);
          const mash = mashInstance({ ...mashObject, preloader: this.preloader });
          this.mashDestroy();
          return this.configureMash(mash);
      }
      _loop = Default.editor.loop;
      get loop() { return this._loop; }
      set loop(value) {
          const boolean = !!value;
          this._loop = boolean;
          const { mash } = this.selection;
          if (mash)
              mash.loop = boolean;
      }
      mashDestroy() {
          const { mash } = this.selection;
          if (!mash)
              return false;
          mash.destroy();
          this.preloader.flushFilesExcept();
          return true;
      }
      get mashes() {
          const { edited } = this;
          if (!edited)
              return [];
          return isCast(edited) ? edited.mashes : [edited];
      }
      move(object, editorIndex = {}) {
          assertPopulatedObject(object, 'clip');
          if (isClip(object)) {
              this.moveClip(object, editorIndex);
              return;
          }
          assertEffect(object);
          const { clip: frameOrIndex = 0 } = editorIndex;
          this.moveEffect(object, frameOrIndex);
      }
      moveClip(clip, editorIndex = {}) {
          assertClip(clip);
          const { clip: frameOrIndex = 0, track: track = 0 } = editorIndex;
          assertPositive(frameOrIndex);
          const { mash } = this.selection;
          assertMash(mash);
          const { tracks } = mash;
          const { trackNumber: undoTrack } = clip;
          const options = {
              clip,
              trackIndex: track,
              undoTrackIndex: undoTrack,
              type: exports.ActionType.MoveClip
          };
          const creating = !isPositive(track);
          if (creating)
              options.createTracks = 1;
          const undoDense = isPositive(undoTrack) && tracks[undoTrack].dense;
          const redoDense = isPositive(track) && tracks[track].dense;
          const currentIndex = creating ? -1 : tracks[track].clips.indexOf(clip);
          if (redoDense)
              options.insertIndex = frameOrIndex;
          if (undoDense) {
              options.undoInsertIndex = currentIndex;
              if (frameOrIndex < currentIndex)
                  options.undoInsertIndex += 1;
          }
          if (!(redoDense && undoDense)) {
              const { frame } = clip;
              const insertFrame = creating ? 0 : tracks[track].frameForClipNearFrame(clip, frameOrIndex);
              const offset = insertFrame - frame;
              if (!offset && track === undoTrack)
                  return; // no change
              options.undoFrame = frame;
              options.redoFrame = frame + offset;
          }
          this.actions.create(options);
      }
      moveEffect(effect, index = 0) {
          // console.log(this.constructor.name, "moveEffect", effect, index)
          if (!isPositive(index))
              throw Errors.argument + 'index';
          const { clip } = this.selection;
          if (!clip)
              throw Errors.selection;
          assertClip(clip);
          const effectable = clip.content;
          assertContent(effectable);
          const { effects } = effectable;
          const undoEffects = [...effects];
          const redoEffects = undoEffects.filter(e => e !== effect);
          const currentIndex = undoEffects.indexOf(effect);
          const insertIndex = currentIndex < index ? index - 1 : index;
          redoEffects.splice(insertIndex, 0, effect);
          const options = {
              effects, undoEffects, redoEffects, type: exports.ActionType.MoveEffect, effectable
          };
          this.actions.create(options);
      }
      moveLayer(layer, layerAndPosition) {
          const { cast } = this.selection;
          assertCast(cast);
          assertLayer(layer);
          const redoSelection = { cast, layer };
          const options = { type: exports.ActionType.MoveLayer, redoSelection, layerAndPosition };
          this.actions.create(options);
      }
      moveTrack() {
          // TODO: create remove track action...
          console.debug(this.constructor.name, "moveTrack coming soon...");
      }
      _muted = false;
      get muted() { return this._muted; }
      set muted(value) {
          const boolean = !!value;
          if (this._muted !== boolean) {
              this._muted = boolean;
              const { mash } = this.selection;
              if (mash)
                  mash.gain = this.gain;
          }
      }
      pause() { this.paused = true; }
      get paused() {
          const { mash } = this.selection;
          return mash ? mash.paused : true;
      }
      set paused(value) {
          const { mash } = this.selection;
          if (mash)
              mash.paused = value;
          // bring back selection
          if (value)
              this.redraw();
      }
      play() { this.paused = false; }
      get position() {
          let per = 0;
          if (this.time.frame) {
              per = this.time.seconds / this.duration;
              if (per !== 1)
                  per = parseFloat(per.toFixed(this.precision));
          }
          return per;
      }
      set position(value) {
          this.goToTime(timeFromSeconds(this.duration * Number(value), this.fps));
      }
      get positionStep() {
          return parseFloat(`0.${"0".repeat(this.precision - 1)}1`);
      }
      precision = Default.editor.precision;
      preloader;
      readOnly = false;
      _rect;
      get rect() { return this._rect; }
      set rect(value) {
          assertSizeAboveZero(value);
          const { editedData, rect } = this;
          // console.log(this.constructor.name, "rect", rect, "=>", value, !!editedData)
          if (rectsEqual(rect, value))
              return;
          this._rect = value;
          const promise = editedData ? this.loadEditedData() : Promise.resolve();
          promise.then(() => {
              const { edited, rect, eventTarget } = this;
              if (!isEdited(edited))
                  return;
              edited.imageSize = sizeCopy(rect);
              eventTarget.emit(exports.EventType.Resize, { rect: value });
              this.redraw();
          });
      }
      redo() { if (this.actions.canRedo)
          this.handleAction(this.actions.redo()); }
      redraw() {
          const { edited } = this;
          if (!edited)
              return;
          edited.mashes.forEach(mash => { mash.clearPreview(); });
          this.eventTarget.dispatch(exports.EventType.Draw);
      }
      removeClip(clip) {
          const { mash } = this.selection;
          if (!mash)
              throw new Error(Errors.selection);
          const { track } = clip;
          const redoSelection = {
              ...this.selection, clip: undefined
          };
          const options = {
              redoSelection,
              clip,
              track,
              index: track.clips.indexOf(clip),
              type: exports.ActionType.RemoveClip
          };
          this.actions.create(options);
      }
      removeEffect(effect) {
          const { clip } = this.selection;
          if (!clip)
              throw Errors.selection;
          assertClip(clip);
          const { content } = clip;
          assertContent(content);
          const { effects } = content;
          const undoEffects = [...effects];
          const redoEffects = effects.filter(other => other !== effect);
          const redoSelection = {
              ...this.selection.object
          };
          delete redoSelection.effect;
          // console.log(this.constructor.name, "removeEffect", redoSelection)
          const options = {
              redoSelection,
              effects,
              undoEffects,
              redoEffects,
              type: exports.ActionType.MoveEffect
          };
          this.actions.create(options);
      }
      removeLayer(layer) {
          const { cast } = this.selection;
          assertCast(cast);
          const redoSelection = { cast, layer };
          this.actions.create({ type: exports.ActionType.RemoveLayer, redoSelection });
      }
      removeTrack(track) {
          // TODO: create remove track action...
          console.debug(this.constructor.name, "removeTrack coming soon...");
      }
      saved(temporaryIdLookup) {
          if (temporaryIdLookup) {
              const { edited } = this;
              assertTrue(edited);
              Object.entries(temporaryIdLookup).forEach(([temporaryId, permanentId]) => {
                  if (edited.id === temporaryId) {
                      edited.id = permanentId;
                      return;
                  }
                  if (Defined.installed(temporaryId)) {
                      Defined.updateDefinitionId(temporaryId, permanentId);
                      return;
                  }
                  assertCast(edited);
                  const mash = edited.mashes.find(mash => mash.id === temporaryId);
                  assertMash(mash);
                  mash.id = permanentId;
              });
          }
          this.actions.save();
          this.eventTarget.emit(exports.EventType.Action);
      }
      _selection;
      get selection() {
          if (this._selection)
              return this._selection;
          const selection = editorSelectionInstance();
          selection.editor = this;
          return this._selection = selection;
      }
      get svgElement() { return this.preloader.svgElement; }
      set svgElement(value) { this.preloader.svgElement = value; }
      previewItems(enabled) {
          const { edited } = this;
          // return an empty element if we haven't loaded anything yet
          if (!edited) {
              // console.log(this.constructor.name, "previewItems NO EDITED", this.rect)
              return Promise.resolve([svgElement(this.rect)]);
          }
          const options = {};
          if (enabled && this.paused)
              options.editor = this;
          // console.log(this.constructor.name, "previewItems", this.rect)
          return edited.previewItems(options);
      }
      get time() { return this.selection.mash?.time || timeFromArgs(0, this.fps); }
      set time(value) { this.goToTime(value); }
      get timeRange() {
          return this.selection.mash?.timeRange || timeRangeFromArgs(0, this.fps);
      }
      undo() {
          const { canUndo } = this.actions;
          if (canUndo)
              this.handleAction(this.actions.undo());
      }
      updateDefinition(definitionObject, definition) {
          const { id: newId, type: newType } = definitionObject;
          const id = definitionObject.id || definition.id;
          assertPopulatedString(id);
          const target = definition || Defined.fromId(newId);
          const { id: oldId, type: oldType } = target;
          const idChanged = oldId !== id;
          const typeChanged = isDefinitionType(newType) && oldType !== newType;
          // console.log(this.constructor.name, "updateDefinition", typeChanged, idChanged, definitionObject)
          if (typeChanged) {
              // support changing a video to a videosequence
              const newDefinition = Factory[newType].definition(definitionObject);
              Defined.updateDefinition(target, newDefinition);
          }
          else if (idChanged) {
              Defined.updateDefinitionId(target.id, id);
              Object.assign(target, definitionObject);
              if (isVideoDefinition(target))
                  delete target.loadedVideo;
              else if (isUpdatableDurationDefinition(target))
                  delete target.loadedAudio;
              else if (isImageDefinition(target))
                  delete target.loadedImage;
          }
          const { edited } = this;
          if (!(edited && (typeChanged || idChanged)))
              return Promise.resolve();
          const tracks = this.mashes.flatMap(mash => mash.tracks);
          const clips = tracks.flatMap(track => track.clips);
          clips.forEach(clip => {
              if (clip.containerId === oldId)
                  clip.setValue(newId, 'containerId');
              if (clip.contentId === oldId)
                  clip.setValue(newId, 'contentId');
          });
          return this.loadMashAndDraw();
      }
      _volume = Default.editor.volume;
      get volume() { return this._volume; }
      set volume(value) {
          const number = Number(value);
          if (this._volume !== number) {
              if (!isPositive(number))
                  throw Errors.invalid.volume;
              this._volume = number;
              if (isAboveZero(number))
                  this.muted = false;
              const { mash } = this.selection;
              if (mash)
                  mash.gain = this.gain;
              this.eventTarget.emit(exports.EventType.Volume);
          }
      }
  }

  exports.editorSingleton = void 0;
  const editorArgs = (options = {}) => {
      return {
          autoplay: Default.editor.autoplay,
          precision: Default.editor.precision,
          loop: Default.editor.loop,
          fps: Default.editor.fps,
          volume: Default.editor.volume,
          buffer: Default.editor.buffer,
          ...options
      };
  };
  const editorInstance = (options = {}) => {
      return exports.editorSingleton = new EditorClass(editorArgs(options));
  };

  const AudioWithTweenable = TweenableMixin(InstanceBase);
  const AudioWithContent = ContentMixin(AudioWithTweenable);
  const AudioWithPreloadable = PreloadableMixin(AudioWithContent);
  const AudioWithUpdatableDuration = UpdatableDurationMixin(AudioWithPreloadable);
  class AudioClass extends AudioWithUpdatableDuration {
      contentPreviewItemPromise(containerRect, time, range, icon) {
          return Promise.resolve(svgPolygonElement(containerRect, '', 'currentColor'));
      }
      mutable() { return true; }
  }

  const AudioDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase);
  const AudioDefinitionWithContent = ContentDefinitionMixin(AudioDefinitionWithTweenable);
  const AudioDefinitionWithPreloadable = PreloadableDefinitionMixin(AudioDefinitionWithContent);
  const AudioDefinitionWithUpdatableDuration = UpdatableDurationDefinitionMixin(AudioDefinitionWithPreloadable);
  class AudioDefinitionClass extends AudioDefinitionWithUpdatableDuration {
      constructor(...args) {
          super(...args);
          const [object] = args;
          const { audioUrl, url } = object;
          if (!audioUrl && url)
              this.audioUrl = url;
      }
      instanceFromObject(object = {}) {
          return new AudioClass(this.instanceArgs(object));
      }
      type = exports.DefinitionType.Audio;
      loadType = exports.LoadType.Audio;
  }

  const audioDefinition = (object) => {
      const { id } = object;
      if (!id)
          throw Errors.id;
      return new AudioDefinitionClass(object);
  };
  const audioDefinitionFromId = (id) => {
      return audioDefinition({ id });
  };
  const audioInstance = (object) => {
      const definition = audioDefinition(object);
      const instance = definition.instanceFromObject(object);
      return instance;
  };
  const audioFromId = (id) => {
      return audioInstance({ id });
  };
  Factories[exports.DefinitionType.Audio] = {
      definition: audioDefinition,
      definitionFromId: audioDefinitionFromId,
      fromId: audioFromId,
      instance: audioInstance,
  };

  const ImageWithTweenable = TweenableMixin(InstanceBase);
  const ImageWithContainer = ContainerMixin(ImageWithTweenable);
  const ImageWithContent = ContentMixin(ImageWithContainer);
  const ImageWithPreloadable = PreloadableMixin(ImageWithContent);
  const ImageWithUpdatableSize = UpdatableSizeMixin(ImageWithPreloadable);
  class ImageClass extends ImageWithUpdatableSize {
      visibleCommandFiles(args) {
          const commandFiles = [];
          const { visible, time, videoRate } = args;
          if (!visible)
              return commandFiles;
          const files = this.fileUrls(args);
          const [file] = files;
          const duration = isTimeRange(time) ? time.lengthSeconds : 0;
          const options = { loop: 1, framerate: videoRate };
          if (duration)
              options.t = duration;
          const { id } = this;
          const commandFile = { ...file, inputId: id, options };
          // console.log(this.constructor.name, "commandFiles", id)
          commandFiles.push(commandFile);
          return commandFiles;
      }
      fileUrls(args) {
          const { visible, editing } = args;
          const files = [];
          if (!visible)
              return files;
          const { definition } = this;
          const { url, source } = definition;
          const file = editing ? url : source;
          assertPopulatedString(file, editing ? 'url' : 'source');
          const graphFile = {
              input: true, type: exports.LoadType.Image, file, definition
          };
          files.push(graphFile);
          return files;
      }
  }

  const ImageDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase);
  const ImageDefinitionWithContainer = ContainerDefinitionMixin(ImageDefinitionWithTweenable);
  const ImageDefinitionWithContent = ContentDefinitionMixin(ImageDefinitionWithContainer);
  const ImageDefinitionWithPreloadable = PreloadableDefinitionMixin(ImageDefinitionWithContent);
  const ImageDefinitionWithUpdatable = UpdatableSizeDefinitionMixin(ImageDefinitionWithPreloadable);
  class ImageDefinitionClass extends ImageDefinitionWithUpdatable {
      constructor(...args) {
          super(...args);
          const [object] = args;
          const { loadedImage } = object;
          if (loadedImage)
              this.loadedImage = loadedImage;
      }
      definitionIcon(loader, size) {
          const superElement = super.definitionIcon(loader, size);
          if (superElement)
              return superElement;
          const { url } = this;
          return this.urlIcon(url, loader, size);
      }
      instanceFromObject(object = {}) {
          return new ImageClass(this.instanceArgs(object));
      }
      loadType = exports.LoadType.Image;
      loadedImage;
      type = exports.DefinitionType.Image;
  }

  const imageDefinition = (object) => {
      const { id } = object;
      assertPopulatedString(id, 'imageDefinition id');
      return new ImageDefinitionClass(object);
  };
  const imageDefinitionFromId = (id) => {
      return imageDefinition({ id });
  };
  const imageInstance = (object) => {
      const definition = imageDefinition(object);
      const instance = definition.instanceFromObject(object);
      return instance;
  };
  const imageFromId = (id) => {
      return imageInstance({ id });
  };
  Factories[exports.DefinitionType.Image] = {
      definition: imageDefinition,
      definitionFromId: imageDefinitionFromId,
      fromId: imageFromId,
      instance: imageInstance,
  };

  const VideoWithTweenable = TweenableMixin(InstanceBase);
  const VideoWithContainer = ContainerMixin(VideoWithTweenable);
  const VideoWithContent = ContentMixin(VideoWithContainer);
  const VideoWithPreloadable = PreloadableMixin(VideoWithContent);
  const VideoWithUpdatableSize = UpdatableSizeMixin(VideoWithPreloadable);
  const VideoWithUpdatableDuration = UpdatableDurationMixin(VideoWithUpdatableSize);
  class VideoClass extends VideoWithUpdatableDuration {
      fileUrls(args) {
          const files = [];
          const { editing, time, audible, visible, icon } = args;
          // console.log(this.constructor.name, "fileUrls", audible, editing, visible)
          const { definition } = this;
          const { url, source } = definition;
          const editingUrl = editing ? url : source;
          assertPopulatedString(editingUrl, editing ? 'url' : 'source');
          if (visible) {
              if (!icon) {
                  const visibleGraphFile = {
                      input: true, type: exports.LoadType.Video, file: editingUrl, definition
                  };
                  files.push(visibleGraphFile);
              }
          }
          if (audible) {
              // const needed = editing ? time.isRange : !visible
              // if (needed) {
              const mutable = definition.duration ? this.mutable() : true;
              if (mutable && !this.muted) {
                  const audioGraphFile = {
                      input: true, type: exports.LoadType.Audio, definition,
                      file: this.definition.urlAudible(editing),
                  };
                  files.push(audioGraphFile);
              }
              // }
          }
          return files;
      }
      _foreignElement;
      get foreignElement() {
          return this._foreignElement ||= this.foreignElementInitialize;
      }
      get foreignElementInitialize() {
          // console.log(this.constructor.name, "foreignElementInitialize")
          return globalThis.document.createElementNS(NamespaceSvg, 'foreignObject');
      }
      iconUrl(size, time, clipTime) {
          const inSize = sizeCopy(this.intrinsicRect(true));
          const coverSize = sizeCover(inSize, size);
          const { width, height } = coverSize;
          const start = this.definitionTime(time, clipTime);
          const { frame } = start;
          const { fps } = clipTime;
          const { definition } = this;
          const { url } = definition;
          const videoUrl = urlPrependProtocol('video', url, { frame, fps });
          return urlPrependProtocol('image', videoUrl, { width, height });
      }
      itemPreviewPromise(rect, time, range) {
          const { clientCanMaskVideo } = VideoClass;
          const { _foreignElement, _loadedVideo } = this;
          const predefined = !!_foreignElement;
          if (predefined || _loadedVideo) {
              // console.log(this.constructor.name, "itemPreviewPromise LOADED")
              this.updateForeignElement(rect, time, range, predefined);
              return Promise.resolve(clientCanMaskVideo ? this.foreignElement : this.loadedVideo);
          }
          return this.loadVideoPromise.then(() => {
              this.updateForeignElement(rect, time, range);
              return clientCanMaskVideo ? this.foreignElement : this.loadedVideo;
          });
      }
      _loadedVideo;
      get loadedVideo() { return this._loadedVideo; }
      get loadVideoPromise() {
          // console.log(this.constructor.name, "loadVideoPromise")
          const { _loadedVideo } = this;
          if (_loadedVideo)
              return Promise.resolve(_loadedVideo);
          const { definition } = this;
          const { loadedVideo } = definition;
          if (loadedVideo) {
              this._loadedVideo = loadedVideo.cloneNode();
              return Promise.resolve(this._loadedVideo);
          }
          const { preloader } = this.clip.track.mash;
          const file = this.intrinsicGraphFile({ editing: true, size: true });
          const { file: url } = file;
          const videoUrl = urlPrependProtocol('video', url);
          return preloader.loadPromise(videoUrl).then((video) => {
              definition.loadedVideo = video;
              return this._loadedVideo = video.cloneNode();
          });
      }
      updateVideo(rect, time, range) {
          const { loadedVideo } = this;
          const { currentTime } = loadedVideo;
          const definitionTime = this.definitionTime(time, range);
          const maxDistance = time.isRange ? 1 : 1.0 / time.fps;
          const { seconds } = definitionTime;
          if (Math.abs(seconds - currentTime) > maxDistance) {
              loadedVideo.currentTime = seconds;
          }
          const { width, height } = rect;
          loadedVideo.width = width;
          loadedVideo.height = height;
          return loadedVideo;
      }
      updateForeignElement(rect, time, range, foreignElementDefined) {
          const { clientCanMaskVideo } = VideoClass;
          if (clientCanMaskVideo) {
              const { foreignElement } = this;
              if (!foreignElementDefined)
                  foreignElement.appendChild(this.loadedVideo);
              svgSetDimensions(foreignElement, rect);
          }
          this.updateVideo(rect, time, range);
      }
      static _clientCanMaskVideo;
      static get clientCanMaskVideo() {
          const { _clientCanMaskVideo } = this;
          if (isBoolean(_clientCanMaskVideo))
              return _clientCanMaskVideo;
          const { navigator } = globalThis;
          const { userAgent } = navigator;
          const safari = userAgent.includes('Safari') && !userAgent.includes('Chrome');
          return this._clientCanMaskVideo = !safari;
      }
  }

  const VideoDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase);
  const VideoDefinitionWithContainer = ContainerDefinitionMixin(VideoDefinitionWithTweenable);
  const VideoDefinitionWithContent = ContentDefinitionMixin(VideoDefinitionWithContainer);
  const VideoDefinitionWithPreloadable = PreloadableDefinitionMixin(VideoDefinitionWithContent);
  const VideoDefinitionWithUpdatableSize = UpdatableSizeDefinitionMixin(VideoDefinitionWithPreloadable);
  const VideoDefinitionWithUpdatableDuration = UpdatableDurationDefinitionMixin(VideoDefinitionWithUpdatableSize);
  class VideoDefinitionClass extends VideoDefinitionWithUpdatableDuration {
      constructor(...args) {
          super(...args);
          const [object] = args;
          const { loadedVideo } = object;
          if (loadedVideo)
              this.loadedVideo = loadedVideo;
          // TODO: support speed
          // this.properties.push(propertyInstance({ name: "speed", type: DataType.Number, value: 1.0 }))
      }
      instanceFromObject(object = {}) {
          return new VideoClass(this.instanceArgs(object));
      }
      loadType = exports.LoadType.Video;
      loadedVideo;
      pattern = '%.jpg';
      toJSON() {
          const object = super.toJSON();
          object.url = this.url;
          if (this.source)
              object.source = this.source;
          return object;
      }
      type = exports.DefinitionType.Video;
  }

  const videoDefinition = (object) => {
      const { id } = object;
      assertPopulatedString(id);
      return new VideoDefinitionClass(object);
  };
  const videoDefinitionFromId = (id) => {
      return videoDefinition({ id });
  };
  const videoInstance = (object) => {
      const definition = videoDefinition(object);
      return definition.instanceFromObject(object);
  };
  const videoFromId = (id) => {
      return videoInstance({ id });
  };
  Factories[exports.DefinitionType.Video] = {
      definition: videoDefinition,
      definitionFromId: videoDefinitionFromId,
      fromId: videoFromId,
      instance: videoInstance,
  };

  const VideoSequenceWithTweenable = TweenableMixin(InstanceBase);
  const VideoSequenceWithContainer = ContainerMixin(VideoSequenceWithTweenable);
  const VideoSequenceWithContent = ContentMixin(VideoSequenceWithContainer);
  const VideoSequenceWithPreloadable = PreloadableMixin(VideoSequenceWithContent);
  const VideoSequenceWithUpdatableSize = UpdatableSizeMixin(VideoSequenceWithPreloadable);
  const VideoSequenceWithUpdatableDuration = UpdatableDurationMixin(VideoSequenceWithUpdatableSize);
  class VideoSequenceClass extends VideoSequenceWithUpdatableDuration {
      visibleCommandFiles(args) {
          const files = super.visibleCommandFiles(args);
          const { streaming, visible } = args;
          if (!(visible && streaming))
              return files;
          files.forEach(file => {
              const { options = {} } = file;
              options.loop = 1;
              options.re = '';
              file.options = options;
          });
          return files;
      }
      fileUrls(args) {
          const { time, clipTime, editing, visible } = args;
          const definitionTime = this.definitionTime(time, clipTime);
          const definitionArgs = { ...args, time: definitionTime };
          const files = super.fileUrls(definitionArgs);
          if (visible) {
              const { definition } = this;
              if (editing) {
                  const frames = definition.framesArray(definitionTime);
                  const files = frames.map(frame => {
                      const graphFile = {
                          type: exports.LoadType.Image, file: definition.urlForFrame(frame),
                          input: true, definition
                      };
                      return graphFile;
                  });
                  files.push(...files);
              }
              else {
                  const graphFile = {
                      type: exports.LoadType.Video, file: definition.source, definition, input: true
                  };
                  files.push(graphFile);
              }
          }
          return files;
      }
      iconUrl(size, time, range) {
          const definitionTime = this.definitionTime(time, range);
          const { definition } = this;
          const frames = definition.framesArray(definitionTime);
          const [frame] = frames;
          return definition.urlForFrame(frame);
      }
      // itemPreviewPromise(rect: Rect, time: Time, range: TimeRange, stretch?: boolean): Promise<SvgItem> {
      //   return this.itemIconPromise(rect, time, range, stretch).then(svgItem => {
      //     return svgItem
      //   })
      // }
      // private itemPromise(time: Time, range: TimeRange, icon?: boolean): Promise<SvgItem> {
      //   const definitionTime = this.definitionTime(time, range)
      //   const { definition } = this
      //   const frames = definition.framesArray(definitionTime)
      //   const [frame] = frames
      //   const url = definition.urlForFrame(frame)
      //   const svgUrl = `svg:/${url}`
      //   const { preloader } = this.clip.track.mash
      //   return preloader.loadPromise(svgUrl, definition)
      // }
      // itemPromise(containerRect: Rect, time: Time, range: TimeRange, stretch?: boolean, icon?: boolean): Promise<SvgItem> {
      //   const { container } = this
      //   const rect = container ? containerRect : this.contentRect(containerRect, time, range)
      //   const lock = stretch ? undefined : Orientation.V
      //   return this.itemPromise(time, range, icon).then(item => {
      //     svgSetDimensionsLock(item, rect, lock)
      //     return item
      //   })
      // }
      speed = 1.0;
      toJSON() {
          const object = super.toJSON();
          if (this.speed !== 1.0)
              object.speed = this.speed;
          return object;
      }
  }

  const VideoSequenceDefinitionWithTweenable = TweenableDefinitionMixin(DefinitionBase);
  const VideoSequenceDefinitionWithContent = ContentDefinitionMixin(VideoSequenceDefinitionWithTweenable);
  const VideoSequenceDefinitionWithPreloadable = PreloadableDefinitionMixin(VideoSequenceDefinitionWithContent);
  const VideoSequenceDefinitionWithUpdatableSize = UpdatableSizeDefinitionMixin(VideoSequenceDefinitionWithPreloadable);
  const VideoSequenceDefinitionWithUpdatableDuration = UpdatableDurationDefinitionMixin(VideoSequenceDefinitionWithUpdatableSize);
  class VideoSequenceDefinitionClass extends VideoSequenceDefinitionWithUpdatableDuration {
      constructor(...args) {
          super(...args);
          const [object] = args;
          const { padding, begin, fps, increment, pattern } = object;
          if (isPositive(begin))
              this.begin = begin;
          if (fps)
              this.fps = fps;
          if (increment)
              this.increment = increment;
          if (pattern)
              this.pattern = pattern;
          if (padding)
              this.padding = padding;
          else {
              const lastFrame = this.begin + (this.increment * this.framesMax - this.begin);
              this.padding = String(lastFrame).length;
          }
          // TODO: support speed
          // this.properties.push(propertyInstance({ name: "speed", type: DataType.Number, value: 1.0 }))
      }
      begin = Default.definition.videosequence.begin;
      fps = Default.definition.videosequence.fps;
      framesArray(start) {
          const { duration, fps } = this;
          return start.durationFrames(duration, fps);
          // const frames : number[] = []
          // const startFrame = Math.min(framesMax, start.scale(fps, "floor").frame)
          // if (start.isRange) {
          //   const endFrame = Math.min(framesMax + 1, start.timeRange.endTime.scale(fps, "ceil").frame)
          //   for (let frame = startFrame; frame < endFrame; frame += 1) {
          //     frames.push(frame)
          //   }
          // } else frames.push(startFrame)
          // // console.log(this.constructor.name, "framesArray", start, fps, framesMax, frames)
          // return frames
      }
      get framesMax() {
          const { fps, duration } = this;
          // console.log(this.constructor.name, "framesMax", fps, duration)
          return Math.floor(fps * duration) - 2;
      }
      increment = Default.definition.videosequence.increment;
      instanceFromObject(object = {}) {
          return new VideoSequenceClass(this.instanceArgs(object));
      }
      loadType = exports.LoadType.Image;
      padding;
      pattern = '%.jpg';
      toJSON() {
          const json = super.toJSON();
          const { videosequence } = Default.definition;
          const { pattern, increment, begin, fps, padding } = this;
          if (pattern !== videosequence.pattern)
              json.pattern = pattern;
          if (increment !== videosequence.increment)
              json.increment = increment;
          if (begin !== videosequence.begin)
              json.begin = begin;
          if (fps !== videosequence.fps)
              json.fps = fps;
          if (padding !== videosequence.padding)
              json.padding = padding;
          return json;
      }
      type = exports.DefinitionType.VideoSequence;
      urlForFrame(frame) {
          const { increment, begin, padding, url, pattern } = this;
          // console.log(this.constructor.name, "urlForFrame", frame, increment, begin, padding, url, pattern )
          let s = String((frame * increment) + begin);
          if (padding)
              s = s.padStart(padding, '0');
          return (url + pattern).replaceAll('%', s);
      }
  }

  const videoSequenceDefinition = (object) => {
      const { id } = object;
      assertPopulatedString(id);
      return new VideoSequenceDefinitionClass(object);
  };
  const videoSequenceDefinitionFromId = (id) => {
      return videoSequenceDefinition({ id });
  };
  const videoSequenceInstance = (object) => {
      const definition = videoSequenceDefinition(object);
      return definition.instanceFromObject(object);
  };
  const videoSequenceFromId = (id) => {
      return videoSequenceInstance({ id });
  };
  Factories[exports.DefinitionType.VideoSequence] = {
      definition: videoSequenceDefinition,
      definitionFromId: videoSequenceDefinitionFromId,
      fromId: videoSequenceFromId,
      instance: videoSequenceInstance,
  };

  class RenderingOutputClass {
      args;
      constructor(args) {
          this.args = args;
          // console.log(this.constructor.name, "upload", this.args.upload)
      }
      assureClipFrames() {
          const { durationClips, args } = this;
          const { quantize } = args.mash;
          durationClips.forEach(clip => {
              const { content } = clip;
              const { definition } = content;
              if (isUpdatableDurationDefinition(definition)) {
                  const frames = definition.frames(quantize);
                  // console.log(this.constructor.name, "assureClipFrames", clip.label, frames, definition.duration)
                  if (frames)
                      clip.frames = frames;
              }
          });
      }
      _avType = exports.AVType.Both;
      get avType() { return this._avType; }
      get avTypeNeededForClips() {
          const { avType } = this;
          if (avType !== exports.AVType.Both)
              return avType;
          const { renderingClips } = this;
          const types = new Set();
          renderingClips.forEach(renderingClip => {
              if (renderingClip.audible)
                  types.add(exports.AVType.Audio);
              if (renderingClip.visible)
                  types.add(exports.AVType.Video);
          });
          // console.log(this.constructor.name, "avTypeNeededForClips", types)
          if (types.size === 2)
              return avType;
          const [type] = types;
          return type;
      }
      get commandOutput() { return this.args.commandOutput; }
      get duration() { return this.timeRange.lengthSeconds; }
      _durationClips;
      get durationClips() { return this._durationClips ||= this.durationClipsInitialize; }
      get durationClipsInitialize() {
          const { mash } = this.args;
          const { frames } = mash;
          if (isPositive(frames))
              return [];
          const { clips } = mash;
          const options = { duration: true };
          const zeroClips = clips.filter(clip => !clip.intrinsicsKnown(options));
          return zeroClips;
      }
      get endTime() {
          return this.args.endTime || this.args.mash.endTime;
      }
      // private _filterGraphs?: FilterGraphsthis._filterGraphs =
      get filterGraphs() {
          const { filterGraphsOptions } = this;
          // console.log(this.constructor.name, "filterGraphs", filterGraphsOptions.upload)
          return this.args.mash.filterGraphs(filterGraphsOptions);
      }
      get filterGraphsOptions() {
          const { timeRange: time, graphType, videoRate, args } = this;
          const { upload } = args;
          const size = this.sizeCovered();
          const filterGraphsOptions = {
              time, graphType, videoRate, size,
              avType: this.avTypeNeededForClips, upload
          };
          // console.log(this.constructor.name, "filterGraphsOptions upload", upload, filterGraphsOptions.upload)
          return filterGraphsOptions;
      }
      graphType = exports.GraphType.Mash;
      get mashDurationPromise() {
          const clips = this.durationClips;
          if (!clips.length) {
              // console.log(this.constructor.name, "mashDurationPromise no durationClips")
              return Promise.resolve();
          }
          const { mash } = this.args;
          const options = { duration: true };
          const files = clips.flatMap(clip => clip.intrinsicGraphFiles(options));
          const { preloader } = mash;
          // console.log(this.constructor.name, "mashDurationPromise files", files.map(f => f.file))
          return preloader.loadFilesPromise(files);
      }
      get mashSize() {
          const { visibleGraphFiles: graphFiles } = this;
          const definitions = graphFiles.map(graphFile => graphFile.definition);
          const updatable = definitions.filter(def => isUpdatableSizeDefinition(def));
          const set = new Set(updatable);
          const unique = [...set];
          const sized = unique.filter(definition => definition.sourceSize);
          if (!sized.length)
              return;
          const sizes = sized.map(definition => definition.sourceSize);
          return {
              width: Math.max(...sizes.map(size => size.width)),
              height: Math.max(...sizes.map(size => size.height))
          };
      }
      get outputCover() { return !!this.args.commandOutput.cover; }
      get outputSize() {
          const { width, height } = this.args.commandOutput;
          if (!(width && height)) {
              if (this.avType === exports.AVType.Audio)
                  return { width: 0, height: 0 };
              // console.error(this.constructor.name, "outputSize", this.args.commandOutput)
              throw Errors.invalid.size + this.outputType + '.outputSize for avType ' + this.avType;
          }
          return { width, height };
      }
      outputType;
      get preloadPromise() {
          // console.log(this.constructor.name, "preloadPromise")
          return this.filterGraphs.loadPromise;
      }
      get renderingClips() {
          return this.args.mash.clipsInTimeOfType(this.timeRange, this.avType);
      }
      renderingDescriptionPromise(renderingResults) {
          // console.log(this.constructor.name, "renderingDescriptionPromise")
          let promise = this.mashDurationPromise;
          promise = promise.then(() => {
              this.assureClipFrames();
          });
          promise = promise.then(() => {
              // console.log(this.constructor.name, "renderingDescriptionPromise mashDurationPromise done")
              return this.sizePromise;
          });
          promise = promise.then(() => {
              // console.log(this.constructor.name, "renderingDescriptionPromise sizePromise")
              return this.preloadPromise;
          });
          return promise.then(() => {
              // console.log(this.constructor.name, "renderingDescriptionPromise preloadPromise calling done, calling assureClipFrames")
              this.assureClipFrames();
              const { commandOutput } = this;
              const renderingDescription = { commandOutput };
              const avType = this.avTypeNeededForClips;
              const { filterGraphs } = this;
              // console.log(this.constructor.name, "renderingDescriptionPromise avType", avType)
              if (avType !== exports.AVType.Audio) {
                  const { filterGraphsVisible } = filterGraphs;
                  const visibleCommandDescriptions = filterGraphsVisible.map(filterGraph => {
                      const { commandInputs: inputs, commandFilters, duration } = filterGraph;
                      const commandDescription = { inputs, commandFilters, duration, avType: exports.AVType.Video };
                      // console.log(this.constructor.name, "renderingDescriptionPromise inputs, commandFilters", inputs, commandFilters)
                      return commandDescription;
                  });
                  renderingDescription.visibleCommandDescriptions = visibleCommandDescriptions;
              }
              if (avType !== exports.AVType.Video) {
                  const { filterGraphAudible, duration } = filterGraphs;
                  if (filterGraphAudible) {
                      const { commandFilters, commandInputs: inputs } = filterGraphAudible;
                      const commandDescription = {
                          inputs, commandFilters, duration, avType: exports.AVType.Audio
                      };
                      renderingDescription.audibleCommandDescription = commandDescription;
                  }
              }
              return renderingDescription;
          });
      }
      // get renderingDescription(): RenderingDescription {
      //   const { commandOutput } = this
      //   const renderingDescription: RenderingDescription = { commandOutput }
      //   const avType = this.avTypeNeededForClips
      //   const { filterGraphs } = this
      //   // console.log(this.constructor.name, "renderingDescriptionPromise avType", avType)
      //   if (avType !== AVType.Audio) {
      //     const { filterGraphsVisible } = filterGraphs
      //     const visibleCommandDescriptions = filterGraphsVisible.map(filterGraph => {
      //       const { commandFilters, commandInputs: inputs, duration } = filterGraph
      //       const commandDescription: CommandDescription = { inputs, commandFilters, duration, avType: AVType.Video }
      //     // console.log(this.constructor.name, "renderingDescriptionPromise inputs, commandFilters", inputs, commandFilters)
      //       return commandDescription
      //     })
      //     renderingDescription.visibleCommandDescriptions = visibleCommandDescriptions
      //   }
      //   if (avType !== AVType.Video) {
      //     const { filterGraphAudible, duration } = filterGraphs
      //     if (filterGraphAudible) {
      //       const { commandFilters, commandInputs: inputs } = filterGraphAudible
      //       const commandDescription: CommandDescription = {
      //         inputs, commandFilters, duration, avType: AVType.Audio
      //       }
      //       renderingDescription.audibleCommandDescription = commandDescription
      //     }
      //   }
      //   return renderingDescription
      // }
      get startTime() {
          if (this.args.startTime)
              return this.args.startTime;
          const { quantize, frame } = this.args.mash;
          return timeFromArgs(frame, quantize);
      }
      sizeCovered() {
          const { outputSize, outputCover } = this;
          if (!outputCover) {
              // console.log(this.constructor.name, "sizeCovered mashSize false outputCover", outputSize)
              return outputSize;
          }
          const { mashSize } = this;
          if (!isSize(mashSize)) {
              // console.log(this.constructor.name, "sizeCovered mashSize false outputSize", outputSize)
              return outputSize; // mash doesn't care about size
          }
          const { width, height } = mashSize;
          assertAboveZero(width);
          assertAboveZero(height);
          return sizeCover(mashSize, outputSize);
      }
      get sizePromise() {
          // console.log(this.constructor.name, "sizePromise")
          if (this.avType === exports.AVType.Audio || !this.outputCover)
              return Promise.resolve();
          const { visibleGraphFiles } = this;
          // console.log(this.constructor.name, "sizePromise", visibleGraphFiles.length, "visibleGraphFile(s)")
          if (!visibleGraphFiles.length)
              return Promise.resolve();
          const { preloader } = this.args.mash;
          return preloader.loadFilesPromise(visibleGraphFiles);
      }
      get timeRange() { return timeRangeFromTimes(this.startTime, this.endTime); }
      get videoRate() { return this.args.commandOutput.videoRate || 0; }
      get visibleGraphFiles() {
          const { timeRange: time, args } = this;
          const { mash } = args;
          const clips = mash.clipsInTimeOfType(time, exports.AVType.Video);
          const options = { size: true };
          const unknownClips = clips.filter(clip => !clip.intrinsicsKnown(options));
          const files = unknownClips.flatMap(clip => clip.intrinsicGraphFiles(options));
          return files;
      }
  }

  class AudioOutputClass extends RenderingOutputClass {
      _avType = exports.AVType.Audio;
      outputType = exports.OutputType.Audio;
  }

  const options$8 = {
  };
  const audioBitrate$5 = 160;
  const audioCodec$5 = "libmp3lame";
  const audioChannels$5 = 2;
  const audioRate$5 = 44100;
  const extension$8 = "mp3";
  const outputType$5 = "audio";
  var outputDefaultAudioJson = {
    options: options$8,
    audioBitrate: audioBitrate$5,
    audioCodec: audioCodec$5,
    audioChannels: audioChannels$5,
    audioRate: audioRate$5,
    extension: extension$8,
    outputType: outputType$5
  };

  const options$7 = {
  };
  const width$7 = 320;
  const height$7 = 240;
  const extension$7 = "jpg";
  const outputType$4 = "image";
  const cover$3 = true;
  const offset$1 = 0;
  var outputDefaultImageJson = {
    options: options$7,
    width: width$7,
    height: height$7,
    extension: extension$7,
    outputType: outputType$4,
    cover: cover$3,
    offset: offset$1
  };

  const options$6 = {
  };
  const width$6 = 320;
  const height$6 = 240;
  const extension$6 = "png";
  const outputType$3 = "image";
  const format$5 = "image2";
  const cover$2 = true;
  const offset = 0;
  var outputDefaultImagePngJson = {
    options: options$6,
    width: width$6,
    height: height$6,
    extension: extension$6,
    outputType: outputType$3,
    format: format$5,
    cover: cover$2,
    offset: offset
  };

  const options$5 = {
    g: 60,
    level: 41,
    movflags: "faststart"
  };
  const width$5 = 1920;
  const height$5 = 1080;
  const videoRate$4 = 30;
  const videoBitrate$3 = 2000;
  const audioBitrate$4 = 160;
  const audioCodec$4 = "aac";
  const videoCodec$3 = "libx264";
  const audioChannels$4 = 2;
  const audioRate$4 = 44100;
  const g = 0;
  const format$4 = "mp4";
  const extension$5 = "mp4";
  const outputType$2 = "video";
  const cover$1 = false;
  var outputDefaultVideoJson = {
    options: options$5,
    width: width$5,
    height: height$5,
    videoRate: videoRate$4,
    videoBitrate: videoBitrate$3,
    audioBitrate: audioBitrate$4,
    audioCodec: audioCodec$4,
    videoCodec: videoCodec$3,
    audioChannels: audioChannels$4,
    audioRate: audioRate$4,
    g: g,
    format: format$4,
    extension: extension$5,
    outputType: outputType$2,
    cover: cover$1
  };

  const options$4 = {
  };
  const format$3 = "image2";
  const width$4 = 320;
  const height$4 = 240;
  const videoRate$3 = 10;
  const extension$4 = "jpg";
  const outputType$1 = "imagesequence";
  const cover = false;
  var outputDefaultImageSequenceJson = {
    options: options$4,
    format: format$3,
    width: width$4,
    height: height$4,
    videoRate: videoRate$3,
    extension: extension$4,
    outputType: outputType$1,
    cover: cover
  };

  const options$3 = {
  };
  const width$3 = 320;
  const height$3 = 240;
  const forecolor = "#000000";
  const backcolor = "#00000000";
  const audioBitrate$3 = 160;
  const audioCodec$3 = "aac";
  const audioChannels$3 = 2;
  const audioRate$3 = 44100;
  const extension$3 = "png";
  const outputType = "waveform";
  var outputDefaultWaveformJson = {
    options: options$3,
    width: width$3,
    height: height$3,
    forecolor: forecolor,
    backcolor: backcolor,
    audioBitrate: audioBitrate$3,
    audioCodec: audioCodec$3,
    audioChannels: audioChannels$3,
    audioRate: audioRate$3,
    extension: extension$3,
    outputType: outputType
  };

  const width$2 = 320;
  const height$2 = 240;
  const videoRate$2 = 30;
  const videoBitrate$2 = 2000;
  const audioBitrate$2 = 160;
  const audioCodec$2 = "aac";
  const videoCodec$2 = "libx264";
  const audioChannels$2 = 2;
  const audioRate$2 = 44100;
  const format$2 = "mdash";
  const extension$2 = "dash";
  const streamingFormat$2 = "mdash";
  const options$2 = {
    hls_delete_threshold: 10,
    g: 60
  };
  var outputDefaultDashJson = {
    width: width$2,
    height: height$2,
    videoRate: videoRate$2,
    videoBitrate: videoBitrate$2,
    audioBitrate: audioBitrate$2,
    audioCodec: audioCodec$2,
    videoCodec: videoCodec$2,
    audioChannels: audioChannels$2,
    audioRate: audioRate$2,
    format: format$2,
    extension: extension$2,
    streamingFormat: streamingFormat$2,
    options: options$2
  };

  const width$1 = 320;
  const height$1 = 240;
  const videoRate$1 = 30;
  const videoBitrate$1 = 2000;
  const audioBitrate$1 = 160;
  const audioCodec$1 = "aac";
  const videoCodec$1 = "libx264";
  const audioChannels$1 = 2;
  const audioRate$1 = 44100;
  const format$1 = "hls";
  const extension$1 = "m3u8";
  const streamingFormat$1 = "hls";
  const options$1 = {
    hls_segment_filename: "%06d.ts",
    hls_time: 6,
    hls_list_size: 10,
    hls_flags: "delete_segments",
    hls_delete_threshold: 10,
    g: 60
  };
  var outputDefaultHlsJson = {
    width: width$1,
    height: height$1,
    videoRate: videoRate$1,
    videoBitrate: videoBitrate$1,
    audioBitrate: audioBitrate$1,
    audioCodec: audioCodec$1,
    videoCodec: videoCodec$1,
    audioChannels: audioChannels$1,
    audioRate: audioRate$1,
    format: format$1,
    extension: extension$1,
    streamingFormat: streamingFormat$1,
    options: options$1
  };

  const width = 320;
  const height = 240;
  const videoRate = 30;
  const videoBitrate = 2000;
  const audioBitrate = 160;
  const audioCodec = "aac";
  const videoCodec = "libx264";
  const audioChannels = 2;
  const audioRate = 44100;
  const format = "flv";
  const extension = "flv";
  const streamingFormat = "rtmp";
  const options = {
    g: 60
  };
  var outputDefaultRtmpJson = {
    width: width,
    height: height,
    videoRate: videoRate,
    videoBitrate: videoBitrate,
    audioBitrate: audioBitrate,
    audioCodec: audioCodec,
    videoCodec: videoCodec,
    audioChannels: audioChannels,
    audioRate: audioRate,
    format: format,
    extension: extension,
    streamingFormat: streamingFormat,
    options: options
  };

  const outputDefaultAudio = (overrides) => {
      const object = overrides || {};
      const commandOutput = outputDefaultAudioJson;
      return { ...commandOutput, ...object };
  };
  const outputDefaultVideo = (overrides) => {
      const object = overrides || {};
      const commandOutput = outputDefaultVideoJson;
      return { ...commandOutput, ...object };
  };
  const outputDefaultImageSequence = (overrides) => {
      const object = overrides || {};
      const commandOutput = outputDefaultImageSequenceJson;
      return { ...commandOutput, ...object };
  };
  const outputDefaultWaveform = (overrides) => {
      const object = overrides || {};
      const commandOutput = outputDefaultWaveformJson;
      return { ...commandOutput, ...object };
  };
  const outputDefaultPng = (overrides) => {
      const object = overrides || {};
      const commandOutput = outputDefaultImagePngJson;
      return { ...commandOutput, ...object };
  };
  const outputDefaultImage = (overrides) => {
      const object = overrides || {};
      const commandOutput = outputDefaultImageJson;
      return { ...commandOutput, ...object };
  };
  const outputDefaultPopulate = (overrides) => {
      const { outputType } = overrides;
      switch (outputType) {
          case exports.OutputType.Audio: return outputDefaultAudio(overrides);
          case exports.OutputType.Image: return outputDefaultImage(overrides);
          case exports.OutputType.Video: return outputDefaultVideo(overrides);
          case exports.OutputType.ImageSequence: return outputDefaultImageSequence(overrides);
          case exports.OutputType.Waveform: return outputDefaultWaveform(overrides);
      }
  };
  const outputDefaultRendering = (outputType, overrides) => {
      return outputDefaultPopulate({ ...overrides, outputType });
  };
  const outputDefaultTypeByFormat = {
      [exports.OutputFormat.AudioConcat]: exports.OutputType.Audio,
      [exports.OutputFormat.Mdash]: exports.OutputType.Video,
      [exports.OutputFormat.Flv]: exports.OutputType.Video,
      [exports.OutputFormat.Hls]: exports.OutputType.Video,
      [exports.OutputFormat.Jpeg]: exports.OutputType.Image,
      [exports.OutputFormat.Mp3]: exports.OutputType.Audio,
      [exports.OutputFormat.Mp4]: exports.OutputType.Video,
      [exports.OutputFormat.Png]: exports.OutputType.Image,
      [exports.OutputFormat.Rtmp]: exports.OutputType.Video,
      [exports.OutputFormat.VideoConcat]: exports.OutputType.Video,
  };
  const outputDefaultFormatByType = {
      [exports.OutputType.Audio]: exports.OutputFormat.Mp3,
      [exports.OutputType.Image]: exports.OutputFormat.Png,
      [exports.OutputType.Video]: exports.OutputFormat.Mp4,
      [exports.OutputType.ImageSequence]: exports.OutputFormat.Jpeg,
      [exports.OutputType.Waveform]: exports.OutputFormat.Png,
  };
  const outputDefaultStreaming = (overrides) => {
      const { format } = overrides;
      switch (format) {
          case exports.OutputFormat.Mdash: return outputDefaultDash(overrides);
          case exports.OutputFormat.Rtmp: return outputDefaultRtmp(overrides);
          case exports.OutputFormat.Hls:
          default: return outputDefaultHls(overrides);
      }
  };
  const outputDefaultHls = (overrides) => {
      const object = overrides || {};
      const commandOutput = outputDefaultHlsJson;
      return { ...commandOutput, ...object };
  };
  const outputDefaultDash = (overrides) => {
      const object = overrides || {};
      const commandOutput = outputDefaultDashJson;
      return { ...commandOutput, ...object };
      // TODO: figure out what this should be
      /* from http://underpop.online.fr/f/ffmpeg/help/dash-2.htm.gz
      ffmpeg -re -i <input> -map 0 -map 0 -c:a libfdk_aac -c:v libx264
      -b:v:0 800k -b:v:1 300k -s:v:1 320x170 -profile:v:1 baseline
      -profile:v:0 main -bf 1 -keyint_min 120 -g 120 -sc_threshold 0
      -b_strategy 0 -ar:a:1 22050 -use_timeline 1 -use_template 1
      -window_size 5 -adaptation_sets "id=0,streams=v id=1,streams=a"
        - f dash / path / to / out.mpd
      */
  };
  const outputDefaultRtmp = (overrides) => {
      const object = overrides || {};
      const commandOutput = outputDefaultRtmpJson;
      return { ...commandOutput, ...object };
      // TODO: figure out what this should be
      // IVS suggests, but it currently fails:
      // '-profile:v main', '-preset veryfast', '-x264opts "nal-hrd=cbr:no-scenecut"',
      // '-minrate 3000', '-maxrate 3000', '-g 60'
  };

  class ImageOutputClass extends RenderingOutputClass {
      _avType = exports.AVType.Video;
      get commandOutput() {
          const { upload, commandOutput } = this.args;
          if (!upload) {
              // console.log(this.constructor.name, "commandOutput NOT UPLOAD")
              return commandOutput;
          }
          const { renderingClips } = this;
          const [clip] = renderingClips;
          const { definition } = clip.content;
          // console.log(this.constructor.name, "commandOutput", definition.label)
          assertPreloadableDefinition(definition);
          const { info } = definition;
          assertObject(info);
          const { streams } = info;
          const [stream] = streams;
          const { pix_fmt, codec_name } = stream;
          if (codec_name !== 'png') {
              // console.log("commandOutput codec_name", codec_name)
              return commandOutput;
          }
          const { width, height, basename } = commandOutput;
          const overrides = { width, height, basename };
          const output = outputDefaultPng(overrides);
          // console.log("commandOutput output", output, commandOutput)
          return output;
      }
      get endTime() { return; }
      get filterGraphsOptions() {
          const { args, graphType, avType, startTime: time } = this;
          const { mash, upload } = args;
          const { quantize: videoRate } = mash;
          const filterGraphsOptions = {
              time, graphType, videoRate, size: this.sizeCovered(),
              avType, upload
          };
          return filterGraphsOptions;
      }
      outputType = exports.OutputType.Image;
      get startTime() {
          const { commandOutput, mash } = this.args;
          const { offset } = commandOutput;
          const needDuration = offset || mash.frames < 0;
          if (needDuration)
              return timeFromArgs(0, mash.quantize);
          return mash.timeRange.positionTime(Number(offset || 0), 'ceil');
      }
  }

  class ImageSequenceOutputClass extends AudioOutputClass {
      _avType = exports.AVType.Video;
      outputType = exports.OutputType.ImageSequence;
  }

  class VideoOutputClass extends AudioOutputClass {
      get avType() {
          return this.args.commandOutput.mute ? exports.AVType.Video : exports.AVType.Both;
      }
      get outputCover() { return !!this.args.commandOutput.cover; }
      outputType = exports.OutputType.Video;
  }

  class WaveformOutputClass extends RenderingOutputClass {
      _avType = exports.AVType.Audio;
      outputType = exports.OutputType.Waveform;
      get sizePromise() { return Promise.resolve(); }
  }
  // layers = []
  // layers << "color=s=#{output[:dimensions]}:c=##{output[:backcolor]}[bg]"
  // layers << "[0:a]aformat=channel_layouts=mono,showwavespic=colors=##{output[:forecolor]}:s=#{output[:dimensions]}[fg]"
  // layers << "[bg][fg]overlay=format=rgb"

  const outputInstanceAudio = (object) => {
      return new AudioOutputClass(object);
  };
  const outputInstanceImage = (object) => {
      return new ImageOutputClass(object);
  };
  const outputInstanceVideo = (object) => {
      return new VideoOutputClass(object);
  };
  const outputInstanceVideoSequence = (object) => {
      return new ImageSequenceOutputClass(object);
  };
  const outputInstanceWaveform = (object) => {
      return new WaveformOutputClass(object);
  };
  /**
   * @category Factory
   */
  const OutputFactory = {
      [exports.OutputType.Audio]: outputInstanceAudio,
      [exports.OutputType.Image]: outputInstanceImage,
      [exports.OutputType.Video]: outputInstanceVideo,
      [exports.OutputType.ImageSequence]: outputInstanceVideoSequence,
      [exports.OutputType.Waveform]: outputInstanceWaveform,
  };

  class StreamingOutputClass {
      constructor(args) {
          this.args = args;
      }
      args;
      streamingDescription(renderingResults) {
          const { mashes } = this.args;
          const promises = mashes.map(mash => {
              const options = {
                  audible: true, visible: true, streaming: true,
              };
              return mash.preloader.loadFilesPromise(mash.editedGraphFiles(options));
          });
          let promise = Promise.all(promises).then(() => {
              const files = [];
              const commandFilters = [];
              const commandInputs = [];
              const avType = exports.AVType.Both;
              mashes.forEach(mash => {
                  const args = {
                      size: this.outputSize,
                      videoRate: this.args.commandOutput.videoRate,
                      graphType: exports.GraphType.Cast,
                      avType
                  };
                  const filterGraphs = mash.filterGraphs(args);
                  const { filterGraphVisible } = filterGraphs;
                  commandInputs.push(...filterGraphVisible.commandInputs);
                  files.push(...filterGraphs.fileUrls.filter(graphFile => graphFile.input));
                  commandFilters.push(...filterGraphVisible.commandFilters);
              });
              const options = { ...this.args.commandOutput.options };
              const commandOutput = { ...this.args.commandOutput, options };
              const commandOptions = {
                  inputs: commandInputs, commandFilters, commandOutput, avType
              };
              return commandOptions;
          });
          return promise;
      }
      mashes = [];
      get outputSize() {
          const { width, height } = this.args.commandOutput;
          return { width, height };
      }
  }

  class VideoStreamOutputClass extends StreamingOutputClass {
  }

  exports.Action = Action;
  exports.ActionFactory = ActionFactory;
  exports.Actions = Actions;
  exports.AddClipToTrackAction = AddClipToTrackAction;
  exports.AddEffectAction = AddEffectAction;
  exports.AddLayerAction = AddLayerAction;
  exports.AddTrackAction = AddTrackAction;
  exports.AlphamergeFilter = AlphamergeFilter;
  exports.Anchors = Anchors;
  exports.ApiVersion = ApiVersion;
  exports.AudibleContext = AudibleContext;
  exports.AudibleContextInstance = AudibleContextInstance;
  exports.AudioClass = AudioClass;
  exports.AudioDefinitionClass = AudioDefinitionClass;
  exports.AudioOutputClass = AudioOutputClass;
  exports.AudioPreview = AudioPreview;
  exports.BrowserLoaderClass = BrowserLoaderClass;
  exports.CastClass = CastClass;
  exports.ChangeAction = ChangeAction;
  exports.ChangeFramesAction = ChangeFramesAction;
  exports.ChangeMultipleAction = ChangeMultipleAction;
  exports.ChromaKeyFilter = ChromaKeyFilter;
  exports.ClassButton = ClassButton;
  exports.ClassCollapsed = ClassCollapsed;
  exports.ClassDisabled = ClassDisabled;
  exports.ClassDropping = ClassDropping;
  exports.ClassDroppingAfter = ClassDroppingAfter;
  exports.ClassDroppingBefore = ClassDroppingBefore;
  exports.ClassSelected = ClassSelected;
  exports.ClipClass = ClipClass;
  exports.ClipDefinitionClass = ClipDefinitionClass;
  exports.ClipSelectTypes = ClipSelectTypes;
  exports.ColorChannelMixerFilter = ColorChannelMixerFilter;
  exports.ColorContentClass = ColorContentClass;
  exports.ColorContentDefinitionClass = ColorContentDefinitionClass;
  exports.ColorFilter = ColorFilter;
  exports.ColorizeFilter = ColorizeFilter;
  exports.Colors = Colors;
  exports.ContainerDefinitionMixin = ContainerDefinitionMixin;
  exports.ContainerMixin = ContainerMixin;
  exports.ContainerTypes = ContainerTypes;
  exports.ContentDefinitionMixin = ContentDefinitionMixin;
  exports.ContentMixin = ContentMixin;
  exports.ContentTypes = ContentTypes;
  exports.ContextFactory = ContextFactory;
  exports.ConvolutionFilter = ConvolutionFilter;
  exports.CropFilter = CropFilter;
  exports.DataGroups = DataGroups;
  exports.DataTypes = DataTypes;
  exports.Default = Default;
  exports.DefaultContainerId = DefaultContainerId;
  exports.DefaultContentId = DefaultContentId;
  exports.Defined = Defined;
  exports.DefinitionBase = DefinitionBase;
  exports.DefinitionTypes = DefinitionTypes;
  exports.DirectionLabels = DirectionLabels;
  exports.Directions = Directions;
  exports.EditTypes = EditTypes;
  exports.EditedClass = EditedClass;
  exports.EditorClass = EditorClass;
  exports.EditorSelectionClass = EditorSelectionClass;
  exports.EffectClass = EffectClass;
  exports.EffectDefinitionClass = EffectDefinitionClass;
  exports.Emitter = Emitter;
  exports.EmptyMethod = EmptyMethod;
  exports.Endpoints = Endpoints;
  exports.Errors = Errors;
  exports.EventTypes = EventTypes;
  exports.ExtDash = ExtDash;
  exports.ExtHls = ExtHls;
  exports.ExtJpeg = ExtJpeg;
  exports.ExtJson = ExtJson;
  exports.ExtPng = ExtPng;
  exports.ExtRtmp = ExtRtmp;
  exports.ExtText = ExtText;
  exports.ExtTs = ExtTs;
  exports.Factories = Factories;
  exports.Factory = Factory;
  exports.FillTypes = FillTypes;
  exports.FilterClass = FilterClass;
  exports.FilterDefinitionClass = FilterDefinitionClass;
  exports.FilterGraphClass = FilterGraphClass;
  exports.FilterGraphInputAudible = FilterGraphInputAudible;
  exports.FilterGraphInputVisible = FilterGraphInputVisible;
  exports.FilterGraphsClass = FilterGraphsClass;
  exports.FilterIdPrefix = FilterIdPrefix;
  exports.FontClass = FontClass;
  exports.FontDefinitionClass = FontDefinitionClass;
  exports.FpsFilter = FpsFilter;
  exports.GraphFileTypes = GraphFileTypes;
  exports.IdPrefix = IdPrefix;
  exports.IdSuffix = IdSuffix;
  exports.ImageClass = ImageClass;
  exports.ImageDefinitionClass = ImageDefinitionClass;
  exports.ImageOutputClass = ImageOutputClass;
  exports.ImageSequenceOutputClass = ImageSequenceOutputClass;
  exports.InstanceBase = InstanceBase;
  exports.LayerClass = LayerClass;
  exports.LayerFolderClass = LayerFolderClass;
  exports.LayerMashClass = LayerMashClass;
  exports.LayerTypes = LayerTypes;
  exports.LoadTypes = LoadTypes;
  exports.LoaderClass = LoaderClass;
  exports.MashClass = MashClass;
  exports.ModularDefinitionMixin = ModularDefinitionMixin;
  exports.ModularMixin = ModularMixin;
  exports.MoveClipAction = MoveClipAction;
  exports.MoveEffectAction = MoveEffectAction;
  exports.MoveLayerAction = MoveLayerAction;
  exports.NamespaceLink = NamespaceLink;
  exports.NamespaceSvg = NamespaceSvg;
  exports.NamespaceXhtml = NamespaceXhtml;
  exports.NonePreview = NonePreview;
  exports.OpacityFilter = OpacityFilter;
  exports.Orientations = Orientations;
  exports.OutputFactory = OutputFactory;
  exports.OutputFilterGraphPadding = OutputFilterGraphPadding;
  exports.OutputTypes = OutputTypes;
  exports.OverlayFilter = OverlayFilter;
  exports.Parameter = Parameter;
  exports.PointZero = PointZero;
  exports.PreloadableDefinitionMixin = PreloadableDefinitionMixin;
  exports.PreloadableMixin = PreloadableMixin;
  exports.PreviewClass = PreviewClass;
  exports.PropertiedClass = PropertiedClass;
  exports.PropertyTweenSuffix = PropertyTweenSuffix;
  exports.PropertyTypesNumeric = PropertyTypesNumeric;
  exports.RectZero = RectZero;
  exports.RemoveClipAction = RemoveClipAction;
  exports.RemoveLayerAction = RemoveLayerAction;
  exports.RenderingOutputClass = RenderingOutputClass;
  exports.ScaleFilter = ScaleFilter;
  exports.SelectTypes = SelectTypes;
  exports.ServerTypes = ServerTypes;
  exports.SetptsFilter = SetptsFilter;
  exports.SetsarFilter = SetsarFilter;
  exports.ShapeContainerClass = ShapeContainerClass;
  exports.ShapeContainerDefinitionClass = ShapeContainerDefinitionClass;
  exports.SizeIcon = SizeIcon;
  exports.SizeOutput = SizeOutput;
  exports.SizePreview = SizePreview;
  exports.SizeZero = SizeZero;
  exports.SizingDefinitionTypes = SizingDefinitionTypes;
  exports.Sizings = Sizings;
  exports.StreamingOutputClass = StreamingOutputClass;
  exports.TextContainerClass = TextContainerClass;
  exports.TextContainerDefinitionClass = TextContainerDefinitionClass;
  exports.TextContainerId = TextContainerId;
  exports.TextFilter = TextFilter;
  exports.TimeClass = TimeClass;
  exports.TimeRangeClass = TimeRangeClass;
  exports.TimingDefinitionTypes = TimingDefinitionTypes;
  exports.Timings = Timings;
  exports.TrackClass = TrackClass;
  exports.TrackFactory = TrackFactory;
  exports.TrackPreviewClass = TrackPreviewClass;
  exports.TrackPreviewHandleSize = TrackPreviewHandleSize;
  exports.TrackPreviewLineSize = TrackPreviewLineSize;
  exports.TriggerTypes = TriggerTypes;
  exports.TrimFilter = TrimFilter;
  exports.TweenableDefinitionMixin = TweenableDefinitionMixin;
  exports.TweenableMixin = TweenableMixin;
  exports.UpdatableDurationDefinitionMixin = UpdatableDurationDefinitionMixin;
  exports.UpdatableDurationDefinitionTypes = UpdatableDurationDefinitionTypes;
  exports.UpdatableDurationMixin = UpdatableDurationMixin;
  exports.UpdatableSizeDefinitionMixin = UpdatableSizeDefinitionMixin;
  exports.UpdatableSizeDefinitionType = UpdatableSizeDefinitionType;
  exports.UpdatableSizeMixin = UpdatableSizeMixin;
  exports.UploadTypes = UploadTypes;
  exports.VideoClass = VideoClass;
  exports.VideoDefinitionClass = VideoDefinitionClass;
  exports.VideoOutputClass = VideoOutputClass;
  exports.VideoSequenceClass = VideoSequenceClass;
  exports.VideoSequenceDefinitionClass = VideoSequenceDefinitionClass;
  exports.VideoStreamOutputClass = VideoStreamOutputClass;
  exports.WaveformOutputClass = WaveformOutputClass;
  exports.actionInstance = actionInstance;
  exports.arrayLast = arrayLast;
  exports.arrayReversed = arrayReversed;
  exports.arraySet = arraySet;
  exports.arrayUnique = arrayUnique;
  exports.assertAboveZero = assertAboveZero;
  exports.assertAction = assertAction;
  exports.assertArray = assertArray;
  exports.assertBoolean = assertBoolean;
  exports.assertCast = assertCast;
  exports.assertChangeAction = assertChangeAction;
  exports.assertClip = assertClip;
  exports.assertContainer = assertContainer;
  exports.assertContainerObject = assertContainerObject;
  exports.assertContainerType = assertContainerType;
  exports.assertContent = assertContent;
  exports.assertContentType = assertContentType;
  exports.assertConvolutionServerFilter = assertConvolutionServerFilter;
  exports.assertDataGroup = assertDataGroup;
  exports.assertDataType = assertDataType;
  exports.assertDefined = assertDefined;
  exports.assertDefinition = assertDefinition;
  exports.assertDefinitionType = assertDefinitionType;
  exports.assertDirection = assertDirection;
  exports.assertEditType = assertEditType;
  exports.assertEdited = assertEdited;
  exports.assertEffect = assertEffect;
  exports.assertFontDefinition = assertFontDefinition;
  exports.assertLayer = assertLayer;
  exports.assertLayerFolder = assertLayerFolder;
  exports.assertLayerMash = assertLayerMash;
  exports.assertLayerType = assertLayerType;
  exports.assertLoadType = assertLoadType;
  exports.assertLoaderPath = assertLoaderPath;
  exports.assertLoaderType = assertLoaderType;
  exports.assertMash = assertMash;
  exports.assertMashClass = assertMashClass;
  exports.assertMashData = assertMashData;
  exports.assertNumber = assertNumber;
  exports.assertObject = assertObject;
  exports.assertPoint = assertPoint;
  exports.assertPopulatedArray = assertPopulatedArray;
  exports.assertPopulatedObject = assertPopulatedObject;
  exports.assertPopulatedString = assertPopulatedString;
  exports.assertPositive = assertPositive;
  exports.assertPreloadable = assertPreloadable;
  exports.assertPreloadableDefinition = assertPreloadableDefinition;
  exports.assertProperty = assertProperty;
  exports.assertRect = assertRect;
  exports.assertRgb = assertRgb;
  exports.assertSelectType = assertSelectType;
  exports.assertSize = assertSize;
  exports.assertSizeAboveZero = assertSizeAboveZero;
  exports.assertString = assertString;
  exports.assertTextContainer = assertTextContainer;
  exports.assertTime = assertTime;
  exports.assertTimeRange = assertTimeRange;
  exports.assertTrack = assertTrack;
  exports.assertTrue = assertTrue;
  exports.assertTweenable = assertTweenable;
  exports.assertTweenableDefinition = assertTweenableDefinition;
  exports.assertUpdatableDuration = assertUpdatableDuration;
  exports.assertUpdatableDurationDefinition = assertUpdatableDurationDefinition;
  exports.assertUpdatableSize = assertUpdatableSize;
  exports.assertUpdatableSizeDefinition = assertUpdatableSizeDefinition;
  exports.assertValue = assertValue;
  exports.assertValueObject = assertValueObject;
  exports.assertVideo = assertVideo;
  exports.audioDefinition = audioDefinition;
  exports.audioDefinitionFromId = audioDefinitionFromId;
  exports.audioFromId = audioFromId;
  exports.audioInstance = audioInstance;
  exports.castInstance = castInstance;
  exports.centerPoint = centerPoint;
  exports.clipDefault = clipDefault;
  exports.clipDefaultId = clipDefaultId;
  exports.clipDefaults = clipDefaults;
  exports.clipDefinition = clipDefinition;
  exports.clipDefinitionFromId = clipDefinitionFromId;
  exports.clipFromId = clipFromId;
  exports.clipInstance = clipInstance;
  exports.colorAlpha = colorAlpha;
  exports.colorAlphaColor = colorAlphaColor;
  exports.colorBlack = colorBlack;
  exports.colorBlackOpaque = colorBlackOpaque;
  exports.colorBlackTransparent = colorBlackTransparent;
  exports.colorBlue = colorBlue;
  exports.colorFromRgb = colorFromRgb;
  exports.colorFromRgba = colorFromRgba;
  exports.colorGreen = colorGreen;
  exports.colorHexRegex = colorHexRegex;
  exports.colorHexToRgb = colorHexToRgb;
  exports.colorHexToRgba = colorHexToRgba;
  exports.colorName = colorName;
  exports.colorRed = colorRed;
  exports.colorRgb = colorRgb;
  exports.colorRgbDifference = colorRgbDifference;
  exports.colorRgbKeys = colorRgbKeys;
  exports.colorRgbRegex = colorRgbRegex;
  exports.colorRgbToHex = colorRgbToHex;
  exports.colorRgbToYuv = colorRgbToYuv;
  exports.colorRgba = colorRgba;
  exports.colorRgbaKeys = colorRgbaKeys;
  exports.colorRgbaRegex = colorRgbaRegex;
  exports.colorRgbaToHex = colorRgbaToHex;
  exports.colorRgbaToRgba = colorRgbaToRgba;
  exports.colorRgbaTransparent = colorRgbaTransparent;
  exports.colorServer = colorServer;
  exports.colorStrip = colorStrip;
  exports.colorToRgb = colorToRgb;
  exports.colorToRgba = colorToRgba;
  exports.colorTransparent = colorTransparent;
  exports.colorValid = colorValid;
  exports.colorValidHex = colorValidHex;
  exports.colorValidRgb = colorValidRgb;
  exports.colorValidRgba = colorValidRgba;
  exports.colorWhite = colorWhite;
  exports.colorWhiteOpaque = colorWhiteOpaque;
  exports.colorWhiteTransparent = colorWhiteTransparent;
  exports.colorYellow = colorYellow;
  exports.colorYuvBlend = colorYuvBlend;
  exports.colorYuvDifference = colorYuvDifference;
  exports.colorYuvToRgb = colorYuvToRgb;
  exports.commandFilesInput = commandFilesInput;
  exports.commandFilesInputIndex = commandFilesInputIndex;
  exports.containerDefaults = containerDefaults;
  exports.containerDefinition = containerDefinition;
  exports.containerDefinitionFromId = containerDefinitionFromId;
  exports.containerFromId = containerFromId;
  exports.containerInstance = containerInstance;
  exports.contentDefaults = contentDefaults;
  exports.contentDefinition = contentDefinition;
  exports.contentDefinitionFromId = contentDefinitionFromId;
  exports.contentFromId = contentFromId;
  exports.contentInstance = contentInstance;
  exports.editorArgs = editorArgs;
  exports.editorInstance = editorInstance;
  exports.editorSelectionInstance = editorSelectionInstance;
  exports.effectDefaults = effectDefaults;
  exports.effectDefinition = effectDefinition;
  exports.effectDefinitionFromId = effectDefinitionFromId;
  exports.effectFromId = effectFromId;
  exports.effectInstance = effectInstance;
  exports.eventStop = eventStop;
  exports.fetchCallback = fetchCallback;
  exports.filterDefaults = filterDefaults;
  exports.filterDefinition = filterDefinition;
  exports.filterDefinitionFromId = filterDefinitionFromId;
  exports.filterFromId = filterFromId;
  exports.filterInstance = filterInstance;
  exports.fontDefault = fontDefault;
  exports.fontDefaults = fontDefaults;
  exports.fontDefinition = fontDefinition;
  exports.fontDefinitionFromId = fontDefinitionFromId;
  exports.fontFromId = fontFromId;
  exports.fontInstance = fontInstance;
  exports.getChunksFromString = getChunksFromString;
  exports.hex256 = hex256;
  exports.idGenerate = idGenerate;
  exports.idGenerateString = idGenerateString;
  exports.idIsTemporary = idIsTemporary;
  exports.idPrefixSet = idPrefixSet;
  exports.idTemporary = idTemporary;
  exports.imageDefinition = imageDefinition;
  exports.imageDefinitionFromId = imageDefinitionFromId;
  exports.imageFromId = imageFromId;
  exports.imageInstance = imageInstance;
  exports.isAboveZero = isAboveZero;
  exports.isAction = isAction;
  exports.isActionEvent = isActionEvent;
  exports.isActionInit = isActionInit;
  exports.isArray = isArray;
  exports.isAudio = isAudio;
  exports.isAudioDefinition = isAudioDefinition;
  exports.isBelowOne = isBelowOne;
  exports.isBoolean = isBoolean;
  exports.isCast = isCast;
  exports.isCastData = isCastData;
  exports.isChangeAction = isChangeAction;
  exports.isChangeActionObject = isChangeActionObject;
  exports.isClip = isClip;
  exports.isClipObject = isClipObject;
  exports.isClipSelectType = isClipSelectType;
  exports.isColorContent = isColorContent;
  exports.isContainer = isContainer;
  exports.isContainerDefinition = isContainerDefinition;
  exports.isContainerObject = isContainerObject;
  exports.isContainerType = isContainerType;
  exports.isContent = isContent;
  exports.isContentDefinition = isContentDefinition;
  exports.isContentType = isContentType;
  exports.isConvolutionServerFilter = isConvolutionServerFilter;
  exports.isCustomEvent = isCustomEvent;
  exports.isDataGroup = isDataGroup;
  exports.isDataType = isDataType;
  exports.isDefined = isDefined;
  exports.isDefinition = isDefinition;
  exports.isDefinitionObject = isDefinitionObject;
  exports.isDefinitionType = isDefinitionType;
  exports.isDirection = isDirection;
  exports.isEditType = isEditType;
  exports.isEdited = isEdited;
  exports.isEffect = isEffect;
  exports.isEffectDefinition = isEffectDefinition;
  exports.isEventType = isEventType;
  exports.isFillType = isFillType;
  exports.isFloat = isFloat;
  exports.isFontDefinition = isFontDefinition;
  exports.isGraphFileType = isGraphFileType;
  exports.isImageDefinition = isImageDefinition;
  exports.isInstance = isInstance;
  exports.isInstanceObject = isInstanceObject;
  exports.isInteger = isInteger;
  exports.isLayer = isLayer;
  exports.isLayerFolder = isLayerFolder;
  exports.isLayerFolderObject = isLayerFolderObject;
  exports.isLayerMash = isLayerMash;
  exports.isLayerMashObject = isLayerMashObject;
  exports.isLayerObject = isLayerObject;
  exports.isLayerType = isLayerType;
  exports.isLoadType = isLoadType;
  exports.isLoadedAudio = isLoadedAudio;
  exports.isLoadedImage = isLoadedImage;
  exports.isLoadedVideo = isLoadedVideo;
  exports.isLoaderPath = isLoaderPath;
  exports.isLoaderType = isLoaderType;
  exports.isMash = isMash;
  exports.isMashAndDefinitionsObject = isMashAndDefinitionsObject;
  exports.isMashClass = isMashClass;
  exports.isMashData = isMashData;
  exports.isMethod = isMethod;
  exports.isNan = isNan;
  exports.isNumber = isNumber;
  exports.isNumberOrNaN = isNumberOrNaN;
  exports.isNumeric = isNumeric;
  exports.isObject = isObject;
  exports.isOrientation = isOrientation;
  exports.isPoint = isPoint;
  exports.isPopulatedArray = isPopulatedArray;
  exports.isPopulatedObject = isPopulatedObject;
  exports.isPopulatedString = isPopulatedString;
  exports.isPositive = isPositive;
  exports.isPreloadable = isPreloadable;
  exports.isPreloadableDefinition = isPreloadableDefinition;
  exports.isPropertied = isPropertied;
  exports.isProperty = isProperty;
  exports.isRect = isRect;
  exports.isRgb = isRgb;
  exports.isSelectType = isSelectType;
  exports.isSelectedProperty = isSelectedProperty;
  exports.isShapeContainer = isShapeContainer;
  exports.isSize = isSize;
  exports.isSizingDefinitionType = isSizingDefinitionType;
  exports.isString = isString;
  exports.isTextContainer = isTextContainer;
  exports.isTime = isTime;
  exports.isTimeRange = isTimeRange;
  exports.isTimingDefinitionType = isTimingDefinitionType;
  exports.isTrack = isTrack;
  exports.isTriggerType = isTriggerType;
  exports.isTrueValue = isTrueValue;
  exports.isTweenable = isTweenable;
  exports.isTweenableDefinition = isTweenableDefinition;
  exports.isUndefined = isUndefined;
  exports.isUpdatableDuration = isUpdatableDuration;
  exports.isUpdatableDurationDefinition = isUpdatableDurationDefinition;
  exports.isUpdatableDurationType = isUpdatableDurationType;
  exports.isUpdatableSize = isUpdatableSize;
  exports.isUpdatableSizeDefinition = isUpdatableSizeDefinition;
  exports.isUpdatableSizeType = isUpdatableSizeType;
  exports.isUploadType = isUploadType;
  exports.isValue = isValue;
  exports.isValueObject = isValueObject;
  exports.isVideo = isVideo;
  exports.isVideoDefinition = isVideoDefinition;
  exports.layerFolderInstance = layerFolderInstance;
  exports.layerInstance = layerInstance;
  exports.layerMashInstance = layerMashInstance;
  exports.mashInstance = mashInstance;
  exports.outputDefaultAudio = outputDefaultAudio;
  exports.outputDefaultDash = outputDefaultDash;
  exports.outputDefaultFormatByType = outputDefaultFormatByType;
  exports.outputDefaultHls = outputDefaultHls;
  exports.outputDefaultImage = outputDefaultImage;
  exports.outputDefaultImageSequence = outputDefaultImageSequence;
  exports.outputDefaultPng = outputDefaultPng;
  exports.outputDefaultPopulate = outputDefaultPopulate;
  exports.outputDefaultRendering = outputDefaultRendering;
  exports.outputDefaultRtmp = outputDefaultRtmp;
  exports.outputDefaultStreaming = outputDefaultStreaming;
  exports.outputDefaultTypeByFormat = outputDefaultTypeByFormat;
  exports.outputDefaultVideo = outputDefaultVideo;
  exports.outputDefaultWaveform = outputDefaultWaveform;
  exports.outputInstanceAudio = outputInstanceAudio;
  exports.outputInstanceImage = outputInstanceImage;
  exports.outputInstanceVideo = outputInstanceVideo;
  exports.outputInstanceVideoSequence = outputInstanceVideoSequence;
  exports.outputInstanceWaveform = outputInstanceWaveform;
  exports.pixelColor = pixelColor;
  exports.pixelFromFrame = pixelFromFrame;
  exports.pixelNeighboringRgbas = pixelNeighboringRgbas;
  exports.pixelPerFrame = pixelPerFrame;
  exports.pixelRgbaAtIndex = pixelRgbaAtIndex;
  exports.pixelToFrame = pixelToFrame;
  exports.pixelsMixRbg = pixelsMixRbg;
  exports.pixelsMixRbga = pixelsMixRbga;
  exports.pixelsRemoveRgba = pixelsRemoveRgba;
  exports.pixelsReplaceRgba = pixelsReplaceRgba;
  exports.pointCopy = pointCopy;
  exports.pointNegate = pointNegate;
  exports.pointRound = pointRound;
  exports.pointString = pointString;
  exports.pointValueString = pointValueString;
  exports.pointsEqual = pointsEqual;
  exports.propertyInstance = propertyInstance;
  exports.propertyTypeCoerce = propertyTypeCoerce;
  exports.propertyTypeDefault = propertyTypeDefault;
  exports.propertyTypeIsString = propertyTypeIsString;
  exports.propertyTypeValid = propertyTypeValid;
  exports.rectCopy = rectCopy;
  exports.rectFromSize = rectFromSize;
  exports.rectRound = rectRound;
  exports.rectString = rectString;
  exports.rectsEqual = rectsEqual;
  exports.rectsFromSizes = rectsFromSizes;
  exports.rgbNumeric = rgbNumeric;
  exports.rgbValue = rgbValue;
  exports.roundMethod = roundMethod;
  exports.roundWithMethod = roundWithMethod;
  exports.selectedPropertiesScalarObject = selectedPropertiesScalarObject;
  exports.selectedPropertyObject = selectedPropertyObject;
  exports.sizeAboveZero = sizeAboveZero;
  exports.sizeCeil = sizeCeil;
  exports.sizeCopy = sizeCopy;
  exports.sizeCover = sizeCover;
  exports.sizeEven = sizeEven;
  exports.sizeFloor = sizeFloor;
  exports.sizeFromElement = sizeFromElement;
  exports.sizeLock = sizeLock;
  exports.sizeLockNegative = sizeLockNegative;
  exports.sizeRound = sizeRound;
  exports.sizeScale = sizeScale;
  exports.sizeString = sizeString;
  exports.sizedEven = sizedEven;
  exports.sizesEqual = sizesEqual;
  exports.sortByFrame = sortByFrame;
  exports.sortByIndex = sortByIndex;
  exports.sortByLabel = sortByLabel;
  exports.sortByTrack = sortByTrack;
  exports.stringFamilySizeRect = stringFamilySizeRect;
  exports.stringPluralize = stringPluralize;
  exports.stringSeconds = stringSeconds;
  exports.svgAddClass = svgAddClass;
  exports.svgAppend = svgAppend;
  exports.svgDefsElement = svgDefsElement;
  exports.svgDifferenceDefs = svgDifferenceDefs;
  exports.svgElement = svgElement;
  exports.svgFeImageElement = svgFeImageElement;
  exports.svgFilter = svgFilter;
  exports.svgFilterElement = svgFilterElement;
  exports.svgFunc = svgFunc;
  exports.svgGroupElement = svgGroupElement;
  exports.svgId = svgId;
  exports.svgImageElement = svgImageElement;
  exports.svgMaskElement = svgMaskElement;
  exports.svgPathElement = svgPathElement;
  exports.svgPatternElement = svgPatternElement;
  exports.svgPolygonElement = svgPolygonElement;
  exports.svgRectPoints = svgRectPoints;
  exports.svgSet = svgSet;
  exports.svgSetBox = svgSetBox;
  exports.svgSetChildren = svgSetChildren;
  exports.svgSetDimensions = svgSetDimensions;
  exports.svgSetDimensionsLock = svgSetDimensionsLock;
  exports.svgSetTransform = svgSetTransform;
  exports.svgSetTransformPoint = svgSetTransformPoint;
  exports.svgSetTransformRects = svgSetTransformRects;
  exports.svgTransform = svgTransform;
  exports.svgUrl = svgUrl;
  exports.svgUseElement = svgUseElement;
  exports.throwError = throwError;
  exports.timeEqualizeRates = timeEqualizeRates;
  exports.timeFromArgs = timeFromArgs;
  exports.timeFromSeconds = timeFromSeconds;
  exports.timeRangeFromArgs = timeRangeFromArgs;
  exports.timeRangeFromSeconds = timeRangeFromSeconds;
  exports.timeRangeFromTime = timeRangeFromTime;
  exports.timeRangeFromTimes = timeRangeFromTimes;
  exports.trackInstance = trackInstance;
  exports.tweenColorStep = tweenColorStep;
  exports.tweenColors = tweenColors;
  exports.tweenCoverPoints = tweenCoverPoints;
  exports.tweenCoverSizes = tweenCoverSizes;
  exports.tweenInputTime = tweenInputTime;
  exports.tweenMaxSize = tweenMaxSize;
  exports.tweenMinMax = tweenMinMax;
  exports.tweenMinSize = tweenMinSize;
  exports.tweenNumberObject = tweenNumberObject;
  exports.tweenNumberStep = tweenNumberStep;
  exports.tweenOption = tweenOption;
  exports.tweenOverPoint = tweenOverPoint;
  exports.tweenOverRect = tweenOverRect;
  exports.tweenOverSize = tweenOverSize;
  exports.tweenPad = tweenPad;
  exports.tweenPosition = tweenPosition;
  exports.tweenRectLock = tweenRectLock;
  exports.tweenRects = tweenRects;
  exports.tweenRectsLock = tweenRectsLock;
  exports.tweenScaleSizeRatioLock = tweenScaleSizeRatioLock;
  exports.tweenScaleSizeToRect = tweenScaleSizeToRect;
  exports.tweenableRects = tweenableRects;
  exports.tweeningPoints = tweeningPoints;
  exports.urlCombine = urlCombine;
  exports.urlEndpoint = urlEndpoint;
  exports.urlForEndpoint = urlForEndpoint;
  exports.urlFromEndpoint = urlFromEndpoint;
  exports.urlHasProtocol = urlHasProtocol;
  exports.urlIsHttp = urlIsHttp;
  exports.urlIsObject = urlIsObject;
  exports.urlIsRootProtocol = urlIsRootProtocol;
  exports.urlOptions = urlOptions;
  exports.urlOptionsObject = urlOptionsObject;
  exports.urlParse = urlParse;
  exports.urlPrependProtocol = urlPrependProtocol;
  exports.urlProtocol = urlProtocol;
  exports.urlsAbsolute = urlsAbsolute;
  exports.urlsParsed = urlsParsed;
  exports.videoDefinition = videoDefinition;
  exports.videoDefinitionFromId = videoDefinitionFromId;
  exports.videoFromId = videoFromId;
  exports.videoInstance = videoInstance;
  exports.videoSequenceDefinition = videoSequenceDefinition;
  exports.videoSequenceDefinitionFromId = videoSequenceDefinitionFromId;
  exports.videoSequenceFromId = videoSequenceFromId;
  exports.videoSequenceInstance = videoSequenceInstance;
  exports.yuvNumeric = yuvNumeric;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
