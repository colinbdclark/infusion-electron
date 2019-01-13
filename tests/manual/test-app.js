/*
Copyright 2019 Colin Clark

Licensed under the 3-Clause "New" BSD license.
You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the 3-Clause "New" BSD License at
https://github.com/colinbdclark/infusion-electron/raw/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    electron = require("infusion-electron");

fluid.defaults("electronTest.app", {
    gradeNames: "electron.app",

    components: {
        mainWindow: {
            createOnEvent: "onReady",
            type: "electron.browserWindow",
            options: {
                showOnCreate: false,
                showOnReady: true,

                windowOptions: {
                    title: "infusion-electron Manual Test Window"
                },

                model: {
                    url: {
                        expander: {
                            funcName: "fluid.stringTemplate",
                            args: ["%url/src/client/html/main-window.html", "{app}.env.appRoot"]
                        }
                    },

                    bounds: {
                        width: 720,
                        height: 480
                    }
                }
            }
        }
    }
});
