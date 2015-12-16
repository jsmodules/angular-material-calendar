# AngularJS Material Calendar

[![Build Status](https://semaphoreci.com/api/v1/projects/be573f04-507e-4659-ad3b-0611db2227eb/540401/badge.svg)](https://semaphoreci.com/brad/angular-material-calendar)
[![Code Climate](https://codeclimate.com/github/bradberger/angular-material-calendar/badges/gpa.svg)](https://codeclimate.com/github/bradberger/angular-material-calendar)
[![Coverage Status](https://coveralls.io/repos/bradberger/angular-material-calendar/badge.svg?branch=master&service=github)](https://coveralls.io/github/bradberger/angular-material-calendar?branch=master)
[![Bower](https://img.shields.io/bower/v/material-calendar.svg?style=flat-square)](http://bower.io/search/?q=material-calendar)
[![NPM Version](https://img.shields.io/npm/v/angular-material-calendar.svg?style=flat-square)](https://npmjs.org/angular-material-calendar)
[![NPM Downloads](https://img.shields.io/npm/dt/angular-material-calendar.svg?style=flat-square)](https://npmjs.org/angular-material-calendar)
[![License](https://img.shields.io/npm/l/angular-material-calendar.svg?style=flat-square)](https://www.mozilla.org/en-US/MPL/2.0/)

A calendar directive for AngularJS and Angular Material Design.
It's lightweight at ~2.1 kB, and has a lot of configurability.

![Screenshot](http://i.imgur.com/Ckcq2a2.png)

## Installation

### RawGit

```html
&lt;script src="https://cdn.rawgit.com/bradberger/angular-material-calendar/master/dist/angular-material-calendar.js"&gt;&lt;script&gt;
```

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

First off, check out the [demo](https://angular-material-calendar.bradb.net).

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
  week-starts-on="firstDayOfWeek"
  day-content="setDayContent"></md-calendar>
```

The related scope looks like this:

```javascript
angular.module("materialExample").controller("calendarCtrl", function($scope, $filter) {
    $scope.selectedDate = null;
    $scope.firstDayOfWeek = 0;
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

## Hacking On It

Use gulp to spin up the server and re-compile resources on the fly. The
gulp `default` task does all that for you. Just make sure to Selenium is
up and running:

```bash
./node_modules/protractor/bin/webdriver-manager update
```

```bash
# In one terminal
webdriver-manager start
```

```bash
# In separate terminal
gulp
```

Protractor is set up to run all the tests during development. JavaScript code
is linted with `eslint`, too, so make sure that's not complaining about code
styling or other issues.

Unit tests are thanks to Karma, so run those at the same time while developing.
They'll detect code changes and run automatically in the background:

```bash
# In another terminal
karma start
```

## Contributing

Pull requests are most welcomed! The build process requires strict linting
of code, so please follow the established ESLint style guide.

Also, the first round of the directive was just a proof-of-concept and test
coverage is not complete, please do add tests for all new features and
bug-fixes, too! Most submissions won't be merged without a test.

Also, if you could kindly add an extra test that's not related to your
submission just to help us get to 100% coverage, that would be very much
appreciated!

## To Do

- [X] Unit tests (the basic setup is there, need to fill them out)
- [X] Verify the correct handling of timezones (tests?)
- Write documentation
- Spread the work
- Add to cdnjs, jsdelivr, etc.
- Automate the website update process after successful CI build
