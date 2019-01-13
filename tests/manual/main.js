/*
Copyright 2019 Colin Clark

Licensed under the 3-Clause "New" BSD license.
You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the 3-Clause "New" BSD License at
https://github.com/colinbdclark/infusion-electron/raw/master/LICENSE.txt
*/
var fluid = require("infusion");
require("./test-app.js");

var electronTest = fluid.registerNamespace("electronTest");
electronTest.app();
