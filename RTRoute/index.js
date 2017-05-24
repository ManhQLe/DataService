'use strict';
var express = require('express')
var path = require('path')
var fs = require('fs');
var router = express.Router()

var CPath = path.join(global.RootDir, "Realtime");

router.get("/:App/:Path*?", function (req, res) {
    if (!req.params.Path || req.params.Path == '' || req.params.Path == '/')
        res.redirect("/Realtime/" + req.params.App + "/index.html");
    else {
        var StaticRelPath = req.path.replace("/" + req.params.App, '');
        var FilePath = path.join(CPath, req.params.App, "Browser", StaticRelPath);
        fs.stat(FilePath, function (err, stat) {
            if (err) {
                res.status(404).send("Not found");
            }
            else {
                stat.isFile() ? res.sendFile(FilePath)
                    : res.status(404).send("Not found");
            } 
        })
    }
})

module.exports = router;