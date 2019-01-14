/*
Infusion-Electron App Tests
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

fluid.loadTestingSupport();
fluid.require("%infusion-electron/tests/unit/js/utils/test-app.js");

fluid.defaults("electron.tests.appTestEnvironment", {
    gradeNames: ["fluid.test.testEnvironment"],

    components: {
        app: {
            type: "electron.tests.testApp"
        },

        tester: {
            type: "electron.tests.appTester"
        }
    }
});


fluid.defaults("electron.tests.appTester", {
    gradeNames: "fluid.test.testCaseHolder",

    modules: [
        {
            name: "App creation tests",
            tests: [
                {
                    expect: 2,
                    name: "App onReady",
                    sequence: [
                        {
                            event: "{app}.events.onReady",
                            listener: "electron.tests.appTester.onReady",
                            args: ["{app}"]
                        }
                    ]
                }
            ]
        }
    ]
});

electron.tests.appTester.onReady = function (app) {
    jqUnit.assertTrue("The app fired onReady and is ready",
        app.app.isReady());

    jqUnit.assertNotUndefined("The app has the Electron app singleton",
        app.app);
};

fluid.test.runTests("electron.tests.appTestEnvironment");
