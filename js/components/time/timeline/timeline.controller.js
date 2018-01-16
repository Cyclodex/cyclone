function TimelineController(AddTimeService, clipboard, $filter) {
    var ctrl = this;

    // ng-change can't get $event! We need workaround with focusCallback
    ctrl.clipboardCopy = function (GroupData) {
        // Filter the duration to the wanted format
        duration = $filter('timestampInDecimalHours')(GroupData.timestampDuration);
        // TODO-feature: only if enabled ?
        clipboard.copyText(duration);
        // Save the state of the checkbox
        ctrl.entries.$save(GroupData);
        // Focus the field again, otherwise you can't navigate further with keyboard
        ctrl.clipboardCopyTargetField.focus();
    }
    // The workaround to know which element we are focusing on
    ctrl.clipboardCopyPrepare = function ($event) {
        if($event.target === null) {
            return;
        }
        ctrl.clipboardCopyTargetField = $event.target;
    }

    ctrl.error = false;
    ctrl.doneLoading = false;

    // Current entry
    // ctrl.currentTask = AddTimeService.getCurrentTask();

    // Entries
    ctrl.entries = AddTimeService.getEntries();
    ctrl.entries.$loaded().then(function () {
        ctrl.doneLoading = true;
    });

    // // TODO: remove this logic here to the addTime Controller!
    
    // // Add a start entry if we are on today and no entries in yet.
    // ctrl.entries.$loaded().then(function () {
    //     ctrl.doneLoading = true;
    //     if (ctrl.entries.length === 0) {
    //         // Instead of just adding an entry, ask the user for what to do with some suggestions.
    //         // Add the current timestamp
    //         var timestamp = Date.now();            
    //         AddTimeService.addStartTime(timestamp);
    //     } else {
    //         // Found entries, so we should make sure that start times are cleaned.
    //         AddTimeService.resetStartTimes();
    //     }
    // })
    //     .catch(function (error) {
    //         console.log("Error:", error);
    //     });

    // updateCurrentTask
    // Copy / Clone text and project to current timer
    ctrl.updateCurrentTask = function (entry) {
        AddTimeService.updateCurrentTask(entry);
    };

    // Continue task feature
    // Tracks current timer and continues with the selected one
    ctrl.continueEntry = function (entry) {
        AddTimeService.addEntry().then(function(){
            AddTimeService.updateCurrentTask(entry);
        });
    };

    // Add the current timer to this task
    ctrl.addEntryToTask = function (GroupTaskData) {
        AddTimeService.updateCurrentTask(GroupTaskData).then(function(){
            AddTimeService.addEntry();
        });
    };

    // Delete an entry has some special tasks: Update the next entry's start timestamp (next in timeline, so after the deleting entry).
    ctrl.deleteEntry = function (entry) {
        AddTimeService.deleteEntry(entry);
    };

    // Entry update
    // Needs the key and some data to merge with current Entry
    ctrl.updateEntry = function (entryKey, entryData) {
        AddTimeService.updateEntry(entryKey, entryData, true);
    };
}

angular
    .module('components.time')
    .controller('TimelineController', TimelineController);