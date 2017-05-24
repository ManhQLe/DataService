'use strict';
const path = require("path");
const http = require("http");
const fs = require('fs');
const express = require("express");
const UrlPattern = require("url-pattern");
const app = express()
const server = http.createServer(app);
const moment = require("moment");
const uSocketServer = require("uws").Server;
const Performance = require('./Apps/Perf');


global.RootDir = __dirname;
global.WSUrl = "/Realtime";
global.PerfCounter = new Performance();

const RTRoute = require('./RTRoute')
const APIRoute = require('./APIRoute');

var wss = new uSocketServer({
    server: server,
    verifyClient: Verify
});

function Verify(info) {
    var req = info.req;
    var In = req.connection
    req.UserInfo = {
        "UserName": In.remoteAddress,
        "IP": In.remoteAddress
    }

    var p = new UrlPattern(global.WSUrl + "/:App");
    var Out = p.match(req.url);
    var AppDir = path.join(global.RootDir, req.url);

    return (req.UserInfo.UserName && Out && fs.existsSync(AppDir))
}

wss.on("connection", function (ws) {
    try {        
        var AppDir = path.join(global.RootDir, ws.upgradeReq.url);
        //Authorization is here before requiring application;
        var Application = require("." + ws.upgradeReq.url);
        var A = new Application({
            "wss": wss,
            "ws": ws,
            "AppDir": AppDir,
            "UserInfo": ws.upgradeReq.UserInfo
        });
    }
    catch (ex) {
        console.log(ex);
        ws.close();
    }
})


app.use(global.WSUrl, RTRoute);
app.use("/API", APIRoute);

app.use("/Resources", express.static(path.join(__dirname, "Resources")));
app.set("port", 8000);

process.on("uncaughtException", function (ex) {
    console.log(ex);
})

server.listen(app.get("port"), function () {
    console.log("Listening");
})
