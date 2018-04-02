/*
Copyright 2015 Colin Clark

Licensed under the 3-Clause "New" BSD license.
You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the 3-Clause "New" BSD License at
https://github.com/colinbdclark/infusion-electron/raw/master/LICENSE.txt
*/

"use strict";

module.exports = function (grunt) {
    grunt.initConfig({
        eslint: {
            all: ["src/**/*.js"]
        }
    });

    grunt.loadNpmTasks("fluid-grunt-eslint");

    grunt.registerTask("lint", "Apply eslint", ["eslint"]);
    grunt.registerTask("default", ["eslint"]);
};
