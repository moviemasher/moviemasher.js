"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const server_express_1 = require("@moviemasher/server-express");
const server_core_1 = require("@moviemasher/server-core");
const config = process.argv[2] || path_1.default.resolve(__dirname, './server-config.json');
const configuration = (0, server_core_1.expandToJson)(config);
const options = (0, server_express_1.HostDefaultOptions)(configuration);
const host = new server_express_1.Host(options);
host.start();
