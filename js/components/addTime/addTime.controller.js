function AddTimeController(AuthService, AddTimeService, timeTypesService, stateService, moment, $q, helperService, firebaseRef, $timeout, cfpLoadingBar) {
    var ctrl = this;

    ctrl.$onInit = function () {
        // ctrl.currentTask = AddTimeService.getCurrentTask();
        ctrl.timeTypesService = timeTypesService.getTimeTypes();
        // ctrl.newEntryManualTime = null; // fails if null
        ctrl.user = AuthService.getUser();
        AddTimeService.updateCurrentTimer();
        ctrl.updateDurations();
        ctrl.currentTask = AddTimeService.getCurrentTask();
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
        AddTimeService.addEntry();
    }

}

angular
    .module('components.time')
    .controller('AddTimeController', AddTimeController);
