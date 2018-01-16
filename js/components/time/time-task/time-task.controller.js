function TimeTaskController($q, AddTimeService, clipboard, $filter) {
    var ctrl = this;

    // ng-change can't get $event! We need workaround with focusCallback
    ctrl.clipboardCopy = function (GroupData) {
        // Filter the duration to the wanted format
        duration = $filter('timestampInDecimalHours')(GroupData.durationNotChecked);
        // TODO-feature: Copy what was configured
        clipboard.copyText(duration);
        // Save the state of the checkbox
        ctrl.updateGroupStatus(GroupData, GroupData.checkedState);
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

    // Focus input
    focus('newTaskProject');

    // Current entry
    // TODO: Needed ?
    // ctrl.currentTask = AddTimeService.getCurrentTask();

    // build custom entries
    // ctrl.entriesCurrentGroups = {};
    ctrl.groupsCurrent = {};        // the "open" tasks (internal or work)
    ctrl.groupsChecked = {};        // the "done" tasks (internal or work)
    ctrl.groupsUncheckable = {};    // Will hold the private/breaks and trust entries


    // Call the data etc.
    // New grouped current time entries
    // TODO: Of course it would be even better to not have to reference the user
    // But we have it already, seems to be strange to promise again the userPromise...
    // Because we have the user here already.
    var queryRef = ctrl.firebaseRef.getTimeReference(ctrl.user);
    // Order the query, from recent to older entries
    var query = queryRef.orderByChild("order");
    // TODO: We could get rid of the ordering, if we save every entry into the "order" timestamp instead the firebase one.

    // CONTINUE TASK
    // Update the groups on load and all changes of the child data
    query.on('value', function (snapshot) {
        // Resetting output
        ctrl.groupsCurrent = {};        // the "open" tasks (internal or work)
        ctrl.groupsChecked = {};        // the "done" tasks (internal or work)
        ctrl.groupsUncheckable = {};    // Will hold the private/breaks and trust entries
        // Apply the changes
        updateContinuedTasks(snapshot);
    });

    // Create a synchronized array
    ctrl.entries = AddTimeService.getEntries();
    ctrl.entries.$loaded().then(function () {
        ctrl.doneLoading = true;
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

    // Continue a task/group
    // This simply takes a entry and gives over to continueEntry above
    ctrl.continueGroup = function (GroupTaskData) {
        // We just try to access any of the tasks (could be the first one because of the object
        var oneOfTheTasks = GroupTaskData.tasks[Object.keys(GroupTaskData.tasks)[0]];
        // Continue this task
        ctrl.continueEntry(oneOfTheTasks);
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
        // But we don't want an update on the group ID (false)
        AddTimeService.updateEntry(entryKey, entryData, false);
    };

    //
    // TODO: Check the following logic to move into service
    //

    // Continued Task handler
    function updateContinuedTasks(snapshot) {

        var groupsNew = {};
        // Iterate over all the data and prepare new object
        snapshot.forEach(function (data) {
            entry = data.val();
            var projectName = entry.project || '';
            var taskName = entry.task || '';
            var groupType = entry.type || '';
            var groupIdentifaction = entry.group || '';

            // This is probably only a fallback scenario.
            if (!groupIdentifaction){
                groupId = ctrl.helperService.getGroupId(groupsNew,
                    projectName,
                    taskName,
                    groupType,
                    true
                );
            } else {
                groupId = groupIdentifaction;
            }


            // Make sure the elements are set
            // The groups
            // Why typeof === function? It looks like there are cases like "watch" which is a function. (ff only)
            // Not sure how to handle this correctly. For now we just override it anyway.
            if (groupsNew[groupId] === undefined || typeof groupsNew[groupId] === 'function') {
                groupsNew[groupId] = {};
                groupsNew[groupId]['tasks'] = {};
                groupsNew[groupId].amountAll = 0;
                groupsNew[groupId].amountNotChecked = 0;
                groupsNew[groupId].amountChecked = 0;
                groupsNew[groupId].checkedState = '';
                groupsNew[groupId].durationNotChecked = 0;
                groupsNew[groupId].durationChecked = 0;
                groupsNew[groupId].group = groupId;
                groupsNew[groupId].task = taskName;
                groupsNew[groupId].project = projectName;
                groupsNew[groupId].type = groupType;
                groupsNew[groupId].timestamp = 0; // initial timestamp, we use for ordering
                groupsNew[groupId].showDetails = true; // Show details per default
                //console.log('GroupID created:' + groupId);
            }

            // Sum up
            groupsNew[groupId].amountAll += 1;
            groupsNew[groupId]['tasks'][data.key] = entry;

            // Add the latest timestamp to the group
            if (groupsNew[groupId].timestamp < entry.timestamp) {
                groupsNew[groupId].timestamp = entry.timestamp;
            }

            // Add specific data with some conditions
            if (entry.checked) {
                groupsNew[groupId].amountChecked += 1;
                groupsNew[groupId].durationChecked += entry.timestampDuration;
            } else {
                groupsNew[groupId].amountNotChecked += 1;
                groupsNew[groupId].durationNotChecked += entry.timestampDuration;
            }

        });

        // TODO: only the OPEN tasks are updated correctly.
        // If entry moves from private or done to OPEN it stays in the old array somehow.
        // Also if switched from trust to private
        // Clean up the end result of groups
        for (var groupId in groupsNew) {
            if (groupsNew.hasOwnProperty(groupId)) {
                // Verify the type, and ignore "break" and "trust"
                if ((groupsNew[groupId].type === 'trust') || (groupsNew[groupId].type === 'private')) {
                    ctrl.groupsUncheckable[groupId] = groupsNew[groupId];
                    // TODO: delete needed ?
                    delete ctrl.groupsCurrent[groupId];
                    delete ctrl.groupsChecked[groupId];
                } else if (groupsNew[groupId].type === 'system') {
                    // We ignore system entries
                    continue;
                } else {
                    // Internal or work is checkable:

                    // Verifying the "checked" state
                    if (groupsNew[groupId].amountChecked == 0) {
                        // not checked
                        groupsNew[groupId].checkedState = false;
                        groupsNew[groupId].indeterminate = false;

                        ctrl.groupsCurrent[groupId] = groupsNew[groupId];
                        delete ctrl.groupsChecked[groupId];
                        delete ctrl.groupsUncheckable[groupId];
                    } else if (groupsNew[groupId].amountChecked == groupsNew[groupId].amountAll) {
                        // all tasks are checked
                        groupsNew[groupId].checkedState = true;
                        groupsNew[groupId].indeterminate = false;
                        groupsNew[groupId].showDetails = false;

                        // Place entry and remove from other
                        ctrl.groupsChecked[groupId] = groupsNew[groupId];
                        delete ctrl.groupsCurrent[groupId];
                        delete ctrl.groupsUncheckable[groupId];
                    } else {
                        // amount of tasks checked is not amount of tasks, means mixed
                        groupsNew[groupId].checkedState = false;
                        groupsNew[groupId].indeterminate = true;
                        groupsNew[groupId].showDetails = true; // TODO: or even kind of warning?

                        ctrl.groupsCurrent[groupId] = groupsNew[groupId];
                        delete ctrl.groupsChecked[groupId];
                        delete ctrl.groupsUncheckable[groupId];
                    }
                }
            }
            // Delete the group in new if there is no entry anymore
            if (Object.keys(groupsNew).length == 0) {
                // TODO: check whats up with this:
                // console.log('deleting for what ????????????????:');
                // console.log(groupId);
                delete groupsNew[groupId];
            }
        }

        // TODO: return arrays for ng repeat and filters
        // ctrl.entriesArray = [];
        // angular.forEach(ctrl.entriesAll, function(element) {
        //     ctrl.entriesArray.push(element);
        // });
        // console.log(ctrl.entriesArray);
    }

    // Group update status checked on several tasks
    ctrl.updateGroupStatus = function (taskData, status) {
        var checked = false;
        if (status === undefined) {
            if (taskData.indeterminate) {
                checked = true;
            } else {
                checked = !taskData.checkedState; // the new state is the opposite from the current
            }
        } else {
            // If status is given, we force it.
            checked = status;
        }
        for (var taskKey in taskData.tasks) {
            var Entry = ctrl.entries.$getRecord(taskKey); // record with $id === nextEntryKey or null
            Entry.checked = checked;
            // Save Entry
            ctrl.entries.$save(Entry).then(function (queryRef) {
                // data has been saved to our database
                //console.log("Entry (update Group) entry saved with index" + queryRef.key)
            });
        }
    };

    // Group update data on all sub entries belonging to this task
    ctrl.updateGroupData = function (taskData) {
        // // Check if there is a group id we need to apply
        var entries = ctrl.entries;
        var groupId = ctrl.helperService.getGroupId(entries,
            taskData.project,
            taskData.task,
            taskData.type,
            false
        );

        for (var taskKey in taskData.tasks) {
            var Entry = ctrl.entries.$getRecord(taskKey); // record with $id === nextEntryKey or null
            Entry.project = taskData.project;
            if (groupId){
                Entry.group = groupId;
            }
            Entry.task = taskData.task;
            Entry.type = taskData.type;
            // Save Entry
            ctrl.entries.$save(Entry).then(function (queryRef) {
                // data has been saved to our database
                //console.log("Entry (update Group) entry saved with index" + queryRef.key)
            });
        }
    };

}


angular
    .module('components.time')
    .controller('TimeTaskController', TimeTaskController);