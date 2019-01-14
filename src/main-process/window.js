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
    electron = fluid.registerNamespace("electron");

fluid.defaults("electron.browserWindow", {
    gradeNames: "fluid.modelComponent",

    showOnCreate: false,
    showOnReady: true,

    windowOptions: {
        webPreferences: {
            nodeIntegration: false
        },

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

    invokers: {
        show: {
            changePath: "isShowing",
            value: true
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
            args: ["{that}.win", "{change}.value"]
        }
    },

    events: {
        onReadyToShow: null,
        afterShow: null,
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

        "onCreate.setIsShowing": {
            priority: "after:bindAfterShow",
            changePath: "isShowing",
            value: "{that}.options.showOnCreate"
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

electron.browserWindow.updateShowing = function (win, isShowing) {
    if (isShowing) {
        win.show();
    } else {
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
