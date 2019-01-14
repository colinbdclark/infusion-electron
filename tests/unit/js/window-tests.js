/*
Infusion-Electron Window Tests
Copyright 2019 Colin Clark

Licensed under the 3-Clause "New" BSD license.
You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the 3-Clause "New" BSD License at
https://github.com/colinbdclark/infusion-electron/raw/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    jqUnit = require("node-jqunit"),
    electron = fluid.registerNamespace("electron");

fluid.require("%infusion-electron/tests/unit/js/utils/test-app.js");
fluid.require("%infusion-electron/tests/unit/js/utils/test-window.js");

fluid.defaults("electron.tests.windowTestEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],

    components: {
        app: {
            type: "electron.tests.testApp",
            options: {
                components: {
                    windough: {
                        createOnEvent: "onReady",
                        type: "electron.tests.testWindow"
                    }
                }
            }
        },

        tester: {
            type: "electron.tests.windowTester"
        }
    }
});

fluid.defaults("electron.tests.windowTester", {
    gradeNames: "fluid.test.testCaseHolder",

    modules: [
        {
            name: "Window creation tests",
            tests: [
                {
                    expect: 1,
                    name: "Bounds",
                    sequence: [
                        {
                            event: "{app windough}.events.afterShow",
                            listener: "electron.tests.windowTester.bounds",
                            args: ["{app}.windough"]
                        }
                    ]
                },
                {
                    expect: 1,
                    name: "Title",
                    sequence: [
                        {
                            funcName: "electron.tests.windowTester.title",
                            args: ["{app}.windough"]
                        }
                    ]
                }
            ]
        },
        {
            name: "Modelized bounds changes",
            tests: [
                {
                    expect: 1,
                    name: "Width",
                    sequence: [
                        {
                            funcName: "electron.tests.windowTester.updateModel",
                            args: [
                                "{app}.windough",
                                "bounds.width",
                                500
                            ]
                        },
                        {
                            funcName: "electron.tests.windowTester.bounds",
                            args: ["{app}.windough"]
                        }
                    ]
                },
                {
                    expect: 1,
                    name: "Entire bounds",
                    sequence: [
                        {
                            funcName: "electron.tests.windowTester.updateModel",
                            args: [
                                "{app}.windough",
                                "bounds",
                                {
                                    width: 700,
                                    height: 500,
                                    x: 200,
                                    y: 200
                                }
                            ]
                        },
                        {
                            funcName: "electron.tests.windowTester.bounds",
                            args: ["{app}.windough"]
                        }
                    ]
                }
            ]
        }
    ]
});

electron.tests.windowTester.bounds = function (windough) {
    jqUnit.assertDeepEq("The window bounds correspond with model",
        windough.model.bounds, windough.win.getBounds());
};

electron.tests.windowTester.title = function (windough) {
    jqUnit.assertEquals("The title corresponds with windowOptions",
        windough.options.windowOptions.title, windough.win.getTitle());
};

electron.tests.windowTester.updateModel = function (windough, path, width) {
    windough.applier.change(path, width);
};

// TODO: Need tests for not showing a window when it's ready.
fluid.test.runTests("electron.tests.windowTestEnvironment");
