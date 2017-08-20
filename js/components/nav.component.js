angular.module('cycloneApp').component('nav', {
    template: require('./nav.tpl.html'),
    controller: ['stateService', 'moment', function navCtrl(stateService, moment) {
        var $ctrl = this;

        // var today = moment();
        var currentDate = stateService.getCurrentDate();
        $ctrl.pageType = stateService.getPageType();


        // Current date values
        $ctrl.currentDate = {
            "year": currentDate.year(),
            "month": currentDate.format('MM'),
            "day": currentDate.format('DD')
        };
    }]
});