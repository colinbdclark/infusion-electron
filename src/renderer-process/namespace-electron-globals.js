/*
Infusion-Electron Window
Copyright 2019 Colin Clark

Licensed under the 3-Clause "New" BSD license.
You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the 3-Clause "New" BSD License at
https://github.com/colinbdclark/infusion-electron/raw/master/LICENSE.txt
*/

"use strict";

/**
 * Namespaces Electron's nodeIntegration globals so that AMD-aware
 * scripts such as jQuery don't get tripped up by their presence.
 */
window.electron = {
    nodeIntegration: {
        require: window.require,
        define: window.define,
        module: window.module
    }
};

delete window.require;
delete window.define;
delete window.module;
