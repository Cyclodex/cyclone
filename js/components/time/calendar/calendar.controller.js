function CalendarController(CalendarService, ProfileService, moment, $firebaseArray) {
    var ctrl = this;
    // var features = ProfileService.getFeatureStates();
    
    ctrl.error = false;
    ctrl.$onInit = function () {
        ctrl.features = ProfileService.getFeatureStates();
        const weekDays = moment.weekdaysShort();
        const firstElement = weekDays.shift();
        weekDays.push(firstElement);
        ctrl.weekDays = weekDays;
        ctrl.doneLoading = false;
        ctrl.calendar = {};
        getCalendarStructure();
        getCalendarData();
    };
    
    getCalendarStructure = function (){
        Promise.resolve(CalendarService.getCurrentMonthStructure()).then((data) => {
            ctrl.calendar = Object.assign(ctrl.calendar, data.calendar);
            ctrl.weekStart = data.weekStart - 1;
        }).catch(error => console.log(error));
    }
    

    getCalendarData = function() {
        const { references, details } = CalendarService.getWeeksOfMonthReferences();
        const { month } = details;
    
        references.forEach(ref => {
            const refOrder = ref.orderByChild("order");
            Promise.resolve(CalendarService.getCurrentWeekData($firebaseArray(refOrder), month)).then((weekData) => {
                Object.entries(weekData).forEach(([day, data]) => {
                    Object.assign(ctrl.calendar[day], data, { doneLoading: true });
                });
            }).catch(error => console.log(error));
        });
    }
}

angular
    .module('components.calendar')
    .controller('CalendarController', CalendarController);