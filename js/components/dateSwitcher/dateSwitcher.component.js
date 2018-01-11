// Date switcher component
// <date-switcher></date-switcher>
angular.module('cycloneApp').component('dateSwitcher', {
    template: require('./date_switcher.tpl.html'),
    controller: ['$log', 'stateService', 'moment', '$timeout', '$scope', '$state', function dateSwitcherCtrl($log, stateService, moment, $timeout, $scope, $state) {
        var ctrl = this;
        var log = $log.getInstance('dateSwitcher');

        // Run this code all 10min to verify if its still today
        var checkTime = function() {
            var today = moment();
            log.debug('checking time for dateswitcher');
            log.debug('today:'+ today);
            log.debug(today);

            var currentDate = stateService.getCurrentDate();
            var prevDate = currentDate.clone();
            var nextDate = currentDate.clone();
            ctrl.currentDate = currentDate.toDate();

            // PREV
            prevDate = prevDate.subtract(1, 'days');
            ctrl.prevDateLink = {
                "year": prevDate.year(),
                "month": prevDate.format('MM'),
                "day": prevDate.format('DD')
            };

            // NEXT (but not for the future)
            nextDate = nextDate.add(1, 'days');
            if (nextDate.isSameOrBefore(today, 'day')) {
                ctrl.nextDateLink = {
                    "year": nextDate.year(),
                    "month": nextDate.format('MM'),
                    "day": nextDate.format('DD')
                };
            } else {
                ctrl.nextDateLink = false;
            }

            // Check for auto jumping to next day
            if (ctrl.currentDayVisited !== undefined && ctrl.currentDayVisited !== false && today.isAfter(ctrl.currentDayVisited, 'day')){
                // today is before the last visited day, so lets jump ahead
                log.info("now we jump to today's date!");
                var pageType = $state.current.name;
                // Automatically go to today!
                $state.go(pageType, {year: today.year(), month: today.month()+1, day: today.date()});
            } else {
                log.debug("No action for **auto switch day** needed (ctrl.currentDayVisited:)");
            }

            // Initialize an automatic day jump for next day, because we are on today now.
            if (currentDate.isSame(today, 'day')){
                log.info('Initializing a next day jump');
                ctrl.currentDayVisited = today;
                log.debug(ctrl.currentDayVisited);
            } else {
                // Not on today, so no auto switch initialization
                ctrl.currentDayVisited = false;
            }

            // Call it over and over again, every 10min ( 1000ms * 60 (=1min) * 10 = 600000(=10min) )
            // TODO: for testing its set to 1min for now (60000):
            // TODO: Maybe we can calculate how long it goes to the end of the day, and iterate only then :)
            dateSwitcherTimer = $timeout(checkTime, 60000, true);
        };

        var dateSwitcherTimer = $timeout(checkTime, 0, true);

        // Important! Destroy the time, or it repeats adding more and more
        // http://odetocode.com/blogs/scott/archive/2013/07/16/angularjs-listening-for-destroy.aspx
        $scope.$on("$destroy", function() {
            if (dateSwitcherTimer) {
                $timeout.cancel(dateSwitcherTimer);
            }
        });
    }]
});
