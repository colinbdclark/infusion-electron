/*
Copyright 2015 Colin Clark

Licensed under the 3-Clause "New" BSD license.
You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the 3-Clause "New" BSD License at
https://github.com/colinbdclark/infusion-electron/raw/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    electron = fluid.registerNamespace("electron");

// Monkey-patch fluid.log for Electron's broken console.log.
fluid.doLog = function (args) {
    if (typeof (console) !== "undefined") {
        if (console.debug) {
            console.debug(args.join(" "));
        } else if (typeof (console.log) === "function") {
            console.log(args.join(" "));
        }
    }
};


fluid.defaults("electron.app", {
    gradeNames: "fluid.modelComponent",

    members: {
        app: require("app")
    },

    commandLineSwitches: {},

    env: {
        appRoot: "@expand:electron.app.getRootPath()"
    },

    windowListeners: {
        "onClose": "electron.app.quitOnAllClosed()"
    },

    events: {
        onReady: null,
        onAllWindowsClosed: null
    },

    listeners: {
        onCreate: [
            {
                funcName: "electron.app.setCommandLineSwitches",
                args: ["{that}.app", "{that}.options.commandLineSwitches"]
            },
            {
                "this": "{that}.app",
                method: "on",
                args: ["window-all-closed", "{that}.events.onAllWindowsClosed.fire"]
            },
            {
                "this": "{that}.app",
                method: "on",
                args: ["ready", "{that}.events.onReady.fire"]
            }
        ],

        onAllWindowsClosed: [
            "electron.app.handleAllWindowsClosed({that}.app)"
        ]
    }
});

electron.app.handleAllWindowsClosed = function (app) {
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

electron.app.getRootPath = function () {
    return "file://" + process.cwd();
};
