/* eslint-env jasmine */
/* global inject, module */
describe("calendar service", function() {

    var $compile;
    var $rootScope;

    beforeEach(module("materialCalendar"));

    beforeEach(inject(function(_$compile_, _$rootScope_){
        $compile = _$compile_;
        $rootScope = _$rootScope_;
    }));

    xit("should be tested", function() {
        $compile("<calendar-md></calendar-md>")($rootScope);
        $rootScope.$digest();
    });

});
