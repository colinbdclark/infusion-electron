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
    electronModule = require("electron"),
    BrowserWindow = electronModule.BrowserWindow,
    $ = fluid.registerNamespace("jQuery"),
    electron = fluid.registerNamespace("electron");

fluid.defaults("electron.browserWindow", {
    gradeNames: "fluid.modelComponent",

    showOnCreate: false,
    showOnReady: true,

    windowOptions: {
        webPreferences: {
            nodeIntegration: false
        },

        // These are the window's initial size only;
        // the bounds of the window will be updated when the
        // component's model initializes.
        width: 0,
        height: 0
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
            x: 0,
            y: 0,
            width: 0,
            height: 0
        },

        url: "",

        isVisible: false
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

        "isVisible": {
            funcName: "electron.browserWindow.updateVisibility",
            args: ["{that}.win", "{change}.value"]
        }
    },

    events: {
        onReadyToShow: null,
        onClose: null
    },

    listeners: {
        "onCreate.setVisibility": {
            changePath: "isVisible",
            value: "{that}.options.showOnCreate"
        },

        "onCreate.bindOnClose": {
            "this": "{that}.win",
            method: "on",
            args: ["close", "{that}.events.onClose.fire"]
        },

        "onCreate.bindOnReadyToShow": {
            "this": "{that}.win",
            method: "on",
            args: ["ready-to-show", "{that}.events.onReadyToShow.fire"]
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

electron.browserWindow.updateVisibility = function (win, isVisible) {
    if (isVisible) {
        win.show();
    } else {
        win.hide();
    }
};

electron.browserWindow.showOnReady = function (that) {
    if (that.options.showOnReady) {
        that.applier.change("isVisible", true);
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
