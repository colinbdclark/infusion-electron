/*
Infusion-Electron Test Window
Copyright 2019 Colin Clark

Licensed under the 3-Clause "New" BSD license.
You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the 3-Clause "New" BSD License at
https://github.com/colinbdclark/infusion-electron/raw/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    electron = fluid.registerNamespace("electron");

fluid.defaults("electron.tests.ipcTestWindow", {
    gradeNames: [
        "electron.ipcWindow",
        "electron.tests.testWindow"
    ],

    channel: "test",

    windowOptions: {
        title: "A Window for IPC Testing",

        webPreferences: {
            contextIsolation: false,
            nodeIntegration: true
        }
    },

    model: {
        url: {
            expander: {
                funcName: "fluid.stringTemplate",
                args: [
                    "%url/html/ipc-test-window.html",
                    "{app}.env.appRoot"
                ]
            }
        }
    }
});

