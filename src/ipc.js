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

    electron.ipc = require("ipc");

    electron.ipcSender = function (channel, target) {
        var args = [channel];

        return function () {
            var len = arguments.length + 1;
            args.length = len;
            for (var i = 1; i < len; i++) {
                args[i] = arguments[i - 1];
            }

            // TODO: This will cause an error if "target"
            // is a window that has already been closed.
            // This needs to be fixed.
            if (target) {
                target.send.apply(target, args);
            }
        };
    };

    electron.ipcRelay = function (channel, target) {
        electron.ipc.on(channel, electron.ipcSender(channel, target));
    };


    fluid.defaults("electron.ipcComponent", {
        gradeNames: "fluid.component",

        channel: "message", // User-specified.

        members: {
            ipc: electron.ipc,
            target: "{that}.ipc",
            sender: "@expand:electron.ipcSender({that}.options.channel, {that}.target)"
        },

        invokers: {
            send: {
                func: "{that}.sender"
            }
        },

        events: {
            onMessage: null
        },

        listeners: {
            onCreate: [
                {
                    "this": "{that}.ipc",
                    method: "on",
                    args: ["{that}.options.channel", "{that}.events.onMessage.fire"]
                }
            ]
        }
    });
}());
