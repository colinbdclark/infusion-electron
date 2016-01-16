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

electron.appSingleton = require("electron").app;

fluid.defaults("electron.app", {
    gradeNames: "fluid.modelComponent",

    commandLineSwitches: {},

    members: {
        app: electron.appSingleton,

        env: {
            appRootURL: "@expand:electron.getAppRootURL()"
        }
    },

    windowListeners: {
        "onClose": "electron.app.quitOnAllClosed()"
    },

    events: {
        onReady: null,
        onAllWindowsClosed: null
    },

    listeners: {
        "onCreate.setCommandLineSwitches": [
            {
                funcName: "electron.app.setCommandLineSwitches",
                args: ["{that}.app", "{that}.options.commandLineSwitches"]
            }
        ],

        "onCreate.bindAppEvents": [
            "electron.app.bindAppEvents({that}.app, {that}.events)"
        ],

        onAllWindowsClosed: [
            "electron.app.handleAllWindowsClosed({that}.app)"
        ]
    }
});

electron.app.bindAppEvents = function (app, events) {
    app.on("window-all-closed", events.onAllWindowsClosed.fire);
    app.on("ready", events.onReady.fire);
};

electron.app.handleAllWindowsClosed = function (app) {
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
