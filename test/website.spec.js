/* eslint-env protractor, jasmine */
describe("Website Test Suite", function() {
    it("should have a title", function() {
        browser.get("http://localhost:3000/");
        expect(browser.getTitle()).toEqual("Angular Material Calendar");
    });
});
