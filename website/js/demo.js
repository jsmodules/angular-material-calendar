angular.module("materialExample", ["ngMaterial", "materialCalendar"]);
angular.module("materialExample").config(function($mdThemingProvider) {
    $mdThemingProvider
        .theme("default")
        .primaryPalette("cyan")
        .accentPalette("light-green");
});

angular.module("materialExample").controller("calendarCtrl", function($scope, $filter) {

    $scope.selectedDate = null;
    $scope.weekStartsOn = 0;
    $scope.dayFormat = "d";

    $scope.fullscreen = function() {
        var elem = document.querySelector("#calendar-demo");
        if(!document.fullscreenElement && !document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement) {
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            }
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            } else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            } else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            } else if (document.webkitExitFullscreen) {
                document.webkitExitFullscreen();
            }
        }
    };

    $scope.setDirection = function(direction) {
        $scope.direction = direction;
        $scope.dayFormat = direction === "vertical" ? "EEEE, MMMM d" : "d";
    };

    $scope.dayClick = function(date) {
        $scope.msg = "You clicked " + $filter("date")(date, "MMM d, y h:mm:ss a Z");
    };

    $scope.prevMonth = function(data) {
        $scope.msg = "You clicked (prev) month " + data.month + ", " + data.year;
    };

    $scope.nextMonth = function(data) {
        $scope.msg = "You clicked (next) month " + data.month + ", " + data.year;
    };

    $scope.setDayContent = function(date) {
        // You would inject any HTML you wanted for
        // that particular date here.
        return "<p></p>";
    };
});
