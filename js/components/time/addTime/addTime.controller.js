function AddTimeController(AuthService, AddTimeService, timeTypesService, stateService, moment, $q, helperService, firebaseRef, $timeout, cfpLoadingBar) {
    var ctrl = this;

    ctrl.$onInit = function () {
        ctrl.timeTypesService = timeTypesService.getTimeTypes();
        // TODO: Improve the ManualTime field
        ctrl.newEntryManualTime = null; // fails if null
        ctrl.user = AuthService.getUser();
        AddTimeService.updateCurrentTimer();
        ctrl.updateDurations();
        ctrl.currentTask = AddTimeService.getCurrentTask();
    };

    // Manual end time field update
    ctrl.timeUpdate = function() {
        AddTimeService.setCurrentTaskManualTime(ctrl.newEntryManualTime);
    };

    // Realtime duration display
    ctrl.updateDurations = function() {
        ctrl.currentDuration = AddTimeService.updateDurations();
        $timeout(ctrl.updateDurations, 1000, true);
    };

    // update
    ctrl.updateProject = function (event) {
        // cfpLoadingBar.start();
        console.log("addtimer - UPDATE PROJECT RECEIVES THE UPDATE");
        console.log(event.project);
        // return ProjectService
        // .saveProject(event.project)
        // 'projects': Helps us to save the entry directly with $save
        //     .saveProject(event.project, projects)
        //     .then(cfpLoadingBar.complete, cfpLoadingBar.complete);
    };

    // Add entry
    ctrl.addEntry = function(){
        AddTimeService.addEntry().then(function(){
            // Hack: Reset the time entry after saving
            ctrl.newEntryManualTime = null;
        });
    }

}

angular
    .module('components.time')
    .controller('AddTimeController', AddTimeController);
