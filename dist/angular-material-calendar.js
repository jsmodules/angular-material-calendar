angular.module("materialCalendar", ["ngMaterial", "ngSanitize"]);

angular.module("materialCalendar").constant("materialCalendar.config", {
    version: "0.2.13",
    debug: document.domain.indexOf("localhost") > -1
});

angular.module("materialCalendar").config(["materialCalendar.config", "$logProvider", "$compileProvider", function (config, $logProvider, $compileProvider) {
    if (config.debug) {
        $logProvider.debugEnabled(false);
        $compileProvider.debugInfoEnabled(false);
    }
}]);

angular.module("materialCalendar").directive('compile', ['$compile', function ($compile) {
    return function(scope, element, attrs) {
        scope.$watch(
            function(scope) {
                return scope.$eval(attrs.compile);
            },
            function(value) {
                element.html(value);
                $compile(element.contents())(scope);
            }
        );
    };
}]);

angular.module("materialCalendar").service("materialCalendar.Calendar", [function () {

    function Calendar(year, month, options) {

        var now = new Date();

        this.setWeekStartsOn = function (i) {
            var d = parseInt(i || 0, 10);
            if (!isNaN(d) && d >= 0 && d <= 6) {
                this.weekStartsOn = d;
            } else {
                this.weekStartsOn = 0;
            }
            return this.weekStartsOn;
        };

        this.setStartDateOfMonth = function (i) {
            var d = parseInt(i || 1, 10);
            if (!isNaN(d) && d >= 1 && d <= 31) {
                this.startDateOfMonth = d;
            } else {
                this.startDateOfMonth = 1;
            }
            return this.startDateOfMonth;
        };

        this.setNoOfDays = function (i) {
            var d = parseInt(i || 0, 10);
            if (!isNaN(d) && d > 0 ) {
                this.noOfDays = d;
            } else {
                this.noOfDays = 0;
            }
            return this.noOfDays;
        };

        this.options = angular.isObject(options) ? options : {};
        this.year = now.getFullYear();
        this.month = now.getMonth();
        this.weeks = [];
        this.weekStartsOn = this.setWeekStartsOn(this.options.weekStartsOn);
        this.startDateOfMonth = this.setStartDateOfMonth(this.options.startDateOfMonth);
        this.noOfDays = this.setNoOfDays(this.options.noOfDays);

        this.next = function () {
            if (this.start.getMonth() < 11) {
                this.init(this.start.getFullYear(), this.start.getMonth() + 1);
                return;
            }
            this.init(this.start.getFullYear() + 1, 0);
        };

        this.prev = function () {
            if (this.month) {
                this.init(this.start.getFullYear(), this.start.getMonth() - 1);
                return;
            }
            this.init(this.start.getFullYear() - 1, 11);
        };

        // Month should be the javascript indexed month, 0 is January, etc.
        this.init = function (year, month) {

            var now = new Date();
            this.year = angular.isDefined(year) ? year : now.getFullYear();
            this.month = angular.isDefined(month) ? month : now.getMonth();

            var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
            var monthLength = daysInMonth[this.month];

            // Figure out if is a leap year.
            if (this.month === 1) {
                if ((this.year % 4 === 0 && this.year % 100 !== 0) || this.year % 400 === 0) {
                    monthLength = 29;
                }
            }

            // First day of calendar month.
            if ( angular.isDefined(this.options.startDateOfMonth) ) {
                this.start = new Date(this.year, this.month, this.startDateOfMonth);
            } else {
                this.start = new Date(this.year, this.month, 1);
            }

            var date = angular.copy(this.start);
            if ( date.getDate() === 1) {
                while ( date.getDay() !== this.weekStartsOn) {
                    date.setDate(date.getDate() - 1);
                    monthLength++;
                }
            }

            if ( this.noOfDays !== 0) {
                while (this.noOfDays % 7 !== 0) {
                    this.noOfDays++;
                }
                monthLength = this.noOfDays;
            } else {
                // Last day of calendar month.
                while (monthLength % 7 !== 0) {
                    monthLength++;
                }
            }

            // Last day of calendar month.
            while (monthLength % 7 !== 0) {
                monthLength++;
            }

            this.weeks = [];
            for (var i = 0; i < monthLength; ++i) {

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

angular.module("materialCalendar").service("MaterialCalendarData", [function () {
    function CalendarData() {

        this.data = {};

        this.getDayKey = function(date) {
            return [date.getFullYear(), date.getMonth() + 1, date.getDate()].join("-");
        };

        this.setDayContent = function(date, content) {
            this.data[this.getDayKey(date)] = content || this.data[this.getDayKey(date)] || "";
        };
    }
    return new CalendarData();
}]);

angular.module("materialCalendar").directive("calendarMd", ["$compile", "$parse", "$templateRequest", "$q", "materialCalendar.Calendar", "MaterialCalendarData", function ($compile, $parse, $templateRequest, $q, Calendar, CalendarData) {

    var defaultTemplate = "<md-content layout='column' layout-fill md-swipe-left='next()' md-swipe-right='prev()'><md-toolbar><div class='md-toolbar-tools' layout='row'><md-button class='md-icon-button' ng-click='prev()' aria-label='Previous month'><md-tooltip ng-if='::tooltips()'>Previous month</md-tooltip><md-icon md-svg-icon='md-tabs-arrow'></md-icon></md-button><div flex></div><h2 class='calendar-md-title'><span>{{ calendar.start | date:titleFormat:timezone }}</span></h2><div flex></div><md-button class='md-icon-button' ng-click='next()' aria-label='Next month'><md-tooltip ng-if='::tooltips()'>Next month</md-tooltip><md-icon md-svg-icon='md-tabs-arrow' class='moveNext'></md-icon></md-button></div></md-toolbar><!-- agenda view --><md-content ng-if='weekLayout === columnWeekLayout' class='agenda'><div ng-repeat='week in calendar.weeks track by $index'><div ng-if='sameMonth(day)' ng-class='{&quot;disabled&quot; : isDisabled(day), active: active === day }' ng-click='handleDayClick(day)' ng-repeat='day in week' layout><md-tooltip ng-if='::tooltips()'>{{ day | date:dayTooltipFormat:timezone }}</md-tooltip><div>{{ day | date:dayFormat:timezone }}</div><div flex compile='dataService.data[dayKey(day)]'></div></div></div></md-content><!-- calendar view --><md-content ng-if='weekLayout !== columnWeekLayout' flex layout='column' class='calendar'><div layout='row' class='subheader'><div layout-padding class='subheader-day' flex ng-repeat='day in calendar.weeks[0]'><md-tooltip ng-if='::tooltips()'>{{ day | date:dayLabelTooltipFormat }}</md-tooltip>{{ day | date:dayLabelFormat }}</div></div><div ng-if='week.length' ng-repeat='week in calendar.weeks track by $index' flex layout='row'><div tabindex='{{ sameMonth(day) ? (day | date:dayFormat:timezone) : 0 }}' ng-repeat='day in week track by $index' ng-click='handleDayClick(day)' flex layout layout-padding ng-class='{&quot;disabled&quot; : isDisabled(day), &quot;active&quot;: isActive(day), &quot;md-whiteframe-12dp&quot;: hover || focus }' ng-focus='focus = true;' ng-blur='focus = false;' ng-mouseleave='hover = false' ng-mouseenter='hover = true'><md-tooltip ng-if='::tooltips()'>{{ day | date:dayTooltipFormat }}</md-tooltip><div>{{ day | date:dayFormat }}</div><div flex compile='dataService.data[dayKey(day)]' id='{{ day | date:dayIdFormat }}'></div></div></div></md-content></md-content>";

    var injectCss = function () {
        var styleId = "calendarMdCss";
        if (!document.getElementById(styleId)) {
            var head = document.getElementsByTagName("head")[0];
            var css = document.createElement("style");
            css.type = "text/css";
            css.id = styleId;
            css.innerHTML = "calendar-md md-content>md-content.agenda>*>* :not(:first-child),calendar-md md-content>md-content.calendar>:not(:first-child)>* :last-child{overflow:hidden;text-overflow:ellipsis}calendar-md{display:block;max-height:100%}calendar-md .md-toolbar-tools h2{overflow-x:hidden;text-overflow:ellipsis;white-space:nowrap}calendar-md .md-toolbar-tools .moveNext{transform:translate3d(0,0,0) rotate(180deg)}calendar-md md-content>md-content{border:1px solid rgba(0,0,0,.12)}calendar-md md-content>md-content.agenda>*>*{border-bottom:1px solid rgba(0,0,0,.12)}calendar-md md-content>md-content.agenda>*>.disabled{color:rgba(0,0,0,.3);pointer-events:none;cursor:auto}calendar-md md-content>md-content.agenda>*>* :first-child{padding:12px;width:200px;text-align:right;color:rgba(0,0,0,.75);font-weight:100;overflow-x:hidden;text-overflow:ellipsis;white-space:nowrap}calendar-md md-content>md-content>*>*{min-width:48px}calendar-md md-content>md-content.calendar>:first-child{background:rgba(0,0,0,.02);border-bottom:1px solid rgba(0,0,0,.12);margin-right:0;min-height:36px}calendar-md md-content>md-content.calendar>:not(:first-child)>*{border-bottom:1px solid rgba(0,0,0,.12);border-right:1px solid rgba(0,0,0,.12);cursor:pointer}calendar-md md-content>md-content.calendar>:not(:first-child)>:hover{background:rgba(0,0,0,.04)}calendar-md md-content>md-content.calendar>:not(:first-child)>.disabled{color:rgba(0,0,0,.3);pointer-events:none;cursor:auto}calendar-md md-content>md-content.calendar>:not(:first-child)>.active{box-shadow:0 1px 3px 0 rgba(0,0,0,.2),0 1px 1px 0 rgba(0,0,0,.14),0 2px 1px -1px rgba(0,0,0,.12);background:rgba(0,0,0,.02)}calendar-md md-content>md-content.calendar>:not(:first-child)>* :first-child{padding:0}";
            head.insertBefore(css, head.firstChild);
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
            tooltips: "&?",
            startDateOfMonth: "=?",
            noOfDays: "=?",
            clearDataCacheOnLoad: "=?",
            disableFutureSelection: "=?",
            disableSelection: "=?"
        },
        link: function ($scope, $element, $attrs) {

            // Add the CSS here.
            injectCss();

            var date = new Date();
            var month = parseInt($attrs.startMonth || date.getMonth());
            var year = parseInt($attrs.startYear || date.getFullYear());

            $scope.columnWeekLayout = "column";
            $scope.weekLayout = "row";
            $scope.timezone = $scope.timezone || null;
            $scope.noCache = $attrs.clearDataCacheOnLoad || false;

            // Parse the parent model to determine if it's an array.
            // If it is an array, than we'll automatically be able to select
            // more than one date.
            if ($attrs.ngModel) {
                $scope.active = $scope.$parent.$eval($attrs.ngModel);
                if ($attrs.ngModel) {
                    $scope.$watch("$parent." + $attrs.ngModel, function (val) {
                        $scope.active = val;
                    });
                }
            } else {
                $scope.active = null;
            }

            // Set the defaults here.
            $scope.titleFormat = $scope.titleFormat || "LLLL yyyy";
            $scope.dayLabelFormat = $scope.dayLabelFormat || "EEE";
            $scope.dayLabelTooltipFormat = $scope.dayLabelTooltipFormat || "EEEE";
            $scope.dayFormat = $scope.dayFormat || "d";
            $scope.dayTooltipFormat = $scope.dayTooltipFormat || "fullDate";
            $scope.dayIdFormat = "dd-MM-yy";
            $scope.disableFutureSelection = $scope.disableFutureSelection || false;
            $scope.disableSelection = $scope.disableSelection || false;

            $scope.sameMonth = function (date) {
                var d = angular.copy(date);
                return d.getFullYear() === $scope.calendar.year &&
                    d.getMonth() === $scope.calendar.month;
            };

            $scope.isDisabled = function (date,startDateOfMonth,noOfDays) {
                if (noOfDays!=0 && angular.isDefined(noOfDays)) { 
                    var dateStart = new Date($scope.calendar.year,$scope.calendar.month,startDateOfMonth);
                    var dateEnd = angular.copy(dateStart);
                    dateEnd.setDate(dateStart.getDate()+parseInt(noOfDays));
                    if (date.getDate() <= dateStart && date.getDate() >= dateEnd) { return true; }
                }
                if ($scope.disableSelection) { return true; }
                if ($scope.disableFutureSelection && date > new Date()) { return true; }
                return !$scope.sameMonth(date);
            };

            $scope.calendarDirection = $scope.calendarDirection || "horizontal";

            $scope.$watch("calendarDirection", function (val) {
                $scope.weekLayout = val === "horizontal" ? "row" : "column";
            });

            $scope.$watch("weekLayout", function () {
                year = $scope.calendar.year;
                month = $scope.calendar.month;
                bootstrap();
            });

            var handleCb = function (cb, data) {
                (cb || angular.noop)(data);
            };

            var dateFind = function (arr, date) {
                var index = -1;
                angular.forEach(arr, function (d, k) {
                    if (index < 0) {
                        if (angular.equals(date, d)) {
                            index = k;
                        }
                    }
                });
                return index;
            };

            $scope.isActive = function (date) {
                var match;
                var active = angular.copy($scope.active);
                if (!angular.isArray(active)) {
                    if (active && angular.equals(active.getYear(), date.getYear()) && angular.equals(active.getMonth(), date.getMonth()) && angular.equals(active.getDate(), date.getDate())) {
                        match = true;
                    }
                } else {
                    match = dateFind(active, date) > -1;
                }
                return match;
            };

            $scope.prev = function () {
                $scope.calendar.prev();
                var data = {
                    year: $scope.calendar.year,
                    month: $scope.calendar.month + 1
                };
                setData();
                handleCb($scope.onPrevMonth, data);
            };

            $scope.next = function () {
                $scope.calendar.next();
                var data = {
                    year: $scope.calendar.year,
                    month: $scope.calendar.month + 1
                };
                setData();
                handleCb($scope.onNextMonth, data);
            };

            $scope.handleDayClick = function (date) {

                if($scope.disableFutureSelection && date > new Date()) {
                    return;
                }

                if($scope.disableSelection) {
                    return;
                }

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

                handleCb($scope.onDayClick, angular.copy(date));

            };

            // Small helper function to set the contents of the template.
            var setTemplate = function (contents) {
                $element.html(contents);
                $compile($element.contents())($scope);
            };

            var init = function () {

                $scope.calendar = new Calendar(year, month, {
                    weekStartsOn: $scope.weekStartsOn || 0,
                    startDateOfMonth: $scope.startDateOfMonth || 1,
                    noOfDays: $scope.noOfDays || 0
                });

                // Allows fetching of dynamic templates via $templateCache.
                if ($scope.templateUrl) {
                    return $templateRequest($scope.templateUrl);
                }

                return $q.resolve($scope.template() || defaultTemplate);
            };




            $scope.dataService = CalendarData;

            // Set the html contents of each date.
            var getDayKey = function (date) {
                return $scope.dataService.getDayKey(date);
            };
            $scope.dayKey = getDayKey;

            var getDayContent = function (date) {

                // Initialize the data in the data array.
                if ($scope.noCache) {
                    $scope.dataService.setDayContent(date, "");
                } else {
                    $scope.dataService.setDayContent(date, ($scope.dataService.data[getDayKey(date)] || ""));
                }

                var cb = ($scope.dayContent || angular.noop)();
                var result = (cb || angular.noop)(date);

                // Check for async function. This should support $http.get() and also regular $q.defer() functions.
                if (angular.isObject(result) && "function" === typeof result.success) {
                    result.success(function (html) {
                        $scope.dataService.setDayContent(date, html);
                    });
                } else if (angular.isObject(result) && "function" === typeof result.then) {
                    result.then(function (html) {
                        $scope.dataService.setDayContent(date, html);
                    });
                } else {
                    $scope.dataService.setDayContent(date, result);
                }

            };

            var setData = function () {
                angular.forEach($scope.calendar.weeks, function (week) {
                    angular.forEach(week, getDayContent);
                });
            };

            window.data = $scope.data;

            var bootstrap = function () {
                init().then(function (contents) {
                    setTemplate(contents);
                    setData();
                });
            };

            $scope.$watchGroup(["weekStartsOn","startDateOfMonth","noOfDays"], init);
            bootstrap();

            // These are for tests, don't remove them..
            $scope._$$init = init;
            $scope._$$setTemplate = setTemplate;
            $scope._$$bootstrap = bootstrap;

        }
    };

}]);
