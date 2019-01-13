/*
Infusion-Electron Core
Copyright 2016-2019 Colin Clark

Licensed under the 3-Clause "New" BSD license.
You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the 3-Clause "New" BSD License at
https://github.com/colinbdclark/infusion-electron/raw/master/LICENSE.txt
*/

// Note: This file is intended to be run in both Node.js
// and in Electron BrowserWindows, hence the additional
// boilerplate typically only used in browser-facing scripts.

"use strict";

var fluid = fluid || require("infusion");

(function () {

    var electron = fluid.registerNamespace("electron"),
        fileUrl = require("file-url");

    electron.getAppRootPath = function (app) {
        return app.getAppPath() + "/";
    };

    electron.urlForFilePath = function (path) {
        return fileUrl(path);
    };

    electron.getAppRootURL = function (app) {
        return electron.urlForFilePath(electron.getAppRootPath(app));
    };
})();
