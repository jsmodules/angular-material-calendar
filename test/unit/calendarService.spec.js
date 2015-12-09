/* eslint-env jasmine */
/* global inject, module */
describe("calendar service", function() {

    var Calendar;
    var sameDay = function(src, dst) {
        return angular.equals(src.getFullYear(), dst.getFullYear())
            && angular.equals(src.getMonth(), dst.getMonth())
            && angular.equals(src.getDate(), dst.getDate());
    };

    beforeEach(module("materialCalendar"));

    beforeEach(inject(["materialCalendar.Calendar", function(_Calendar_){
        Calendar = new _Calendar_();
    }]));

    it("should have all public methods defined", function() {
        expect(Calendar).toBeDefined();
        expect(typeof Calendar.setWeekStartsOn).toBe("function");
        expect(typeof Calendar.next).toBe("function");
        expect(typeof Calendar.prev).toBe("function");
        expect(typeof Calendar.init).toBe("function");
    });

    it("should have all public variables with proper type", function() {
        expect(angular.isObject(Calendar.options)).toBe(true);
        expect(angular.isNumber(Calendar.year)).toBe(true);
        expect(angular.isNumber(Calendar.month)).toBe(true);
        expect(angular.isNumber(Calendar.weekStartsOn)).toBe(true);
        expect(angular.isArray(Calendar.weeks)).toBe(true);
    });

    it("should start with the correct dates in February 2015", function() {
        Calendar.init(2015, 1);
        expect(sameDay(Calendar.start, new Date(2015, 1, 1))).toBe(true);
        expect(sameDay(Calendar.weeks[0][0], new Date(2015, 1, 1))).toBe(true);
    });

    it("should contain the correct number of weeks in February 2015", function() {
        Calendar.init(2015, 1);
        expect(Calendar.weeks.length).toBe(4);
    });

    it("should end with the correct date in February 2015", function() {
        Calendar.init(2015, 1);
        expect(sameDay(Calendar.weeks[Calendar.weeks.length-1][6], new Date(2015, 1, 28))).toBe(true);
    });

    it("should start with the correct dates in October 2015", function() {
        Calendar.init(2015, 9);
        expect(sameDay(Calendar.start, new Date(2015, 9, 1))).toBe(true);
        expect(sameDay(Calendar.weeks[0][0], new Date(2015, 8, 27))).toBe(true);
    });

    it("should end with the correct date in October 2015", function() {
        Calendar.init(2015, 9);
        expect(sameDay(Calendar.weeks[Calendar.weeks.length-1][6], new Date(2015, 9, 31))).toBe(true);
    });

    it("should contain the correct number of weeks in October 2015", function() {
        Calendar.init(2015, 9);
        expect(Calendar.weeks.length).toBe(5);
    });

    it("should start with the correct dates in November 2015", function() {
        Calendar.init(2015, 10);
        expect(sameDay(Calendar.start, new Date(2015, 10, 1))).toBe(true);
        expect(sameDay(Calendar.weeks[0][0], new Date(2015, 10, 1))).toBe(true);
    });

    it("should contain the correct number of weeks in November 2015", function() {
        Calendar.init(2015, 10);
        expect(Calendar.weeks.length).toBe(5);
    });

    it("should start with the correct dates in July 2016", function() {
        Calendar.init(2016, 6);
        expect(sameDay(Calendar.start, new Date(2016, 6, 1))).toBe(true);
        expect(sameDay(Calendar.weeks[0][0], new Date(2016, 5, 26))).toBe(true);
    });

    it("should contain the correct number of weeks in November 2015", function() {
        Calendar.init(2016, 6);
        expect(Calendar.weeks.length).toBe(6);
    });

    it("should start with the correct dates in March 2017", function() {
        Calendar.init(2017, 2);
        expect(sameDay(Calendar.start, new Date(2017, 2, 1))).toBe(true);
        expect(sameDay(Calendar.weeks[0][0], new Date(2017, 1, 26))).toBe(true);
    });

    it("should start with the correct dates in April 2018", function() {
        Calendar.init(2018, 3);
        expect(sameDay(Calendar.start, new Date(2018, 3, 1))).toBe(true);
        expect(sameDay(Calendar.weeks[0][0], new Date(2018, 3, 1))).toBe(true);
    });

    it("should move to from November 2015 to December 2015 on next", function() {
        Calendar.init(2015, 10);
        expect(sameDay(Calendar.start, new Date(2015, 10, 1))).toBe(true);
        expect(sameDay(Calendar.weeks[0][0], new Date(2015, 10, 1))).toBe(true);
        Calendar.next();
        expect(sameDay(Calendar.start, new Date(2015, 11, 1))).toBe(true);
        expect(sameDay(Calendar.weeks[0][0], new Date(2015, 10, 29))).toBe(true);
    });

    it("should move to from December 2015 to January 2016 on next", function() {
        Calendar.init(2015, 11);
        expect(sameDay(Calendar.start, new Date(2015, 11, 1))).toBe(true);
        expect(sameDay(Calendar.weeks[0][0], new Date(2015, 10, 29))).toBe(true);
        Calendar.next();
        expect(sameDay(Calendar.start, new Date(2016, 0, 1))).toBe(true);
        expect(sameDay(Calendar.weeks[0][0], new Date(2015, 11, 27))).toBe(true);
    });

    it("should move to from January 2016 to December 2015 on prev", function() {
        Calendar.init(2016, 0);
        expect(sameDay(Calendar.start, new Date(2016, 0, 1))).toBe(true);
        expect(sameDay(Calendar.weeks[0][0], new Date(2015, 11, 27))).toBe(true);
        Calendar.prev();
        expect(sameDay(Calendar.start, new Date(2015, 11, 1))).toBe(true);
        expect(sameDay(Calendar.weeks[0][0], new Date(2015, 10, 29))).toBe(true);
    });

});
