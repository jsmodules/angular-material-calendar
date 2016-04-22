/* eslint-env node */
exports.config = {
    specs: [ "test/e2e/**/*.spec.js" ],
    seleniumServerJar: "./node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar",
    // seleniumAddress: 'http://localhost:4444/wd/hub',
    multiCapabilities: [
      {"browserName": "chrome"}
    ],
    baseUrl: "http://localhost:3000/index.html",
    jasmineNodeOpts: {
        showColors: true
    }
};
