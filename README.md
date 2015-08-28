# AngularJS Material Calendar

A calendar directive for AngularJS and Angular Material Design.
It's lightweight at ~2.1 kB, and has a lot of configurability.

![Screenshot](http://i.imgur.com/Ckcq2a2.png)

## Installation


### Bower

Install it via [Bower](//bower.io)

```bash
bower install --save material-calendar
```

Or add it to your dependencies in your `bower.json` file:

```json
{
   "dependencies": {
    "material-calendar": "~0.2"
  }
}
```

### NPM

```bash
npm install --save angular-material-calendar
```

## Usage

First off, check out the
<a href="https://angular-material-calendar.bradb.net/>demo</a>

The documentation still needs to be written. It should be pretty
straight forward to figure out if you're brave by using the
`example/index.html` file, which shows a full-fledged instance
of the directive in action.

Long story short, though, it's much improved by using dedicated
click handlers, setting a `ngModel` if desired, taking all
kinds of labels, and allowing output of HTML into the day blocks.
There's also an option to display it with each day taking up full page
width, which is great for small mobile screens and displaying content.

By default, the standard CSS and template are included in the single
compiled JavaScript file, so if you're just looking to kick the tires,
that's all you should need to use. The default template is in
`src/angular-material-calendar.html` for reference, but you can also
load a custom template with the `template-url` attribute of the
directive, which should be a url that the `$http` service will fetch
and inject.

```html
<md-calendar flex layout layout-fill
  calendar-direction="direction"
  on-prev-month="prevMonth"
  on-next-month="nextMonth"
  on-day-click="dayClick"
  title-format="'MMMM y'"
  ng-model='selectedDate'
  day-format="'d'"
  day-label-format="'EEE'"
  day-label-tooltip-format="'EEEE'"
  day-tooltip-format="'fullDate'"
  day-content="setDayContent"></md-calendar>
```

The related scope looks like this:

```javascript
angular.module("materialExample").controller("calendarCtrl", function($scope, $filter) {
    $scope.selectedDate = null;
    $scope.setDirection = function(direction) {
      $scope.direction = direction;
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
</scr
```

## To Do

- Unit tests
- Verify the correct handling of timezones
- Write documentation
- Spread the work
