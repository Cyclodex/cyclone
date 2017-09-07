// Version display component
// <date-switcher></date-switcher>
angular.module('cycloneApp').component('dateSwitcher', {
    template: require('./date_switcher.tpl.html'),
    controller: ['stateService', 'moment', '$timeout', function dateSwitcherCtrl(stateService, moment, $timeout) {
        var $ctrl = this;

        checkTime();

        // Run this code all 10min to verify if its still today
        function checkTime() {
            var today = moment();
            console.log('checking time for dateswitcher');
            console.log(today);

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
            $timeout(checkTime, 60000, true);
        }

    }]
});
