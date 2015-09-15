/* eslint-env node */
exports.config = {
    specs: [ "test/**/*.spec.js" ],
    seleniumAddress: "http://localhost:4444/wd/hub",
    baseUrl: "http://localhost:3000/index.html",
    capabilities: {
        browserName: "phantomjs",
        version: "",
        platform: "ANY"
    },
    jasmineNodeOpts: {
        showColors: true
    }
};
