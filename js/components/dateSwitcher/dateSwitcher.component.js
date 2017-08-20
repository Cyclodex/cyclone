// Version display component
// <date-switcher></date-switcher>
angular.module('cycloneApp').component('dateSwitcher', {
    template: require('./date_switcher.tpl.html'),
    controller: ['stateService', 'moment', function dateSwitcherCtrl(stateService, moment) {
        var $ctrl = this;

        var today = moment();
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

    }]
});
