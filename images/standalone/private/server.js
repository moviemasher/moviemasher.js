// src/server.ts
import { Host, HostDefaultOptions } from "@moviemasher/server-express";
var host = new Host(HostDefaultOptions());
host.start();
