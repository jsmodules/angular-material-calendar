/* eslint-env jasmine */
/* global inject, module */
describe("calendar service", function() {

    var Calendar;

    beforeEach(module("materialCalendar"));

    beforeEach(inject(function(_Calendar_){
        Calendar = new _Calendar_();
    }));

    it("should have all public methods defined", function() {
        expect(Calendar).toBeDefined();
        expect(typeof Calendar.getNumDays).toBe("function");
        expect(typeof Calendar.setWeekStartsOn).toBe("function");
        expect(typeof Calendar.getFirstDayOfCalendar).toBe("function");
        expect(typeof Calendar.next).toBe("function");
        expect(typeof Calendar.prev).toBe("function");
        expect(typeof Calendar.init).toBe("function");
    });

    it("should have all public variables with proper type", function() {
        expect(angular.isObject(Calendar.options)).toBe(true);
        expect(angular.isNumber(Calendar.year)).toBe(true);
        expect(angular.isNumber(Calendar.month)).toBe(true);
        expect(angular.isNumber(Calendar.weekStartsOn)).toBe(true);
        expect(angular.isArray(Calendar.dates)).toBe(true);
    });

});
