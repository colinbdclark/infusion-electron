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

/**
 * A promise that resolves when the Electron app is ready.
 * Required for testing multiple configs of an app.
 */
electron.appReady = fluid.promise();

/**
 * Listens for the electron 'ready' event and resolves the
 * global appReady promise accordingly.
 */
electron.appReadyListener = function (launchInfo) {
    electron.appReady.resolve(launchInfo);
};

/**
 * Invokes the passed function when the Electron app is ready.
 * @param {Function} fireFn - The function to be invoked.
 */
electron.fireAppReady = function (fireFn) {
    electron.appReady.then(fireFn);
};

/**
 * A global reference to Electron's app instance singleton.
 */
electron.appSingleton = electronModule.app;

electron.appSingleton.on("ready", electron.appReadyListener);

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

        "onCreate.bindOnReady": {
            funcName: "electron.fireAppReady",
            args: ["{that}.events.onReady.fire"]
        },

        "onCreate.bindOnAllWindowsClosed": {
            "this": "{that}.app",
            method: "on",
            args: [
                "window-all-closed",
                "{that}.events.onAllWindowsClosed.fire"
            ]
        },

        "onAllWindowsClosed.quitIfNotMac": {
            funcName: "electron.app.quitIfNotMac",
            args: "{that}.app"
        }
    }
});

electron.app.quitIfNotMac = function (app) {
    // On the Macintosh, in contrast to Linux and Windows,
    // applications should not quit when all their windows have been closed.
    if (process.platform !== "darwin") {
        app.quit();
    }
};

// TODO: Will need a mock app to test this function, because
// Electron's API won't allow us to see the commandLine's state.
electron.app.setCommandLineSwitches = function (app, commandLineSwitches) {
    fluid.each(commandLineSwitches, function (value, switchName) {
        if (value === null) {
            app.commandLine.appendSwitch(switchName);
        } else {
            app.commandLine.appendSwitch(switchName, value);
        }
    });
};

fluid.defaults("electron.app.dontQuitOnAllWindowsClosed", {
    listeners: {
        // Overrides the default behaviour of electron.app,
        // where, on Windows and Linux, the app will quit itself if
        // all its BrowserWindows are closed.
        // This grade can be helpful for testing or in application that
        // should stay alive until explicitly quit by the user.
        "onAllWindowsClosed.quitIfNotMac": {
            funcName: "fluid.identity",
            args: []
        }
    }
});
