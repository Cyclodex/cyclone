function TimelineController($q, AddTimeService) {
    var ctrl = this;

    // TODO: move "copy" out from here, into service something like that.
    // Angular-clipboard
    ctrl.copySuccess = function () {
        console.log('Copied time!');
    };
    ctrl.copyFail = function (err) {
        console.error('Error!', err);
        console.info('Not supported browser, press Ctrl+C to copy time');
    };

    // Load the different time types
    ctrl.types = ctrl.timeTypesService;
    // TODO: Make this a configuration option or save it in the firebasedb

    ctrl.error = false;
    ctrl.doneLoading = false;

    // Focus input
    focus('newTaskProject');

    // Current entry
    // ctrl.currentTask = AddTimeService.getCurrentTask();

    // Entries
    ctrl.entries = AddTimeService.getEntries();
    // Add a start entry if we are on today and no entries in yet.
    ctrl.entries.$loaded().then(function () {
        ctrl.doneLoading = true;
        if (ctrl.entries.length === 0) {
            var timestamp = Date.now();
            var duration = 0;
            var start = timestamp;
            // TODO: Instead of just adding an entry, ask the user for what to do with some suggestions.
            ctrl.entries.$add({
                text: 'Starting the day',
                project: 'CYCLONE',
                checked: true,
                type: 'system',
                timestamp: timestamp,
                timestampStart: start,
                timestampDuration: duration,
                order: -timestamp,
                user: ctrl.user.username // Now it takes the first part of the email address of the logged in user
            }).then(function (queryRef) {
                // Entry added, now do something
                console.log("Auto starting the day entry added!");
            });
        }
    })
        .catch(function (error) {
            console.log("Error:", error);
        });

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

    // Entry update. Needs the key and some data to merge with current Entry
    ctrl.updateEntry = function (entryKey, entryData) {
        AddTimeService.updateEntry(entryKey, entryData);
    };
}

angular
    .module('components.time')
    .controller('TimelineController', TimelineController);