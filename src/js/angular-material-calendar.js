angular.module("materialCalendar", ["ngMaterial"])

    .service("Calendar", [function () {

        function Calendar(year, month) {

            var self = this;

            var now = new Date();
            this.year = now.getFullYear();
            this.month = now.getMonth();
            this.dates = [];

            this.getNumDays = function () {
                return new Date(
                    this.start.getYear(),
                    this.start.getMonth() + 1,
                    0
                ).getDate();
            };

            this.getFirstDayOfCalendar = function (date) {

                var first = new Date(date || self.start);
                first.setDate(1 - first.getDay());

                return first;

            };

            this.next = function () {
                this.init(this.year, this.month + 2);
            };

            this.prev = function () {

                if (this.month) {
                    this.init(this.year, this.month);
                } else {
                    this.init(this.year - 1, 12);
                }

            };

            this.init = function (year, month) {

                if (year && month) {
                    this.year = year;
                    this.month = month - 1;
                }

                // Set up the new date.
                this.start = new Date(this.year, this.month, 1, 0, 0);
                this.dates = [];
                this.weeks = [[]];

                // Reset the month and year to handle the case of many
                // prev/next calls across years.
                this.year = this.start.getFullYear();
                this.month = this.start.getMonth();

                var week = 0,
                    first = this.getFirstDayOfCalendar(),
                    _i = first.getDate() == 1 && this.getNumDays() == 28 ? 28 : 35,
                    offset = first.getTimezoneOffset() * -60000;

                for (var i = 0; i < _i; i++) {

                    var add = (i * 86400000) + offset;
                    var date = new Date(first.valueOf() + add);

                    // Sunday? Let's start a new week.
                    if (!date.getDay() && this.weeks[0].length) {
                        week++;
                        this.weeks.push([]);
                    }

                    this.dates.push(date);
                    this.weeks[week].push(date);

                }

                return this.dates;

            };

            this.init(year, month);

        }

        return Calendar;

    }])
    .directive("mdCalendar", ["Calendar", function (Calendar) {

        return {
            restrict: "E",
            replace: true,
            template: "/* mdCalendar */",
            link: function ($scope, $element, $attrs) {

                var month = parseInt($element.data("month") || (new Date().getMonth() + 1));
                var year = parseInt($element.data("year") || (new Date().getFullYear()));

                // Formatting.
                $scope.titleFormat = $element.data("title-format") || "MMMM yyyy";
                $scope.dayOfWeekFormat = $element.data("day-of-week-format") || "EEEE";
                $scope.dayFormat = $element.data("day-format") || "d";

                $scope.calendar = new Calendar(year, month);

                $scope.next = function () {

                    $scope.calendar.next();

                    var data = {
                        year: $scope.calendar.year,
                        month: $scope.calendar.month
                    };

                    $scope.$emit("md-calendar.month.next", data);
                    $scope.$emit("md-calendar.month.change", data);

                };

                $scope.prev = function () {

                    $scope.calendar.prev();

                    var data = {
                        year: $scope.calendar.year,
                        month: $scope.calendar.month
                    };

                    $scope.emit("md-calendar.month.prev", data);
                    $scope.emit("md-calendar.month.change", data);

                };

                $scope.handleDayClick = function (date) {

                    $scope.$emit("md-calendar.date.click", date);

                    // Handle callback.
                    var callback = $attrs.ngClickDate || false;
                    if (callback) {
                        if ("function" === typeof $scope[callback]) {
                            $scope[callback](date);
                        }
                    }

                }

            }
        }

    }]);