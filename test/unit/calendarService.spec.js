/* eslint-env jasmine */
/* global inject, module */
describe("calendar service", function() {

    var $date;
    var Calendar;

    beforeEach(module("materialCalendar"));

    beforeEach(inject(function(_Calendar_, _$filter_){
        Calendar = new _Calendar_();
        $date = function(year, month, day) {
            return _$filter_("dateToGmt")(new Date(year, month, day, 0, 0));
        };
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

    it("should start with the correct dates in October 2015", function() {
        Calendar.init(2015, 9);
        expect(angular.equals(Calendar.start, $date(2015, 9, 1))).toBe(true);
        expect(angular.equals(Calendar.weeks[0][0], $date(2015, 8, 27))).toBe(true);
    });

    it("should start with the correct dates in November 2015", function() {
        Calendar.init(2015, 10);
        expect(angular.equals(Calendar.start, $date(2015, 10, 1))).toBe(true);
        expect(angular.equals(Calendar.weeks[0][0], $date(2015, 10, 1))).toBe(true);
    });

    it("should start with the correct dates in July 2016", function() {
        Calendar.init(2016, 6);
        expect(angular.equals(Calendar.start, $date(2016, 6, 1))).toBe(true);
        expect(angular.equals(Calendar.weeks[0][0], $date(2016, 5, 26))).toBe(true);
    });

    it("should start with the correct dates in March 2017", function() {
        Calendar.init(2017, 2);
        expect(angular.equals(Calendar.start, $date(2017, 2, 1))).toBe(true);
        expect(angular.equals(Calendar.weeks[0][0], $date(2017, 1, 26))).toBe(true);
    });

    it("should start with the correct dates in April 2018", function() {
        Calendar.init(2018, 3);
        expect(angular.equals(Calendar.start, $date(2018, 3, 1))).toBe(true);
        expect(angular.equals(Calendar.weeks[0][0], $date(2018, 3, 1))).toBe(true);
    });

});
