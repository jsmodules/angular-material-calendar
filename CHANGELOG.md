## 0.2.12

- Fixes #26 Rows in Calendar View when using IE/Edge are too tall
- Improves toolbar layout
- Adds minimum with for day cells

## 0.2.11

- Adds production ready files to base directory of project, similar to angular
- Re-implements minified of JS which was commented out by mistake
- Slight refactoring
- Prevents CSS from being injected multiple times if more than one calendar on page

## 0.2.10

- Implements a data service to allow for shared access to HTML per day

## 0.2.9

- Overhauls the way dates/weeks are calculated, should be much more stable.

## 0.2.8

- Fixes bug with incorrect use of one-time bindings, resulting in the
  dates not updating.

- Fixes bug with empty weeks being added, messing up the row heights.

## 0.2.7

- Adds selection of multiple dates
- Will now read the ngModel and update selected dates accordingly
- Fixes bug with injection of HTML for date content
- Simplifies CSS, removing most custom classes

## 0.2.5

- Adds better layout support for mobile
- Updates website look and examples
- Adds fullscreen demo

## 0.2.4

- Adds support for first day of the week
- Fixes minor bugs with missing days/too many days in month

## 0.2.2

- Fixes namespace collision with `md-calendar` in `angular-material` `0.11`
