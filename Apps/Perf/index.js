'use strict';
const EventEmitter = require('events');
const os = require('os');
const MAX = 100;
class Performance extends EventEmitter {
    constructor() { 
        super();
        this.Begin = os.cpus();
        this.Run();
    }
    Run() {
        GetPerf(this);
    }
}

function GetPerf(me) {
    var End = os.cpus();
    var Begin = me.Begin;
    var b;
    var Result = {
        CPUs:[],
        TotalMem:0,
        FreeMem:0,
        UsedMem:0
    };
    Result.TotalMem = os.totalmem();
    Result.FreeMem = os.freemem();
    Result.UsedMem = Result.TotalMem - Result.FreeMem;

    End.forEach(function (e, i) {
        b = Begin[i];
        Result.CPUs.push(Math.max(0, MAX - (e.times.idle - b.times.idle)) / MAX * 100.0);
    }, me);
    
    me.Begin = End;
    me.emit("Performance",Result);
    setTimeout(GetPerf, MAX, me);
}


module.exports = Performance;