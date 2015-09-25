/* eslint-env jasmine */
/* global inject, module */
describe("dateToGmt filter", function() {

    var $filter;

    beforeEach(module("materialCalendar"));
    beforeEach(inject(function(_$filter_){
        $filter = _$filter_;
    }));

    it("should convert a local date to utc at midnight", function() {

        var now = new Date();
        var utc = new Date(
            now.getUTCFullYear(),
            now.getUTCMonth(),
            now.getUTCDate(),
            -1 * now.getTimezoneOffset() / 60,
            0,
            0
        );

        expect($filter("dateToGmt")(now)).toEqual(utc);

    });

});
