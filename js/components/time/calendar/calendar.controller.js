function CalendarController(CalendarService, clipboard, $filter, ProfileService) {
    var ctrl = this;
    // var features = ProfileService.getFeatureStates();
    
    ctrl.error = false;
    ctrl.doneLoading = false;

    ctrl.$onInit = function () {
        ctrl.features = ProfileService.getFeatureStates();
    };
    
    // Entries
    ctrl.entries = CalendarService.getCurrentWeekData();
    ctrl.entries.$loaded().then(function () {
        ctrl.doneLoading = true;
    });

}

angular
    .module('components.calendar')
    .controller('CalendarController', CalendarController);