# CHANGELOG

## 0.25 - 22.08.2016
* Fixed the duration bug on first entries. (#6)
* Changed the "Manual time" to "Manual end time" to make clear this is not a duration. (#12)
* Further improved the text "What have you done" if the user entered a manual end time. (#12)

## 0.24 - 18.08.2016
* Adding a manual entry as "first" entry on the time line (#6)
* Added a favicon to represent the cyclone better. (#7)
What should be solved with this commit is:
* Deleting an entry will update the next entry automatically so there is no time gap. (#10)
  * will now update correctly the next entry
  * has now the same start and end timestamp to not break the logic later
* Durations are not going over a mathematical cleanup function, to round away the milliseconds.
  This should fix the wrong hours / minutes rounding. (#11)


## 0.23 - 17.08.2016
* Enhancement: Project and day hours are now separated for work / private types. (#9)
* New feature: New possibility to clone project and description from an existing entry. (#1)

## 0.22 - 15.08.2016
* Fixed rendering issues (#4)
* All entries which contain "break" as project name will not count as total hours (#3)

## 0.21
* Improved the time validation on manual time input
* Improved the "private" mode auto detection (match for word "break")

## 0.20
* Adding link on version to github website
* defining browser support - located issues with time-input field
* adding firebase file ignores
* changing app and authentication links to local files
* Adding public folder for the final files


## CHANGELOG from before
Previous versions are located privately in codepen.