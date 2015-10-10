angular.module("materialCalendar", ["ngMaterial", "ngSanitize"]);

angular.module("materialCalendar").filter("dateToGmt", function() {
    return function(date) {
        date = date || new Date();
        return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    };
});

angular.module("materialCalendar").config(["$logProvider", "$compileProvider", function($logProvider, $compileProvider) {
    if (document.domain.indexOf("localhost") < 0) {
        $logProvider.debugEnabled(false);
        $compileProvider.debugInfoEnabled(false);
    }
}]);

angular.module("materialCalendar").service("Calendar", ["$filter", function($filter) {

    function Calendar(year, month, options) {

        var now = $filter("dateToGmt")();

        this.getNumDays = function() {
            return $filter("dateToGmt")(new Date(
              this.start.getYear(),
              this.start.getMonth(),
              0
            )).getDate();
        };

        this.setWeekStartsOn = function(i) {
            var d = parseInt(i || 0, 10);
            if (!isNaN(d) && d >= 0 && d <= 6) {
                this.weekStartsOn = d;
            } else {
                this.weekStartsOn = 0;
            }
            return this.weekStartsOn;
        };

        this.options = angular.isObject(options) ? options : {};
        this.year = now.getFullYear();
        this.month = now.getMonth();
        this.dates = [];
        this.weekStartsOn = this.setWeekStartsOn(this.options.weekStartsOn);

        this.getFirstDayOfCalendar = function() {

            // Get first date of month.
            var date = this.start;
            var first = new Date(date.getFullYear(), date.getMonth(), 1);

            if (first.getDay() !== this.weekStartsOn) {

                // Set the first day of the month.
                first.setDate(first.getDate() - first.getDay() + (this.weekStartsOn));

                // Sanity check to prevent first/last week from being out of month.
                if (first.getDate() > 1 && first.getDate() < 7) {
                    first.setDate(first.getDate() - 7);
                }

            }

            return first;

        };

        this.next = function() {
            this.init(this.year, this.month + 1);
        };

        this.prev = function() {
            this.init(this.year, this.month - 1);
        };

        this._isFirstDayOfWeek = function(date) {
            return !date.getDay();
        };

        // Month should be the javascript indexed month, 0 is January, etc.
        this.init = function(year, month) {

            if (year) {
                if (month) {
                    this.year = year;
                    this.month = month;
                } else {
                    this.year = year - 1;
                    this.month = 11;
                }
            }

            // Set up the new date.
            this.start = $filter("dateToGmt")(new Date(this.year, this.month, 1, 0, 0));
            this.dates = [];
            this.weeks = [];

            // Reset the month and year to handle the case of many
            // prev/next calls across years.
            this.year = this.start.getFullYear();
            this.month = this.start.getMonth();

            var date;
            var first = this.getFirstDayOfCalendar();
            var i = 0;
            var _i = first.getDate() == 1 && this.getNumDays() == 28 ? 28 : 42;

            // @todo Need to fix for up to 6 weeks.
            for (; i < _i; i++) {

                date = $filter("dateToGmt")(new Date(first.valueOf() + (i * 86400000)));

                // Let's start a new week.
                // @todo If timezone changes, this goes haywire.
                if (i % 7 === 0) {
                    this.weeks.push([]);
                }

                // Sanity check to prevent first day of week from being in next month.
                if (this.weeks.length > 1 && !this.weeks[this.weeks.length - 1].length) {
                    if (date.getMonth() !== this.month) {
                        break;
                    }
                }

                this.dates.push(date);
                this.weeks[this.weeks.length - 1].push(date);

            }

            return this.dates;

        };

        this.init(year, month);

    }

    return Calendar;

}]);

