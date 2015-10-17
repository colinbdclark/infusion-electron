/*
Copyright 2015 Colin Clark

Licensed under the 3-Clause "New" BSD license.
You may not use this file except in compliance with one these
Licenses.

You may obtain a copy of the 3-Clause "New" BSD License at
https://github.com/colinbdclark/infusion-electron/raw/master/LICENSE.txt
*/

module.exports = function(grunt) {
    "use strict";

    grunt.initConfig({
        jshint: {
            all: ["src/**/*.js"],
            buildScripts: ["Gruntfile.js"],
            options: {
                jshintrc: true
            }
        }
    });

    grunt.loadNpmTasks("grunt-contrib-jshint");

    grunt.registerTask("lint", "Apply jshint", ["jshint"]);
    grunt.registerTask("default", ["jshint"]);
};
