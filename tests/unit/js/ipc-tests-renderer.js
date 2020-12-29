fluid.defaults("electron.tests.ipcListenerResponder", {
    gradeNames: "fluid.component",

    components: {
        ipc: {
            type: "electron.rendererIPC",
            options: {
                channel: "test",
                listeners: {
                    "onMessage.respond": {
                        funcName: "electron.tests.ipcListenerResponder.respond",
                        args: ["{that}", "{arguments}.1"]
                    }
                }
            }
        }
    },

    listeners: {
        "onCreate.sendMessage": {
            func: "{that}.ipc.send",
            args: ["from renderer"]
        }
    }
});

electron.tests.ipcListenerResponder.respond = function (that, message) {
    if (message === "from main") {
        that.send("from renderer");
    } else {
        throw new Error("An unrecognized message was received from the main process.", message);
    }
};
