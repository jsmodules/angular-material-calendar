/* eslint-env jasmine */
/* global inject, module */
describe("calendar service", function () {

    var CalendarData;
    var today = new Date();
    var input = "test data";

    beforeEach(module("materialCalendar"));

    beforeEach(inject(function (_CalendarData_) {
        CalendarData = _CalendarData_;
    }));

    it("should have all public methods defined", function () {
        expect(CalendarData).toBeDefined();
        expect(typeof CalendarData.data).toBe("object");
        expect(typeof CalendarData.getDayKey).toBe("function");
        expect(typeof CalendarData.setDayContent).toBe("function");
    });

    it("should initalize to empty string when given undefined content for an unset date", function () {
        CalendarData.setDayContent(today, undefined);
        expect(CalendarData.data[CalendarData.getDayKey(today)]).toBe("");
    });

    it("should initalize to empty string when given null content for a unset date", function () {
        CalendarData.setDayContent(today, null);
        expect(CalendarData.data[CalendarData.getDayKey(today)]).toBe("");
    });

    it("should return the set value for a given date", function () {
        CalendarData.setDayContent(today, input);
        expect(CalendarData.data[CalendarData.getDayKey(today)]).toBe(input);
    });

    it("should not set a previously set value to undefined", function () {
        CalendarData.setDayContent(today, input);
        CalendarData.setDayContent(today, undefined);
        expect(CalendarData.data[CalendarData.getDayKey(today)]).toBe(input);
    });

    it("should not set a previously set value to null", function () {
        CalendarData.setDayContent(today, input);
        CalendarData.setDayContent(today, null);
        expect(CalendarData.data[CalendarData.getDayKey(today)]).toBe(input);
    });
});