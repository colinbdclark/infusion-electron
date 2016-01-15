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
    BrowserWindow = require("browser-window"),
    $ = fluid.registerNamespace("jQuery"),
    electron = fluid.registerNamespace("electron");

fluid.defaults("electron.browserWindow", {
    gradeNames: "fluid.modelComponent",

    showOnCreate: true,

    windowOptions: {},

    members: {
        win: "@expand:electron.browserWindow.create({that}.options.windowOptions)"
    },

    model: {
        dimensions: {
            width: 0,
            height: 0
        },

        url: "",

        isVisible: false
    },

    modelListeners: {
        "dimensions": {
            "this": "{that}.win",
            method: "setSize",
            args: ["{that}.model.dimensions.width", "{that}.model.dimensions.height"]
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
        onClose: null
    },

    listeners: {
        onCreate: [
            {
                changePath: "isVisible",
                value: "{that}.options.showOnCreate"
            },
            {
                "this": "{that}.win",
                method: "on",
                args: ["close", "{that}.events.onClose.fire"]
            }
        ],

        onDestroy: [
            {
                "this": "{that}.win",
                method: "destroy"
            }
        ]
    }
});

electron.browserWindow.create = function (windowOptions) {
    // The window size will always be initially be zero,
    // and when the model initializes, its dimensions will be updated.
    var o = $.extend(true, {}, windowOptions, {
        width: 0,
        height: 0
    });

    return new BrowserWindow(o);
};

electron.browserWindow.updateVisibility = function (win, isVisible) {
    if (isVisible) {
        win.show();
    } else {
        win.hide();
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
