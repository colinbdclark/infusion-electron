/*
Infusion-Electron Common IPC
Copyright 2015-2019 Colin Clark

Licensed under the 3-Clause "New" BSD license.
You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the 3-Clause "New" BSD License at
https://github.com/colinbdclark/infusion-electron/raw/master/LICENSE.txt
*/

"use strict";

var fluid = fluid || require("infusion"),
    electron = fluid.registerNamespace("electron");

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
        source: undefined,
        target: "{that}.source",
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
        "onCreate.startListening": "{that}.start()",
        "onDestroy.stopListening": "{that}.stop()"
    }
});

fluid.defaults("electron.ipcMessageRelayer", {
    gradeNames: ["electron.ipcComponent", "fluid.modelComponent"],

    listeners: {
        "onMessage.relayToSource": {
            func: "{that}.send"
        }
    }
});
