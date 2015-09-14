angular
  .module("materialCalendar", ["ngMaterial", "ngSanitize"])
  .filter("dateToGmt", function() {
    return function(date) {
      date = date || new Date();
      return new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
    };
  })
  .service("Calendar", ["$filter", function ($filter) { function Calendar(year, month) {

      var self = this;
      var now = $filter("dateToGmt")();

      this.year = now.getFullYear();
      this.month = now.getMonth();
      this.dates = [];

      this.getNumDays = function () {
          return $filter("dateToGmt")(new Date(
              this.start.getYear(),
              this.start.getMonth() + 1,
              0
          )).getDate();
      };

      this.firstDayOfWeek = "Sunday";

      this.getFirstDayOfCalendar = function () {

          // Get first date of month.
          var date = this.start;
          var first = new Date(date.getFullYear(), date.getMonth(), 1);

          // If first day of month.day != the first day of week
          first.setDate(first.getDate() - first.getDay() + (this.firstDayOfWeek === "Sunday" ? 0 : 1));

          return first;

      };

      this.next = function () {
        this.init(this.year, this.month + 3);
      };

      this.prev = function () {
        this.init(this.year, this.month);
      };

      this._isFirstDayOfWeek = function(date) {
        return ! date.getDay();
      };

      this.init = function (year, month) {

          if (year && month) {
            this.year = year;
            this.month = month - 1;
          } else if(year && ! month) {
            this.year = year - 1;
            this.month = 11;
          }

          // Set up the new date.
          this.start = $filter("dateToGmt")(new Date(this.year, this.month, 1, 0, 0));
          this.dates = [];
          this.weeks = [];

          // Reset the month and year to handle the case of many
          // prev/next calls across years.
          this.year = this.start.getFullYear();
          this.month = this.start.getMonth();

          var first = this.getFirstDayOfCalendar();
          var _i = first.getDate() == 1 && this.getNumDays() == 28 ? 28 : 35;

          for (var i = 0; i < _i; i++) {

              var date = $filter("dateToGmt")(new Date(first.valueOf() + (i * 86400000)));

              // Sunday? Let's start a new week.
              // @todo If timezone changes, this goes haywire.
              if (i % 7 === 0) {
                this.weeks.push([]);
              }

              this.dates.push(date);
              this.weeks[this.weeks.length - 1].push(date);

          }

          return this.dates;

      };

      this.init(year, month);

    }

    return Calendar;

  }])
    .directive("calendarMd", ["$compile", "$parse", "$http", "$q", "$filter", "Calendar", function ($compile, $parse, $http, $q, $filter, Calendar) {

        var hasCss;
        var defaultTemplate = "/* angular-material-calendar.html */";

        var injectCss = function() {
          if (! hasCss) {
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
              dayContent: "=?",
              timezone: "=?",
              titleFormat: "=?",
              dayFormat: "=?",
              dayLabelFormat: "=?",
              dayLabelTooltipFormat: "=?",
              dayTooltipFormat: "=?"
            },

            link: function ($scope, $element, $attrs, $ngModel) {

                // Add the CSS here.
                injectCss();

                $scope.columnWeekLayout = "column";
                $scope.weekLayout = "row";
                $scope.timezone = $scope.timezone || null;

                // Set the defaults here.
                $scope.titleFormat = $scope.titleFormat || "MMMM yyyy";
                $scope.dayLabelFormat = $scope.dayLabelFormat || "EEE";
                $scope.dayLabelTooltipFormat = $scope.dayLabelTooltipFormat || "EEEE";
                $scope.dayFormat = $scope.dayFormat || "d";
                $scope.dayTooltipFormat = $scope.dayTooltipFormat || "fullDate";
                $scope.getDayContent = $scope.dayContent || function() { };

                $scope.sameMonth = function(date) {

                  var d = $filter("dateToGmt")(date);
                  return d.getFullYear() === $scope.calendar.year &&
                    d.getMonth() === $scope.calendar.month;

                };


                $scope.calendarDirection = $scope.calendarDirection || "horizontal";
                $scope.$watch("calendarDirection", function(val) {
                  $scope.weekLayout = val === "horizontal" ? "row" : "column";
                });

                var month = parseInt($element.data("month") || (new Date().getMonth() + 1));
                var year = parseInt($element.data("year") || (new Date().getFullYear()));

                $scope.calendar = new Calendar(year, month);
                var handleCb =  function(cb, data) {
                  if("function" === typeof cb) {
                      cb(data || null);
                  }
                };

                $scope.prev = function () {
                    $scope.calendar.prev();
                    var data = {
                        year: $scope.calendar.year,
                        month: $scope.calendar.month + 1
                    };
                    handleCb($scope.onPrevMonth, data);
                };

                $scope.next = function () {
                    $scope.calendar.next();
                    var data = {
                        year: $scope.calendar.year,
                        month: $scope.calendar.month + 1
                    };
                    handleCb($scope.onNextMonth, data);
                };

                $scope.handleDayClick = function (date) {
                  $scope.active = date;

                  // Set the model if available.
                  if ($attrs.ngModel) {
                    $parse($attrs.ngModel).assign($scope.$parent, date);
                  }

                  handleCb($scope.onDayClick, date);
                };

                // Small helper function to set the contents of the template.
                var setTemplate = function(contents) {
                    $element.html(contents);
                    $compile($element.contents())($scope);
                };

                var init = function() {

                  var deferred = $q.defer();
                  // Allows fetching of dynamic templates via $http.
                  if ($scope.templateUrl) {
                    $http
                      .get($scope.template)
                      .success(deferred.resolve(html))
                      .error(deferred.reject);
                  } else if ($scope.template()) {
                    deferred.resolve($scope.template());
                  } else {
                    deferred.resolve(defaultTemplate);
                  }

                  return deferred.promise;

                };

                init().then(setTemplate);

            }
        };

    }]);