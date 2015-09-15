/* eslint-env node */
exports.config = {
    specs: [ "test/**/*.spec.js" ],
    multiCapabilities: [
      {"browserName": "chrome"},
      {"browserName": "firefox"}
    ],
    baseUrl: "http://localhost:3000/index.html",
    jasmineNodeOpts: {
        showColors: true
    }
};
