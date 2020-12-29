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
fluid.require("%infusion-electron/tests/unit/js/utils/ipc-test-window.js");

fluid.defaults("electron.tests.ipcTestEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],

    components: {
        app: {
            type: "electron.tests.testApp",
            options: {
                components: {
                    windough: {
                        createOnEvent: "onReady",
                        type: "electron.tests.ipcTestWindow",
                        options: {
                            listeners: {
                                onMessage: {
                                    "this": "console",
                                    method: "log",
                                    args: ["message received", "{arguments}.1"]
                                }
                            }
                        }
                    }
                }
            }
        },

        tester: {
            type: "electron.tests.ipcTester"
        }
    },

    events: {
        onCreateApp: null
    }
});


fluid.defaults("electron.tests.ipcTester", {
    gradeNames: "fluid.test.testCaseHolder",

    modules: [
        {
            name: "Sending IPC messages",
            tests: [
                {
                    expect: 4,
                    name: "Respond to message from window",
                    sequence: [

                        {
                            event: "{app windough}.events.onMessage",
                            listener: "electron.tests.ipcTester.testMessageResponse",
                            args: ["{arguments}.1"]
                        },

                        {
                            event: "{app windough}.events.afterShow",
                            listener: "electron.tests.ipcTester.checkIPCHasSourceTarget",
                            args: ["{app}"]
                        },

                        // Can't directly use an IoC reference to a
                        // createOnEvent component in a listener
                        // with the current IoC testing framework.
                        // https://issues.fluidproject.org/browse/FLUID-6405
                        {
                            funcName: "electron.tests.ipcTester.sendMessage",
                            args: ["{app}", "from main"]
                        },

                        {
                            event: "{app windough}.events.onMessage",
                            listener: "electron.tests.ipcTester.testMessageResponse",
                            args: ["{arguments}.1"]
                        }
                    ]
                }
            ]
        }
    ]
});

electron.tests.ipcTester.checkIPCHasSourceTarget = function (app) {
    jqUnit.assertEquals("The window should have been set up with the correct IPC source.", require("electron").ipcMain, app.windough.source);

    jqUnit.assertEquals("The window should have been set up with the correct IPC target.", app.windough.win.webContents, app.windough.target);
};

electron.tests.ipcTester.sendMessage = function (app, message) {
    app.windough.send(message);
};

electron.tests.ipcTester.testMessageResponse = function (response) {
    jqUnit.assertEquals("The window should send an IPC message.", "from renderer", response);
};

fluid.test.runTests("electron.tests.ipcTestEnvironment");
