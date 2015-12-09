/* eslint-env jasmine */
/* global inject, module */
describe("calendar service", function () {

    var MaterialCalendarData;
    var today = new Date();
    var input = "test data";

    beforeEach(module("materialCalendar"));

    beforeEach(inject(function (_MaterialCalendarData_) {
        MaterialCalendarData = _MaterialCalendarData_;
    }));

    it("should have all public methods defined", function () {
        expect(MaterialCalendarData).toBeDefined();
        expect(typeof MaterialCalendarData.data).toBe("object");
        expect(typeof MaterialCalendarData.getDayKey).toBe("function");
        expect(typeof MaterialCalendarData.setDayContent).toBe("function");
    });

    it("should initalize to empty string when given undefined content for an unset date", function () {
        MaterialCalendarData.setDayContent(today, undefined);
        expect(MaterialCalendarData.data[MaterialCalendarData.getDayKey(today)]).toBe("");
    });

    it("should initalize to empty string when given null content for a unset date", function () {
        MaterialCalendarData.setDayContent(today, null);
        expect(MaterialCalendarData.data[MaterialCalendarData.getDayKey(today)]).toBe("");
    });

    it("should return the set value for a given date", function () {
        MaterialCalendarData.setDayContent(today, input);
        expect(MaterialCalendarData.data[MaterialCalendarData.getDayKey(today)]).toBe(input);
    });

    it("should not set a previously set value to undefined", function () {
        MaterialCalendarData.setDayContent(today, input);
        MaterialCalendarData.setDayContent(today, undefined);
        expect(MaterialCalendarData.data[MaterialCalendarData.getDayKey(today)]).toBe(input);
    });

    it("should not set a previously set value to null", function () {
        MaterialCalendarData.setDayContent(today, input);
        MaterialCalendarData.setDayContent(today, null);
        expect(MaterialCalendarData.data[MaterialCalendarData.getDayKey(today)]).toBe(input);
    });
});
