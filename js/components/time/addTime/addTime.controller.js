function AddTimeController(AuthService, AddTimeService, timeTypesService, stateService, moment, $q, helperService, firebaseRef, $timeout, cfpLoadingBar) {
    var ctrl = this;

    ctrl.$onInit = function () {
        ctrl.timeTypesService = timeTypesService.getTimeTypes();
        // TODO: Improve the ManualTime field
        ctrl.newEntryManualTime = null; // fails if null
        ctrl.user = AuthService.getUser();
        AddTimeService.updateCurrentTimer();
        ctrl.updateDurations();
        // TODO: CHECK regarding the destroy:
        // var updateDurationsTimer = updateDurations();
        // $scope.$on("$destroy", function() {
        //     if (updateDurationsTimer) {
        //         $timeout.cancel(updateDurationsTimer);
        //     }
        // });
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
        cfpLoadingBar.start();
        // Translate the incoming project to the current task
        var entry = {};
        entry.project = event.project.name;
        entry.type = event.project.type;
        // Set the default values of this project
        AddTimeService.updateCurrentTask(entry)
            .then(cfpLoadingBar.complete, cfpLoadingBar.complete);
    };

    // Add entry
    ctrl.addEntry = function(){
        // TODO: Make sure the time is from today! (after switching day etc)
        AddTimeService.addEntry().then(function(){
            // Hack: Reset the time entry after saving
            ctrl.newEntryManualTime = null;
        });
    }

}

angular
    .module('components.time')
    .controller('AddTimeController', AddTimeController);
