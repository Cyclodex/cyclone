function AddTimeController(AuthService, AddTimeService, timeTypesService, stateService, moment, $timeout, cfpLoadingBar) {
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

        ctrl.setFocus = true;

        // Check if its today or not to hide this component
        var today = moment();

        // Important when we switch the day: update the services reference, or we are on the wrong entry.
        AddTimeService.updateEntriesReference();

        ctrl.hideAddTime = true;
        var urlDate = stateService.getCurrentDate();
        if (urlDate.isSame(today, 'day')) {
            ctrl.hideAddTime = false;
        }
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

    // update project
    ctrl.updateProject = function (event) {
        cfpLoadingBar.start();

        ctrl.currentTask.newEntryProject = event.project.name;
        // Update the type if we have one (from existing project)
        if (event.project.type) {
            ctrl.currentTask.newEntryType = event.project.type;
        }
        // Firebase save
        ctrl.currentTask.$save(ctrl.currentTask)
            .then(cfpLoadingBar.complete, cfpLoadingBar.complete);
    };

    // Add entry
    ctrl.addEntry = function(){
        // TODO: Make sure the time is from today! (after switching day etc)

        // make sure the focus will work (resetting it)
        ctrl.setFocus = false;
        AddTimeService.addEntry().then(function(){
            // Hack: Reset the time entry after saving
            ctrl.newEntryManualTime = null;

            ctrl.setFocus = true;
        });
    }

}
AddTimeController.$inject = ["AuthService", "AddTimeService", "timeTypesService", "stateService", "moment", "$timeout", "cfpLoadingBar"];
angular
    .module('components.time')
    .controller('AddTimeController', AddTimeController);
