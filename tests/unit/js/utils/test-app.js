/*
Infusion-Electron Test App
Copyright 2019 Colin Clark

Licensed under the 3-Clause "New" BSD license.
You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the 3-Clause "New" BSD License at
https://github.com/colinbdclark/infusion-electron/raw/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion"),
    electron = fluid.registerNamespace("electron");

fluid.defaults("electron.tests.testApp", {
    gradeNames: "electron.app"
});
