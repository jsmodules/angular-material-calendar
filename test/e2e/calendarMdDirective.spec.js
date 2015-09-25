/* eslint-env protractor, jasmine */
describe("calendarMd directive test suite", function() {

    beforeEach(function() {
        browser.get("http://localhost:3000/");
    });

    it("should compile", function() {
        expect(element(by.css(".calendar-md")).isPresent()).toBeTruthy();
    });

    it("should have a prev btn", function() {
        expect(element(by.css(".calendar-md-prev-btn")).isPresent()).toBeTruthy();
    });

    it("should have a next btn", function() {
        expect(element(by.css(".calendar-md-next-btn")).isPresent()).toBeTruthy();
    });

    it("should have a toolbar", function() {
        expect(element(by.css(".calendar-md md-toolbar")).isPresent()).toBeTruthy();
    });

    it("should have a subheader", function() {
        expect(element(by.css(".calendar-md-subheader")).isPresent()).toBeTruthy();
    });

    it("should have seven days in the subheader", function() {
        var elements = element.all(by.css(".calendar-md-subheader .calendar-md-subheader-day"));
        expect(elements.count()).toEqual(7);
    });

    it("should have at least four weeks", function() {
        var elements = element.all(by.css(".calendar-md-week"));
        expect(elements.count()).toBeGreaterThan(3);
    });

    it("should have a week repeater", function() {
        element.all(by.css(".calendar-md-week")).count().then(function(weekCt) {
            expect(element.all(by.repeater("week in calendar.weeks")).count()).toBe(weekCt);
        });
    });

});
