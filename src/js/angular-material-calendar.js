angular.module("ministryApp").directive("ngCalendar", ["Calendar", "$log", function(Calendar, $log) {

    return {
        restrict: "E",
        replace: true,
        templateUrl: "templates/ngCalendar.html",
        link: function($scope, $element, $attrs, $ngModel) {

            var month = parseInt($element.data("month") || (new Date().getMonth() + 1));
            var year = parseInt($element.data("year") || (new Date().getFullYear()));

            $scope.calendar = new Calendar(year, month);

            $scope.next = function() {
                $scope.calendar.next();
            };

            $scope.prev = function() {
                $scope.calendar.prev();
            };

            $scope.handleDayClick = function(date) {
                var callback = $attrs.ngClickDate || false;
                if (callback) {
                    if("function" === typeof $scope[callback]) {
                        $scope[callback](date);
                    } else {
                        $log.error("Date handler " + callback + " is not a function");
                    }
                }
            }

        }
    }

}]);