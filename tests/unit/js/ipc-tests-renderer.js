/*
Infusion-Electron IPC Tests - Renderer Process
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

fluid.defaults("electron.tests.ipcListenerResponder", {
    gradeNames: "fluid.component",

    components: {
        ipc: {
            type: "electron.rendererIPC",
            options: {
                channel: "test",
                listeners: {
                    "onMessage.respond": {
                        funcName: "electron.tests.ipcListenerResponder.respond",
                        args: ["{that}", "{arguments}.1"]
                    }
                }
            }
        }
    },

    listeners: {
        "onCreate.sendMessage": {
            func: "{that}.ipc.send",
            args: ["from renderer"]
        }
    }
});

electron.tests.ipcListenerResponder.respond = function (that, message) {
    if (message === "from main") {
        that.send("from renderer");
    } else {
        throw new Error("An unrecognized message was received from the main process.", message);
    }
};
