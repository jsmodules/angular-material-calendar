angular.module("materialCalendar", ["ngMaterial", "ngSanitize"]);

angular.module("materialCalendar").constant("config", {
    version: "0.2.9",
    debug: document.domain.indexOf("localhost") > -1
});

angular.module("materialCalendar").config(["config", "$logProvider", "$compileProvider", function(config, $logProvider, $compileProvider) {
    if (config.debug) {
        $logProvider.debugEnabled(false);
        $compileProvider.debugInfoEnabled(false);
    }
}]);

angular.module("materialCalendar").service("Calendar", [function() {

    function Calendar(year, month, options) {

        var now = new Date();

        this.getNumDays = function() {
            return new Date(
              this.start.getYear(),
              this.start.getMonth(),
              0
            ).getDate();
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
        this.weeks = [];
        this.weekStartsOn = this.setWeekStartsOn(this.options.weekStartsOn);

        this.getFirstDayOfCalendar = function() {

            // Get first date of month.
            var date = this.start;

            // Undo the timezone offset here.
            var first = angular.copy(date);

            while(first.getDay() != this.weekStartsOn) {
                var d = first.getDate();
                first.setDate(d - 1);
            }

            return first;

        };

        this.next = function() {
            if(this.start.getMonth() < 11) {
                this.init(this.start.getFullYear(), this.start.getMonth() + 1);
            } else {
                this.init(this.start.getFullYear() + 1, 0);
            }
        };

        this.prev = function() {
            if (this.month) {
                this.init(this.start.getFullYear(), this.start.getMonth() - 1);
                return;
            } else {
                this.init(this.start.getFullYear() - 1, 11);
            }
        };

        // Month should be the javascript indexed month, 0 is January, etc.
        this.init = function(year, month) {

            var now = new Date();
            this.year = angular.isDefined(year) ? year : now.getFullYear();
            this.month = angular.isDefined(month) ? month : now.getMonth();

            var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            var monthLength = daysInMonth[this.month];

            // Figure out if is a leap year.
            if (this.month == 1) {
                if ((this.year % 4 == 0 && this.year % 100 != 0) || this.year % 400 == 0){
                    monthLength = 29;
                }
            }

            // First day of calendar month.
            this.start = new Date(this.year, this.month, 1);
            var date = angular.copy(this.start);
            while(date.getDay() != this.weekStartsOn) {
                date.setDate(date.getDate() - 1);
                monthLength++;
            }

            // Last day of calendar month.
            while(monthLength % 7 !== 0) {
                monthLength++;
            }

            this.weeks = [];
            for(var i = 0; i < monthLength; ++i) {

                // Let's start a new week.
                if (i % 7 === 0) {
                    this.weeks.push([]);
                }

                // Add copy of the date. If not a copy,
                // it will get updated shortly.
                this.weeks[this.weeks.length - 1].push(angular.copy(date));

                // Increment it.
                date.setDate(date.getDate() + 1);

            }

        };

        this.init(year, month);

    }

    return Calendar;

}]);

angular.module("materialCalendar").directive("calendarMd", ["$compile", "$timeout", "$parse", "$http", "$q", "$filter", "$log", "Calendar", function($compile, $timeout, $parse, $http, $q, $filter, $log, Calendar) {

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
            weekStartsOn: "=?",
            tooltips: "&?"
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

            $scope.sameMonth = function(date) {
                var d = angular.copy(date);
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
                setData();
                handleCb($scope.onPrevMonth, data);
            };

            $scope.next = function() {
                $scope.calendar.next();
                var data = {
                    year: $scope.calendar.year,
                    month: $scope.calendar.month + 1
                };
                setData();
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


            // Set the html contents of each date.
            var getDayKey = function(date) {
                return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");
            };

            $scope.data = {};
            $scope.dayKey = getDayKey;

            var getDayContent = function(date) {

                // Make sure some data in the data array.
                $scope.data[getDayKey(date)] = $scope.data[getDayKey(date)] || "";

                var cb = ($scope.dayContent || angular.noop)();
                var result = (cb || angular.noop)(date);

                // Check for async function. This should support $http.get() and also regular $q.defer() functions.
                if (angular.isObject(result) && "function" === typeof result.success) {
                    result.success(function(html) {
                        $scope.data[getDayKey(date)] = html;
                    });
                } else if (angular.isObject(result) && "function" === typeof result.then) {
                    result.then(function(html) {
                        $scope.data[getDayKey(date)] = html;
                    });
                } else {
                    $scope.data[getDayKey(date)] = result;
                }

            };

            var setData = function() {
                angular.forEach($scope.calendar.weeks, function(week) {
                    angular.forEach(week, getDayContent);
                });
            };

            window.data = $scope.data;

            var bootstrap = function() {
                init().then(function(contents) {
                    setTemplate(contents);
                    setData();
                });
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
