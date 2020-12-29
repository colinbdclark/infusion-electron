/*
Infusion-Electron Renderer IPC
Copyright 2019 Colin Clark

Licensed under the 3-Clause "New" BSD license.
You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the 3-Clause "New" BSD License at
https://github.com/colinbdclark/infusion-electron/raw/master/LICENSE.txt
*/

"use strict";

var fluid = fluid || require("infusion"),
    electron = fluid.registerNamespace("electron");

fluid.defaults("electron.rendererIPC", {
    gradeNames: "electron.ipcComponent",

    members: {
        source: "@expand:electron.rendererIPC.getIPC()"
    }
});

electron.rendererIPC.getIPC = function () {
    return electron.nodeIntegration.require("electron").ipcRenderer;
};
