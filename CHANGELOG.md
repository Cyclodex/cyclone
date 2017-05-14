# CHANGELOG
## 0.48 - 14.05.2017
* Fixed issue with FF on the "check all" checkbox in "grouped task"

## 0.47 - 07.04.2017
* Improved Grouping feature

## 0.46 - 08.03.2017
* Enhancement: Grouping feature improved
* Style changes to need less space when a entry is checked.
* Replacing the checkbox with the time button.
* Further styling improvements and re-placing elements.

## 0.45 - 06.03.2017
* Changed total work hours to client and internal work types (removed trust time from it)
* Made a visual space to separate the work types from break and trust
* Removed the start entry (system) from the stats graph.

## 0.44 - ?
* Fixed empty type after using continue button.
* Adding a "trust" type
* Improved type handling in general
* New graph which shows the time of the different types for today in the footer instead of numbers only.
* Created filter to render durations in a simple human format.

## 0.43 - 11.02.2017
* Introducing new "internal" hours. They count as work hours but are useful for seeing the amount of internal hours. (against project/client/external hours)
* Fixed authentication, works now also without any CDN's.
* Improved loading screen behaviour, no raw Angular template code is visible anymore.
* Changing the layout a bit and improving visibility of Project name

## 0.42 - 29.01.2017
* Loading the libraries with webpack instead of CDN's. (index.html)
* Providing the randomColor through a factory.
* Created new build process for production (webpack).
* Reverted a change from 0.38 - The copy button is back.

## 0.41 - 10.01.2017
* Fixed bug that copy time button was changing visually the state of a task as done, but did not save to DB (#36)

## 0.40 - 09.01.2017
* Adding Feedback/report issue link in footer. (#33)

## 0.39 - 09.01.2017
* Copy time will now also mark the entry as done. (#34)
* Time-copy buttons now also on the "continued tasks". (#35)

## 0.38 - 08.01.2017
* Adding clipboard feature. The time can be copied with a simple click on it.
* Styling improvement when the project and description is left empty.
* Removed the copy button: Functionality moved into the continue button.
* Further improved the "Continue" button: The copy functionality is now executed if entries are empty (of current tracker)

## 0.37 - 25.10.2016
* Removed connection.controller.js and simplified into ProfileCtrl
* Created a footer component which holds the stats and profile components / controller

## 0.36 - 18.10.2016
* Fixed issue in FF that "watch" was not working as project or description. The property was already a function.

## 0.35 - 26.09.2016
* Making login not to call 2 route changes

## 0.34 - 26.09.2016
* New continued tasks feature
* Allows to group multiple appearances of a task (+same project) and have a summary for it
* Mark all tasks of a continue-group as done
* Half marked continue-groups can still be checked, sum of time is shown accordingly.
* New Layout which uses less space for the timeline entries
* Not showing the seconds anymore, more cleaner time output.
* Moving the statistics into the bottom of the footer - only visible on footer hover at the moment.
* New continue a task feature (tracks current timer and uses the selected task to continue on)
* Stats open on mouseover on footer
* Project is now before the task description

## 0.33 - 16.09.2016
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