angular.module("materialCalendar").directive("calendarMd", ["$compile", "$parse", "$http", "$q", "$filter", "$log", "Calendar", function($compile, $parse, $http, $q, $filter, $log, Calendar) {

    var hasCss;
    var defaultTemplate = "/* angular-material-calendar.html */";

    var injectCss = function() {
        if (!hasCss) {
            var head = document.getElementsByTagName("head")[0];
            var css = document.createElement("style");
            css.type = "text/css";
            css.id="calendarMdCss";
            css.innerHTML = "/* angular-material-calendar.css */";
            head.insertBefore(css, head.firstChild);
            hasCss = true;
        }
    };

    return {
        restrict: "E",
        scope: {
            ngModel: "=?",
            template: "&",
            templateUrl: "=?",
            onDayClick: "=?",
            onPrevMonth: "=?",
            onNextMonth: "=?",
            calendarDirection: "=?",
            dayContent: "&?",
            timezone: "=?",
            titleFormat: "=?",
            dayFormat: "=?",
            dayLabelFormat: "=?",
            dayLabelTooltipFormat: "=?",
            dayTooltipFormat: "=?",
            weekStartsOn: "=?"
        },
        link: function($scope, $element, $attrs) {

            // Add the CSS here.
            injectCss();

            var date = new Date();
            var month = parseInt($attrs.startMonth || date.getMonth());
            var year = parseInt($attrs.startYear || date.getFullYear());

            $scope.columnWeekLayout = "column";
            $scope.weekLayout = "row";
            $scope.timezone = $scope.timezone || null;

            // Parse the parent model to determine if it's an array.
            // If it is an array, than we'll automatically be able to select
            // more than one date.
            if ($attrs.ngModel) {
                $scope.active = $scope.$parent.$eval($attrs.ngModel);
                if ($attrs.ngModel) {
                    $scope.$watch("$parent." + $attrs.ngModel, function(val) {
                        $scope.active = val;
                    });
                }
            } else {
                $scope.active = null;
            }

            // Set the defaults here.
            $scope.titleFormat = $scope.titleFormat || "MMMM yyyy";
            $scope.dayLabelFormat = $scope.dayLabelFormat || "EEE";
            $scope.dayLabelTooltipFormat = $scope.dayLabelTooltipFormat || "EEEE";
            $scope.dayFormat = $scope.dayFormat || "d";
            $scope.dayTooltipFormat = $scope.dayTooltipFormat || "fullDate";
            //$scope.getDayContent = $scope.dayContent || angular.noop;

            $scope.sameMonth = function(date) {
                var d = $filter("dateToGmt")(date);
                return d.getFullYear() === $scope.calendar.year &&
                  d.getMonth() === $scope.calendar.month;
            };

            $scope.calendarDirection = $scope.calendarDirection || "horizontal";

            $scope.$watch("calendarDirection", function(val) {
                $scope.weekLayout = val === "horizontal" ? "row" : "column";
            });

            $scope.$watch("weekLayout", function() {
                year = $scope.calendar.year;
                month = $scope.calendar.month;
                bootstrap();
            });

            var handleCb =  function(cb, data) {
                (cb || angular.noop)(data);
            };

            var dateFind = function(arr, date) {
                var index = -1;
                angular.forEach(arr, function(d, k) {
                    if (index < 0) {
                        if(angular.equals(date, d)) {
                            index = k;
                        }
                    }
                });
                return index;
            };

            $scope.isActive = function(date) {
                var match;
                var active = angular.copy($scope.active);
                if (!angular.isArray(active)) {
                    match = angular.equals(date, active);
                } else {
                    match = dateFind(active, date) > -1;
                }
                return match;
            };

            $scope.prev = function() {
                $scope.calendar.prev();
                var data = {
                    year: $scope.calendar.year,
                    month: $scope.calendar.month + 1
                };
                handleCb($scope.onPrevMonth, data);
            };

            $scope.next = function() {
                $scope.calendar.next();
                var data = {
                    year: $scope.calendar.year,
                    month: $scope.calendar.month + 1
                };
                handleCb($scope.onNextMonth, data);
            };




            $scope.handleDayClick = function(date) {

                var active = angular.copy($scope.active);
                if (angular.isArray(active)) {
                    var idx = dateFind(active, date);
                    if (idx > -1) {
                        active.splice(idx, 1);
                    } else {
                        active.push(date);
                    }
                } else {
                    if (angular.equals(active, date)) {
                        active = null;
                    } else {
                        active = date;
                    }
                }

                $scope.active = active;
                if ($attrs.ngModel) {
                    $parse($attrs.ngModel).assign($scope.$parent, angular.copy($scope.active));
                }

                $log.log("isActive", $scope.active, date, $scope.isActive(date));

                handleCb($scope.onDayClick, angular.copy(date));

            };

            // Small helper function to set the contents of the template.
            var setTemplate = function(contents) {
                $element.html(contents);
                $compile($element.contents())($scope);
            };

            var init = function() {

                $scope.calendar = new Calendar(year, month, {
                    weekStartsOn: $scope.weekStartsOn || 0
                });

                var deferred = $q.defer();
                // Allows fetching of dynamic templates via $http.
                if ($scope.templateUrl) {
                    $http
                      .get($scope.templateUrl)
                      .success(deferred.resolve)
                      .error(deferred.reject);
                } else {
                    deferred.resolve($scope.template() || defaultTemplate);
                }

                return deferred.promise;

            };

            $scope.data = {};
            $scope.getDayContent = function(date) {
                if ("undefined" === typeof $scope.data[date.valueOf()]) {
                    $scope.data[date.valueOf()] = ($scope.dayContent() || angular.noop)(date) || "";
                }
                return $scope.data[date.valueOf()];
            };

            var bootstrap = function() {
                init().then(setTemplate);
            };

            $scope.$watch("weekStartsOn", init);
            bootstrap();

            // These are for tests, don't remove them..
            $scope._$$init = init;
            $scope._$$setTemplate = setTemplate;
            $scope._$$bootstrap = bootstrap;

        }
    };

}]);
