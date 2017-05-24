'use strict'

function Ping(wss, ws) {
    console.log("Begin")
    console.log(Ping.AppDir);
    ws.send("Welcome to Chat App")
    ws.on("message", function (data) {
        console.log(data);
        ws.send(data);
    })
    ws.on("close", function () {
        console.log("client quit");
    })
}

module.exports = Ping;