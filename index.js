import server from "./src/server.js";
import http from "http";
import config from "./src/config.js";

const startServer = (port) => {
  const httpServer = http.createServer(server);

  httpServer.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.log(`Port ${port} busy, trying ${port + 1}`);
      startServer(port + 1);
    } else {
      throw err;
    }
  });

  httpServer.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
};

startServer(config.server.port);
