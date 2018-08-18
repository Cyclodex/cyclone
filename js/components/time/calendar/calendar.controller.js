function CalendarController(CalendarService, ProfileService, moment) {
    var ctrl = this;
    // var features = ProfileService.getFeatureStates();
    
    ctrl.error = false;
    ctrl.doneLoading = false;

    ctrl.$onInit = function () {
        ctrl.features = ProfileService.getFeatureStates();
        const weekDays = moment.weekdaysShort();
        const firstElement = weekDays.shift();
        weekDays.push(firstElement);
        ctrl.weekDays = weekDays;
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