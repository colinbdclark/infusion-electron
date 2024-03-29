# infusion-electron

Infusion-Electron is a collection of [Fluid Infusion](https://github.com/fluid-project/infusion)
components that make it easier to use [Electron](https://github.com/electron/electron).

## Using infusion-electron

1. Declare dependencies on Infusion and <code>infusion-electron</code> in your application's <code>package.json</code> file:

    {
        "name": "my-infusion-electron-app",
        "dependencies": {
            "infusion": "2.0.0",
            "infusion-electron": "0.4.0"
        }
    }

2. <code>require()</code> Infusion and infusion-electron:

    var fluid = require("infusion");
    require("infusion-electron");

3. Define your application component. Windows can be child components of your app:

    fluid.defaults("myapp.app", {
        gradeNames: "electron.app",

        commandLineSwitches: {
            "disable-renderer-backgrounding": null
        },

        components: {
            mainWindow: {
                createOnEvent: "onReady",
                type: "electron.browserWindow",
                options: {
                    width: 1920,
                    height: 1080,
                    url: "html/main-window.html"
                }
            },
        }
    });

## Attribution and License

This library was written by Colin Clark and is distributed under the "new" BSD 3-clause license.
