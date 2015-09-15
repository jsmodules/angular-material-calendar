/* eslint-env node */
exports.config = {
    specs: [ "test/**/*.spec.js" ],
    seleniumServerJar: "./node_modules/protractor/selenium/selenium-server-standalone-2.45.0.jar",
    // seleniumAddress: "http://localhost:4444/wd/hub",
    multiCapabilities: [
      {"browserName": "chrome"},
      {"browserName": "firefox"}
    ],
    baseUrl: "http://localhost:3000/index.html",
    jasmineNodeOpts: {
        showColors: true
    }
};
