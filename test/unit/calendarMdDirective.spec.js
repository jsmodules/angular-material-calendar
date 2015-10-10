/* eslint-env jasmine */
/* global inject, module */
describe("calendar service", function() {

    var $compile;
    var $rootScope;
    var $httpBackend;
    var customTemplateUrl = "/a/custom/template";
    var customTemplateContents = "<p>This is a custom template loaded via $http</p>";

    beforeEach(module("materialCalendar"));

    beforeEach(inject(function($injector) {

        $compile = $injector.get("$compile");
        $rootScope = $injector.get("$rootScope");
        $httpBackend = $injector.get("$httpBackend");
        $httpBackend
            .when("GET", customTemplateUrl)
            .respond(customTemplateContents);

    }));

    it("should fetch dynamic templates from external urls", function() {

        $httpBackend.expectGET(customTemplateUrl);

        var element = $compile("<calendar-md template-url='\"" + customTemplateUrl + "\"'></calendar-md>")($rootScope);

        $rootScope.$digest();
        $httpBackend.flush();

        expect(element.html()).toContain(customTemplateContents);

    });

    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

});
