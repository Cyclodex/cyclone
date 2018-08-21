function CalendarController(CalendarService, ProfileService, moment) {
    var ctrl = this;
    // var features = ProfileService.getFeatureStates();
    
    ctrl.error = false;
    ctrl.doneLoading = "test";

    ctrl.$onInit = function () {
        ctrl.features = ProfileService.getFeatureStates();
        const weekDays = moment.weekdaysShort();
        const firstElement = weekDays.shift();
        weekDays.push(firstElement);
        ctrl.weekDays = weekDays;
        ctrl.doneLoading = "onInit";
    };
    
    // Entries
    Promise.resolve(CalendarService.getCurrentMonthData()).then((data) => {
        console.log("controller then() data");
        ctrl.doneLoading = true;
        ctrl.calendar = data.calendar;
        ctrl.weekStart = data.weekStart - 1;
    }).catch(error => console.log(error));
    
}

angular
    .module('components.calendar')
    .controller('CalendarController', CalendarController);