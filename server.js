const OS = require('os')
process.env.UV_THREADPOOL_SIZE = OS.cpus().length;

const { readdirSync, readFileSync, writeFileSync, existsSync, copySync } = require('fs-extra');
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const api = require("./routes/api");
const getIP = require('ipware')().get_ip;
var fs = require('fs-extra')
var path = require('path')

const app = express();
app.set('json spaces', 1);
app.use(helmet());
app.use(express.json());
app.use(cors());

app.use(async function(req, res, next) {
  if (!req.headers['user-agent'].includes('got')) return;
    var ipInfo = getIP(req);
    var color = ["\x1b[33m", "\x1b[34m", "\x1b[35m", '\x1b[36m', '\x1b[32m'];
    var more = color[Math.floor(Math.random() * color.length)];
    console.log(more+ '[ IP ] -> ' + ipInfo.clientIp + " || " + decodeURI(req.url));
    next();
});
app.use("/", api);
app.use((error, req, res, next) => {
  res.status(error.status).json({ message: error.message });
});

(async () => {
  console.log(process.env.PORT || "6372")
  app.listen(process.env.PORT || "6372");
})();
