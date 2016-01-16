/*
Copyright 2016 Colin Clark

Licensed under the 3-Clause "New" BSD license.
You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the 3-Clause "New" BSD License at
https://github.com/colinbdclark/infusion-electron/raw/master/LICENSE.txt
*/

// Note: This file is intended to be run in both Node.js
// and in Electron BrowserWindows, hence the additional
// boilerplate typically only used in browser-facing scripts.
var fluid = fluid || require("infusion");

(function () {
    "use strict";

    var electron = fluid.registerNamespace("electron");

    electron.getAppRootPath = function () {
        return process.cwd() + "/";
    };

    electron.urlForFilePath = function (path) {
        return path ? "file://" + path : "";
    };

    electron.getAppRootURL = function () {
        return electron.urlForFilePath(electron.getAppRootPath());
    };
}());
