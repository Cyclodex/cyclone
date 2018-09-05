// Date switcher component
// <date-switcher></date-switcher>
angular.module('cycloneApp').component('dateSwitcher', {
    template: require('./date_switcher.tpl.html'),
    controller: ['$log', 'stateService', 'moment', '$timeout', '$scope', '$state', function dateSwitcherCtrl($log, stateService, moment, $timeout, $scope, $state) {
        var ctrl = this;
        // var log = $log.getInstance('dateSwitcher');

        // Get the prev and next date links
        var today = moment();
        var currentDate = stateService.getCurrentDate();
        var prevDate = currentDate.clone();
        var nextDate = currentDate.clone();

        ctrl.type = $state.current.name;
        if ($state.current.name === 'calendar') {
            // PREV
            prevDate.subtract(1, 'month');
            ctrl.prevDateLink = {
                "year": prevDate.year(),
                "month": prevDate.format('MM'),
            };

            // NEXT (but not for the future)
            nextDate.add(1, 'month');
            if (nextDate.isSameOrBefore(today, 'month')) {
                ctrl.nextDateLink = {
                    "year": nextDate.year(),
                    "month": nextDate.format('MM'),
                };
            } else {
                ctrl.nextDateLink = false;
            }
        } else {
            // PREV
            prevDate.subtract(1, 'days');
            ctrl.prevDateLink = {
                "year": prevDate.year(),
                "month": prevDate.format('MM'),
                "day": prevDate.format('DD')
            };

            // NEXT (but not for the future)
            nextDate.add(1, 'days');
            if (nextDate.isSameOrBefore(today, 'day')) {
                ctrl.nextDateLink = {
                    "year": nextDate.year(),
                    "month": nextDate.format('MM'),
                    "day": nextDate.format('DD')
                };
            } else {
                ctrl.nextDateLink = false;
            }
        }

        var currentDate = stateService.getCurrentDate();
        ctrl.currentDate = currentDate.toDate();

        // Run this code when it gets next day.
        const checkTime = function() {
            var today = moment();
            // log.debug('Checking time - today:');
            // log.debug(today);
            

            // Check for auto jumping to next day
            if (ctrl.currentDayVisited !== undefined && ctrl.currentDayVisited !== false){
                // Something is set, check if today is ahead
                if (today.isAfter(ctrl.currentDayVisited, 'day')) {
                    // Today is after the last visited day, so lets jump ahead
                    // log.info("New day detected, jumping ahead.");
                    var pageType = $state.current.name;
                    // Automatically go to today!
                    $state.go(pageType, {year: today.year(), month: today.month()+1, day: today.date()});
                } else {
                    // log.debug("Waiting for a new day. Day visited is set to:");
                    // log.debug(ctrl.currentDayVisited);
                }
            } else {
                // Register "a watcher" for automatic day jump for next day, because we are on today now.
                if (currentDate.isSame(today, 'day')){
                    // log.info('Initializing waiting for a new day...');
                    ctrl.currentDayVisited = today;
                    // log.debug(ctrl.currentDayVisited);
                } else {
                    // Not on today, so no auto switch initialization
                    // log.log('Not on today, not initializing day jump!');
                    ctrl.currentDayVisited = false;
                }
            }

            // Call it again tomorrow (0:00) - calculated with miliseconds difference to now.
            var milisecondsUntilTomorrow = nextDate.startOf('day').diff(moment(), 'miliseconds'); // The difference from now until next day
            // log.debug("milisecondsUntilTomorrow:");
            // log.debug(milisecondsUntilTomorrow);
            if (milisecondsUntilTomorrow > 0){
                dateSwitcherTimer = $timeout(checkTime, milisecondsUntilTomorrow, true);
            }
        };

        if ($state.current.name !== 'calendar') {
            var dateSwitcherTimer = $timeout(checkTime, 0, true);
        }

        // Important! Destroy the time, or it repeats adding more and more
        // http://odetocode.com/blogs/scott/archive/2013/07/16/angularjs-listening-for-destroy.aspx
        $scope.$on("$destroy", function() {
            if (dateSwitcherTimer) {
                $timeout.cancel(dateSwitcherTimer);
            }
        });
    }]
});
