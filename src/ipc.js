/*
Copyright 2015 Colin Clark

Licensed under the 3-Clause "New" BSD license.
You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the 3-Clause "New" BSD License at
https://github.com/colinbdclark/infusion-electron/raw/master/LICENSE.txt
*/

// Note: This file is intended to be run in both Node.js
// and in Electron BrowserWindows, hence the additional
// boilerplate typically only used in browser-facing scripts.
var fluid = fluid || require("infusion");

(function () {
    "use strict";

    var electron = fluid.registerNamespace("electron");

    electron.ipc = require("electron").ipcMain;

    electron.ipcSender = function (channel, target) {
        var args = [channel];

        return function () {
            var len = arguments.length + 1;
            args.length = len;
            for (var i = 1; i < len; i++) {
                args[i] = arguments[i - 1];
            }

            if (target) {
                target.send.apply(target, args);
            }
        };
    };

    fluid.defaults("electron.ipcComponent", {
        gradeNames: "fluid.component",

        channel: "message", // User-specified.

        members: {
            ipc: electron.ipc,
            source: electron.ipc,
            target: electron.ipc,
            sender: "@expand:electron.ipcSender({that}.options.channel, {that}.target)"
        },

        invokers: {
            /**
             * Sends an IPC message to the target on
             * the channel specified in the component's "channel" option.
             */
            send: {
                func: "{that}.sender"
            },

            /**
             * Starts listening to IPC messages from the source object.
             */
            start: {
                "this": "{that}.source",
                method: "on",
                args: ["{that}.options.channel", "{that}.events.onMessage.fire"]
            },

            /**
             * Stops listening to IPC messages from the source object.
             */
            stop: {
                "this": "{that}.source",
                method: "removeListener",
                args: ["{that}.options.channel", "{that}.events.onMessage.fire"]
            }
        },

        events: {
            onMessage: null
        },

        listeners: {
            "onCreate.startRelaying": [
                "{that}.start()"
            ],

            "onDestroy.stopRelaying": [
                "{that}.stop()"
            ]
        }
    });

    fluid.defaults("electron.ipcMessageRelayer", {
        gradeNames: ["electron.ipcComponent", "fluid.modelComponent"],

        listeners: {
            onMessage: [
                {
                    func: "{that}.send"
                }
            ]
        }
    });
}());
