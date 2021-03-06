/*
Infusion-Electron Test Window
Copyright 2019 Colin Clark

Licensed under the 3-Clause "New" BSD license.
You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the 3-Clause "New" BSD License at
https://github.com/colinbdclark/infusion-electron/raw/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");

fluid.defaults("electron.tests.testWindow", {
    gradeNames: "electron.browserWindow",

    showOnCreate: false,

    windowOptions: {
        title: "A Window for Testing",
        width: 800,
        height: 600,
        x: 50,
        y: 50,
        webPreferences: {
            devTools: true
        }
    },

    model: {
        url: {
            expander: {
                funcName: "fluid.stringTemplate",
                args: [
                    "%url/html/test-window.html",
                    "{app}.env.appRoot"
                ]
            }
        }
    }
});
