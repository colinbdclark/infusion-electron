/*
Infusion-Electron App
Copyright 2015-2019 Colin Clark

Licensed under the 3-Clause "New" BSD license.
You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the 3-Clause "New" BSD License at
https://github.com/colinbdclark/infusion-electron/raw/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    electronModule = require("electron"),
    electron = fluid.registerNamespace("electron");

electron.appSingleton = electronModule.app;

fluid.defaults("electron.app", {
    gradeNames: "fluid.modelComponent",

    commandLineSwitches: {},

    members: {
        app: electron.appSingleton,

        env: {
            appRoot: {
                url: "@expand:electron.getAppRootURL({that}.app)",
                path: "@expand:electron.getAppRootPath({that}.app)"
            }
        }
    },

    events: {
        onReady: null,
        onAllWindowsClosed: null
    },

    listeners: {
        "onCreate.setCommandLineSwitches": {
            funcName: "electron.app.setCommandLineSwitches",
            args: ["{that}.app", "{that}.options.commandLineSwitches"]
        },

        "onCreate.bindAppEvents": {
            funcName: "electron.app.bindAppEvents",
            args: ["{that}.app", "{that}.events"]
        },

        "onAllWindowsClosed.quitIfNotMac": {
            funcName: "electron.app.quitIfNotMac",
            args: "{that}.app"
        }

    }
});

electron.app.bindAppEvents = function (app, events) {
    app.on("window-all-closed", events.onAllWindowsClosed.fire);
    app.on("ready", events.onReady.fire);
};

electron.app.quitIfNotMac = function (app) {
    // On the Macintosh, in contrast to Linux and Windows,
    // applications should not quit when all their windows have been closed.
    if (process.platform !== "darwin") {
        app.quit();
    }
};

electron.app.setCommandLineSwitches = function (app, commandLineSwitches) {
    fluid.each(commandLineSwitches, function (value, switchName) {
        if (value === null) {
            app.commandLine.appendSwitch(switchName);
        } else {
            app.commandLine.appendSwitch(switchName, value);
        }
    });
};
