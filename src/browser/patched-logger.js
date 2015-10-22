/*
Copyright 2015 Colin Clark

Licensed under the 3-Clause "New" BSD license.
You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the 3-Clause "New" BSD License at
https://github.com/colinbdclark/infusion-electron/raw/master/LICENSE.txt
*/

/*global fluid*/

var electron = electron || {};

(function () {
    "use strict";

    electron.renderLoggingArgs = function (args) {
        var renderedArgs = fluid.transform(args, function (arg) {
            return fluid.renderLoggingArg(arg);
        });

        return renderedArgs.join(" ");
    };

    // Monkey-patch fluid.log for Electron's broken console.log
    // when logs from a Chromium process are printed to
    // the main thread's console.
    // Electron's implementation only prints out the first argument:
    // https://github.com/atom/electron/issues/1368
    fluid.doLog = function (args) {
        if (typeof (console) !== "undefined") {
            var logArg = electron.renderLoggingArgs(args);

            if (console.debug) {
                console.debug(logArg);
            } else if (typeof (console.log) === "function") {
                console.log(logArg);
            }
        }
    };
}());
