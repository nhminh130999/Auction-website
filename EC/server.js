const http = require("http");
const app = require("../EC/app");
const server = http.createServer(app);
const port = process.env.PORT || 3000;
server.listen(port);
