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
                        // The window's afterShow event may fire
                        // synchronously before the sequence begins to
                        // bind to it. This may not be an issue
                        // once the potentia version of Infusion is
                        // ready, but in the meantime we have to
                        // manually trigger the construction of
                        // the app's window at the beginning of
                        // each sequence.
                        {
                            func: "{app}.events.onReady.fire"
                        },
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
                            func: "{app}.events.onReady.fire"
                        },
                        {
                            funcName: "electron.tests.windowTester.title",
                            args: ["{app}.windough"]
                        }
                    ]
                }
            ]
        },
        {
            name: "Model changes",
            tests: [
                {
                    expect: 2,
                    name: "Bounds",
                    sequence: [
                        {
                            func: "{app}.events.onReady.fire"
                        },
                        {
                            event: "{app windough}.events.afterShow",
                            listener: "electron.tests.windowTester.updateModel",
                            args: [
                                "{app}.windough",
                                "bounds.width",
                                500
                            ]
                        },
                        {
                            funcName: "electron.tests.windowTester.bounds",
                            args: ["{app}.windough"]
                        },
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
                },
                {
                    expect: 1,
                    name: "isShowing",
                    sequence: [
                        {
                            func: "{app}.events.onReady.fire"
                        },
                        {
                            event: "{app windough}.events.afterShow",
                            listener: "electron.tests.windowTester.updateModel",
                            args: [
                                "{app}.windough",
                                "isShowing",
                                false
                            ]
                        },
                        {
                            event: "{app windough}.events.afterHide",
                            listener: "electron.tests.windowTester.notShowing",
                            args: ["{app}.windough.win"]
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

electron.tests.windowTester.notShowing = function (win) {
    jqUnit.assertFalse("The window is not showing",
        win.isVisible());
};

electron.tests.windowTester.updateModel = function (windough, path, value) {
    windough.applier.change(path, value);
};

// TODO: Need tests for not showing a window when it's ready.
fluid.test.runTests("electron.tests.windowTestEnvironment");
