// Version display component
// <date-switcher></date-switcher>
angular.module('cycloneApp').component('dateSwitcher', {
    template: require('./date_switcher.tpl.html'),
    controller: ['stateService', 'moment', '$timeout', '$scope', function dateSwitcherCtrl(stateService, moment, $timeout, $scope) {
        var $ctrl = this;

        // Run this code all 10min to verify if its still today
        var checkTime = function() {
            var today = moment();
            // console.log('checking time for dateswitcher');
            // console.log(today);

            var currentDate = stateService.getCurrentDate();
            var prevDate = currentDate.clone();
            var nextDate = currentDate.clone();
            $ctrl.currentDate = currentDate.toDate();
            $ctrl.pageType = stateService.getPageType();


            // PREV
            prevDate = prevDate.subtract(1, 'days');
            $ctrl.prevDateLink = {
                "year": prevDate.year(),
                "month": prevDate.format('MM'),
                "day": prevDate.format('DD')
            };

            // NEXT (not for the future)
            nextDate = nextDate.add(1, 'days');
            if (nextDate.isBefore(today, 'day') || nextDate.isSame(today, 'day')) {
                $ctrl.nextDateLink = {
                    "year": nextDate.year(),
                    "month": nextDate.format('MM'),
                    "day": nextDate.format('DD')
                };
            } else {
                $ctrl.nextDateLink = false;
            }

            // Call it over and over again, every 10min ( 1000ms * 60 (=1min) * 10 (=10min) )
            // TODO: for testing its set to 1min for now:
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
