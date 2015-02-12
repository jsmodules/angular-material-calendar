# AngularJS Material Calendar

A calendar directive for AngularJS and Angular Material Design. A work in progress.

## Date formats

The day of the week is formatted through Angular's date filter. The default is:

```html
<md-calendar data-day-of-week-format="EEEE"></md-calendar>
```

The title, too is formatted through Angular's date filter. The default is:

```html
<md-calendar data-title-format="MMMM yyyy"></md-calendar>
```

The label for each day is also formatted the same way:

```html
<md-calendar data-day-format="d"></md-calendar>
```

## Clicking on dates

### Via Callback Function

The callback when clicking on a date is set in the `ng-click-date` attribute:

```html
<md-calendar ng-click-date="someFunctionName"></md-calendar>
```

The callback function much be attached to the parent scope. It receives a
JavaScript date object as the first and only parameter:

```javascript
$scope.someFunctionName = function(date) {
    // Do something with the Date object here...
};
```

### Via `$emit` and `$on`

Clicking on a date also results in the directive sending an `$emit` call back up
through the parent scopes, so you can listen for it with `$on`:

```javascript
$scope.$on("md-calendar.date.click", function(date) {
    // Do something with the Date object here...
});
```

## Switching Months

When changing months, the directive sends `$emit` with an object of the following format:

```json
{
    "year": 2015
    "month": 1
}
```

For both "next" and "prev" months, you can listen for `md-calendar.month.change`:

```javascript
$scope.$on("md-calendar.month.change", function(data) {
    // Variable "data" will look like: {year: 2015, month: 6}
});
```

### Previous Month
For previous month, you can also listen for `md-calendar.month.prev`. (Note that the data is the
same as `md-calendar.month.change`.

```javascript
$scope.$on("md-calendar.month.prev", function(data) {
    // Variable "data" will look like: {year: 2015, month: 6}
});
```

### Next Month
For the next month, you can also listen for `md-calendar.month.next`. (Note that the data is the
same as `md-calendar.month.change`.

```javascript
$scope.$on("md-calendar.month.next", function(data) {
    // Variable "data" will look like: {year: 2015, month: 6}
});
```


## Misc Notes

### Custom click handlers

Every date cell has a class of `.md-calendar-day`. It also has a `data-year`, 
`data-month` and `data-day` attribute defined. This is useful, for example, 
if you need to set up custom click handlers and figure out which day was clicked
on.

### Custom template

The directive template is hard-wired into the directive JS, but it would be trivial to 
switch it to a `templateUrl` instead. The actual template is build using jade, so it's
available to hack on. Just see the `src/jade/mdCalendar.jade` file.


