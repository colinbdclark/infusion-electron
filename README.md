infusion-electron
=================

Infusion-Electron is a collection of [Fluid Infusion](https://github.com/fluid-project/infusion) components that make it easier to use [Atom Electron](https://github.com/atom/electron).

Using Infusion-Electron
-----------------------

### Deduplicating Infusion

Fluid Infusion requires that a single instance of its module be loaded per Node.js application. To ensure that you don't have multiple copies of Infusion installed, you'll need to use the [dedupe-infusion](https://github.com/fluid-project/dedupe-infusion) after installing (or prior to running) your application. Here's how:

In your <code>package.json</code>, you'll need to declare a dependency on <code>dedupe-infusion</code>:

    {
        "dependencies": {
            "dedupe-infusion": "1.0.0"
        }
    }

And you'll also want to include a script that takes care of deduplicating after installation. Please note that npm's postinstall scripts are susceptible to race conditions and aren't appropriate for this task.

    {
        "scripts": {
            "dedupe-infusion": "node -e \"require('dedupe-infusion')()\"",
            "fullinstall": "npm install && npm run dedupe-infusion"
        }
    }

To install your application, you can run:

    npm run fullinstall

Attribution and License
-----------------------

This library was written by Colin Clark and is distributed under the "new" BSD 3-clause license.
