/* eslint-env protractor, jasmine */
describe("calendarMd directive test suite", function() {


    beforeEach(function() {
        browser.get("http://localhost:3000/");
    });

    it("should compile", function() {
        expect(element(by.css("calendar-md > *")).isPresent()).toBeTruthy();
    });

    it("should have a prev/next btn", function() {
        expect(element.all(by.css("md-toolbar .md-button")).count()).toBe(2);
    });

    it("should have a toolbar", function() {
        expect(element(by.css("md-toolbar")).isPresent()).toBeTruthy();
    });

    it("should have a subheader", function() {
        expect(element(by.css(".subheader")).isPresent()).toBeTruthy();
    });

    it("should have seven days in the subheader", function() {
        var elements = element.all(by.css("md-content > md-content > :first-child > *"));
        expect(elements.count()).toEqual(7);
    });

    it("should have at least four weeks", function() {
        var elements = element.all(by.css("md-content > md-content > :not(:first-child)"));
        expect(elements.count()).toBeGreaterThan(3);
    });

});
