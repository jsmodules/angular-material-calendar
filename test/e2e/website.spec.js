/* eslint-env protractor, jasmine */
describe("website test suite", function() {

    it("should have a title", function() {
        browser.get("http://localhost:3000/");
        expect(browser.getTitle()).toEqual("Angular Material Calendar");
    });

    it("should have a demo calendar", function() {
        expect(element(by.css("calendar-md")).isPresent()).toBeTruthy();
    });

});
