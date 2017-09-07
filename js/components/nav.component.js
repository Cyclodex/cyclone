angular.module('cycloneApp').component('nav', {
    template: require('./nav.tpl.html'),
    controller: ['stateService', function navCtrl(stateService) {
        var $ctrl = this;

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