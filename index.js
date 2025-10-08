import server from "./src/server.js";
import http from "http";
import config from './src/config.js'

http.createServer(server).listen(config.server.port);

console.log(`Server running at ${config.server.localhost}`);
