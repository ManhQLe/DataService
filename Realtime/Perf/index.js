'use strict';
var RTBase = require.main.require("./Bases/RTBase");
function Perf(Init) {
    Perf.baseConstructor.call(this, Init);
    this.On("Chat", Chat);
}

RTBase.ExtendsTo(Perf);

Perf.OnMessageError = function (Client, err) {
    console.log("Error messaging");
    console.log(err);
}

Perf.OnClose = function (Client, ws) {
    console.log("Client Closed");
    console.log(Client.UserInfo);
}

function Chat(text) {
    var UInf = this.UserInfo;
    
    this.BroadCast("Chat",{
        "NTAccount": UInf.UserName,
        "UserName": UInf.UserName,
        "Comments": text,
        "Date": Date.now()
    });
}

global.PerfCounter.on("Performance",function(d){
    Perf.BroadCast("Performance", d);
})


module.exports = Perf;