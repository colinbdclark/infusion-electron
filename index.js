/*
Copyright 2015 Colin Clark

Licensed under the 3-Clause "New" BSD license.
You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the 3-Clause "New" BSD License at
https://github.com/colinbdclark/infusion-electron/raw/master/LICENSE.txt
*/

"use strict";

var fluid = require("infusion");

var electron = fluid.registerNamespace("electron");
fluid.module.register("electron", __dirname, require);

require("./src/core.js");
require("./src/ipc.js");
require("./src/main-process/app.js");
require("./src/main-process/window.js");

module.exports = electron;
