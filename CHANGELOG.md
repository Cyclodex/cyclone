# CHANGELOG
## 0.34 - 23.09.2016
* New continued tasks feature
* Allows to group multiple appearances of a task (+same project) and have a summary for it
* Mark all tasks of a continue-group as done
* Half marked continue-groups can still be checked, sum of time is shown accordingly.
* New Layout which uses less space for the timeline entries
* Not showing the seconds anymore, more cleaner time output.
* Moving the statistics into the bottom of the footer - only visible on footer hover at the moment.
* New continue a task feature (tracks current timer and uses the selected task to continue on)
## 0.33 - TBD
* Automatically adding a start day entry to improve user experience.

## 0.32 - 13.09.2016
* Separating the firebase config, removing it from the index file.
* Real config excluded from git and adding an example config.
* Authentication temporarily also loads cyclone.js, however this needs to be improved later.

## 0.31 - 13.09.2016
* Using uid of users to allow any e-mail addresses (#13)
* Using the year in the path, so we don't have issues next year (#21)
* Defining new Database rules, so every user can only read and write data into his own path (#20)
* Adding manually the users into a new structure "users", where profiles can be saved later on
* Merge branch (#24)

## 0.30 - 12.09.2016
* Upgraded code to Firebase 3.x, AngularFire 2.x
* Created auth factory and applying usage in code.

## 0.29 - 08.09.2016
* Small style update for the stats

## 0.28 - 06.09.2016
* Merged "Stats" Branch - visual improvements on the statistics

## 0.27 - 06.09.2016
* Merged Webpack build (by @pfiaux) (#17)
* Merged browsersync setup (by @pfiaux) (#17)
* General complete reorganization of the code (by @pfiaux) (#17)

## 0.26 - 24.08.2016
* Implemented archive which shows the old entries

## 0.25 - 22.08.2016
* Fixed the duration bug on first entries. (#6)
* Changed the "Manual time" to "Manual end time" to make clear this is not a duration. (#12)
* Further improved the text "What have you done" if the user entered a manual end time. (#12)
* Small styling improvements, so the project name and description use more space.

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