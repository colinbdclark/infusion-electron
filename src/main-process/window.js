/*
Infusion-Electron Window
Copyright 2015-2019 Colin Clark

Licensed under the 3-Clause "New" BSD license.
You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the 3-Clause "New" BSD License at
https://github.com/colinbdclark/infusion-electron/raw/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    electron = fluid.registerNamespace("electron"),
    BrowserWindow = electron.module.BrowserWindow;

fluid.defaults("electron.browserWindow", {
    gradeNames: "fluid.modelComponent",

    showOnCreate: false,
    showOnReady: true,

    windowOptions: {
        webPreferences: {
            nodeIntegration: false,
            contextIsolation: true
        },

        show: "{that}.options.showOnCreate",

        width: 100,
        height: 100,
        x: 0,
        y: 0
    },

    members: {
        win: {
            expander: {
                funcName: "electron.browserWindow.create",
                args: ["{that}.options.windowOptions"]
            }
        }
    },

    model: {
        bounds: {
            height: "{that}.options.windowOptions.height",
            width: "{that}.options.windowOptions.width",
            x: "{that}.options.windowOptions.x",
            y: "{that}.options.windowOptions.y"
        },

        url: "",

        isShowing: false
    },

    modelListeners: {
        "bounds": {
            "this": "{that}.win",
            method: "setBounds",
            args: ["{that}.model.bounds"]
        },

        "url": {
            "this": "{that}.win",
            method: "loadURL",
            args: "{change}.value"
        },

        "isShowing": {
            funcName: "electron.browserWindow.updateShowing",
            args: ["{that}.win", "{change}"]
        }
    },

    events: {
        onReadyToShow: null,
        afterShow: null,
        afterHide: null,
        afterResize: null,
        onClose: null
    },

    listeners: {
        "onCreate.bindOnReadyToShow": {
            "this": "{that}.win",
            method: "on",
            args: [
                "ready-to-show",
                "{that}.events.onReadyToShow.fire"
            ]
        },

        "onCreate.bindAfterShow": {
            "this": "{that}.win",
            method: "on",
            args: [
                "show",
                "{that}.events.afterShow.fire"
            ]
        },

        "onCreate.bindAfterHide": {
            "this": "{that}.win",
            method: "on",
            args: [
                "hide",
                "{that}.events.afterHide.fire"
            ]
        },

        "onCreate.bindAfterResize": {
            "this": "{that}.win",
            method: "on",
            args: [
                "resize",
                "{that}.events.afterResize.fire"
            ]
        },

        "onCreate.bindOnClose": {
            "this": "{that}.win",
            method: "on",
            args: [
                "close",
                "{that}.events.onClose.fire"
            ]
        },

        "onReadyToShow.show": {
            funcName: "electron.browserWindow.showOnReady",
            args: ["{that}"]
        },

        "onDestroy.destroyWindow": {
            "this": "{that}.win",
            method: "destroy"
        }
    }
});

electron.browserWindow.create = function (windowOptions) {
    return new BrowserWindow(windowOptions);
};

electron.browserWindow.updateShowing = function (win, change) {
    if (change.value) {
        win.show();
    } else if (change.oldValue) {
        // Only hide if the window was previously showing.
        win.hide();
    }
};

electron.browserWindow.showOnReady = function (that) {
    if (that.options.showOnReady) {
        that.applier.change("isShowing", true);
    }
};

fluid.defaults("electron.unthrottledWindow", {
    gradeNames: "electron.browserWindow",

    windowOptions: {
        "web-preferences": {
            "page-visibility": true
        }
    }
});


fluid.defaults("electron.ipcWindow", {
    gradeNames: [
        "electron.ipcComponent",
        "electron.browserWindow"
    ],

    members: {
        source: electron.module.ipcMain,
        target: "{that}.win.webContents"
    }
});
