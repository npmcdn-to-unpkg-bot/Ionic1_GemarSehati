var app = {
    onDeviceReady: function() {
        batch.setConfig({"androidAPIKey":"DEV56CBFB6BBE3411F544B30608A28",
            "iOSAPIKey":"<YOUR IOS APIKEY>"});
        batch.start();
    }
};