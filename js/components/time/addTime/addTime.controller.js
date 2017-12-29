function AddTimeController(AuthService, AddTimeService, timeTypesService, stateService, moment, $timeout, cfpLoadingBar) {
    var ctrl = this;
    ctrl.doneLoading = false;

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

        // Load entries
        ctrl.entries = AddTimeService.getEntries();
        // If no entries, show the start times feature
        ctrl.entries.$loaded().then(function () {
            if (ctrl.entries.length === 0) {
                // Add the current timestamp
                var timestamp = Date.now();            
                AddTimeService.addStartTime(timestamp);

                // List all the timestamps we have detected today
                ctrl.startTimes = AddTimeService.getStartTimes();
                ctrl.startTimes.$loaded().then(function () {
                    ctrl.doneLoading = true;
                });
            } else {
                ctrl.doneLoading = true;
                // Found entries, so we should make sure that start times are cleaned.
                AddTimeService.resetStartTimes();
            }
        })
            .catch(function (error) {
                console.log("Error:", error);
            });

        ctrl.setFocus = true;

        // Check if its today or not to hide this component
        var today = moment();

        // Important when we switch the day: update the services reference, or we are on the wrong entry.
        AddTimeService.updateEntriesReference();

        ctrl.showAddTime = false;
        var urlDate = stateService.getCurrentDate();
        if (urlDate.isSame(today, 'day')) {
            ctrl.showAddTime = true;
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

    // Add starting the day entry
    ctrl.addStartingTheDay = function() {
        // Default time is now
        var timestamp = Date.now();
        // Get the right day (the one we are looking at)
        var currentDate = stateService.getCurrentDate();

        // Apply the date of the selected or manual input field.
        if (ctrl.manualStartTime !== undefined &&
            ctrl.manualStartTime.value !== undefined &&
            ctrl.manualStartTime.value !== null
        ) {
            // TODO: Move this duplicated code into a function

            // If we have a manual end time, we don't know the prev time entry
            // We need a date of the day we are on.
            var manualTime = new Date();
            // Get the right day (the one we are looking at)
            manualTime.setTime(currentDate.valueOf());

            // And manually set the hours + minutes
            var hours = ctrl.manualStartTime.value.getHours();
            var minutes = ctrl.manualStartTime.value.getMinutes();
            manualTime.setHours(hours);
            manualTime.setMinutes(minutes);
            manualTime.setSeconds(0);
            timestamp = manualTime.getTime();
        } else if (ctrl.selectedStartTime) {
            timestamp = ctrl.selectedStartTime;
        }
        
        AddTimeService.addStartingTheDay(timestamp);
    }

}
AddTimeController.$inject = ["AuthService", "AddTimeService", "timeTypesService", "stateService", "moment", "$timeout", "cfpLoadingBar"];
angular
    .module('components.time')
    .controller('AddTimeController', AddTimeController);
