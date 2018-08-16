function CalendarController(CalendarService, ProfileService) {
    var ctrl = this;
    // var features = ProfileService.getFeatureStates();
    
    ctrl.error = false;
    ctrl.doneLoading = false;

    ctrl.$onInit = function () {
        ctrl.features = ProfileService.getFeatureStates();
    };
    
    // Entries
    data = CalendarService.getCurrentMonthData();
    ctrl.calendar = data.calendar;
    ctrl.weekStart = data.weekStart - 1;
    ctrl.doneLoading = true;
}

angular
    .module('components.calendar')
    .controller('CalendarController', CalendarController);