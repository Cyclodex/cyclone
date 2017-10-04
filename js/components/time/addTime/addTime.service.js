function AddTimeService(firebaseRef, $firebaseArray, $firebaseObject, AuthService, stateService, moment, $q, helperService, firebaseRef, $timeout, cfpLoadingBar){
    var ctrl = this;

    var user = AuthService.getUser();
    var refCurrentTask = firebaseRef.getCurrentTaskReference(user);
    ctrl.currentTask = $firebaseObject(refCurrentTask);

    // ctrl.newEntryManualTime = null; // fails if null
    ctrl.user = AuthService.getUser();

    var refTime = firebaseRef.getTimeReference(user);
    // Order the query, from recent to older entries
    var queryTime = refTime.orderByChild("order");
    // Create a synchronized array
    ctrl.entries = $firebaseArray(queryTime);


    var service = {};
    service.checkCurrentTask = function () {
        var objCurrentTask = $firebaseObject(refCurrentTask);
        return objCurrentTask.$loaded()
            .then(function(data) {
                if (data.$value === null) {
                    data.$value = currentTask.default;
                    data.$save().then(function(refcurrentTask) {
                        // Successfully created default value of currentTask
                    }, function(error) {
                        console.log("Error:", error);
                    });
                    return data;
                }
                return data;
            });
    };
    service.saveCurrentTask = function (currentTask) {
        return currentTask.$save().then(function(refCurrentTasks) {
            // Success
        }, function(error) {
            console.log("Error:", error);
        });
    };
    service.getCurrentTask = function(){
        return ctrl.currentTask;
    };
    // TODO: getCurrentTaskManualTime() not done yet
    /*service.getCurrentTaskManualTime = function(currentTask) {
        console.log(currentTask);
        // Get the right day (the one we are looking at)
        var manualTime = new Date();
        var currentDate = stateService.getCurrentDate();
        manualTime.setTime(currentDate.valueOf());

        // And manually set the hours + minutes
        var hours = ctrl.currentTask.newEntryManualTime.getHours();
        var minutes = ctrl.currentTask.newEntryManualTime.getMinutes();
        console.log(hours);
        console.log(minutes);
        manualTime.setHours(hours);
        manualTime.setMinutes(minutes);
        manualTime.setSeconds(0);
        //console.log("hours: " + hours + ":" + minutes);
        //console.log(manualTime);
        //console.log(manualTime.getTime());
        timestamp = manualTime.getTime();
        console.log("what we return:");
        console.log(timestamp);
        return timestamp;
    };*/

    // We need to get / tell the service which manual time we have.
    // TODO: why is this not part of the currentTask? The date maybe can't be saved into fb.
    service.setCurrentTaskManualTime = function(time){
        ctrl.newEntryManualTime = time;
    };

    service.getEntries = function (){
        var refTime = firebaseRef.getTimeReference(user);
        var queryTime = refTime.orderByChild("order");
        return $firebaseArray(queryTime);
    };

    // Initially set lastEntry to now.
    var lastEntryTimestamp = Date.now();
    // Duration
    ctrl.currentDuration = 0;
    this.lastEntryTimestamp = lastEntryTimestamp; // So the first entry works


    // ADD
    // Add new entry to current week and day
    service.addEntry = function () {
        // Promise
        return $q(function (resolve, reject) {
            // Default time is now
            var timestamp = Date.now();
            var today = moment();

            // Get the right day (the one we are looking at)
            var currentDate = stateService.getCurrentDate();

            // Check if we need to add some manual end time.
            // This is allowed for TODAY and also PAST entries
            // Maybe someone wants to fill his yesterday or whatever.
            if (ctrl.newEntryManualTime !== undefined &&
                ctrl.newEntryManualTime.value !== undefined &&
                ctrl.newEntryManualTime.value !== null
            ) {
                // If we have a manual end time, we don't know the prev time entry
                // We need a date of the day we are on.
                var manualTime = new Date();
                // Get the right day (the one we are looking at)
                manualTime.setTime(currentDate.valueOf());

                // And manually set the hours + minutes
                var hours = ctrl.newEntryManualTime.value.getHours();
                var minutes = ctrl.newEntryManualTime.value.getMinutes();
                manualTime.setHours(hours);
                manualTime.setMinutes(minutes);
                manualTime.setSeconds(0);
                timestamp = manualTime.getTime();

                // TODO: OK or needs promise ?
                // var timestamp = service.getCurrentTaskManualTime();
                duration = 0;
                // For now we save the same start time as end time. If there is a previous entry, we will update it later in code.
                // But this allows us to have first manual end time entries which have 0 duration.
                start = timestamp;

            } else {
                // No manual time, we take the NOW
                // But only if the date is today!
                // This is not allowed on past days. (doesn't make sense there)
                if (!currentDate.isSame(today, 'day')) {
                    console.error('OVER AND OUT, not on today!');
                    // TODO: Show a warning, info or whatever
                    return false;
                }

                // Defines the duration and start time
                var duration = service.cleanupDuration(timestamp - ctrl.lastEntryTimestamp);
                var start = ctrl.lastEntryTimestamp;
            }

            // Check if the entry should be marked as private (break)
            // TODO: Lets change the type field after the user entered a project; not here on add.
            // Check the project name for auto assignment
            if (ctrl.currentTask.newEntryProject !== undefined) {
                var breakMatches = ctrl.currentTask.newEntryProject.match(/break/i);
                if (breakMatches) {
                    ctrl.currentTask.newEntryType = 'private';
                }
            } else {
                ctrl.currentTask.newEntryProject = '';
            }
            if (ctrl.currentTask.newEntryType === undefined) {
                ctrl.currentTask.newEntryType = 'work';
            }

            // Project name empty if not yet set
            if (ctrl.currentTask.newEntryProject === undefined) {
                ctrl.currentTask.newEntryProject = '';
            }

            // newEntryText empty if not yet set
            if (ctrl.currentTask.newEntryText === undefined) {
                ctrl.currentTask.newEntryText = '';
            }

            // newEntryTask
            if (ctrl.currentTask.newEntryTask === undefined) {
                ctrl.currentTask.newEntryTask = '';
            }

            //
            // ADD new entry into DB
            //

            // Check if there is a group id we need to apply
            groupId = helperService.getGroupId(ctrl.entries, ctrl.currentTask.newEntryProject, ctrl.currentTask.newEntryTask, ctrl.currentTask.newEntryType, timestamp);

            ctrl.entries.$add({
                text: ctrl.currentTask.newEntryText,
                project: ctrl.currentTask.newEntryProject,
                group: groupId,
                task: ctrl.currentTask.newEntryTask,
                checked: false,
                type: ctrl.currentTask.newEntryType,
                timestamp: timestamp, // we don't want milliseconds - just seconds! (rounds it as well),
                timestampStart: start,
                timestampDuration: duration,
                order: -timestamp,
                user: ctrl.user.username,
            }).then(function (refTime) {
                // Entry added, now do something
                // Clear the input fields again
                ctrl.currentTask.newEntryText = '';
                ctrl.currentTask.newEntryProject = '';
                ctrl.currentTask.newEntryTask = '';
                ctrl.newEntryManualTime = '';
                ctrl.currentTask.newEntryType = 'work';
                ctrl.currentTask.$save().then(function(response) {
                }, function(error) {
                    console.log("Error:", error);
                    deferred.reject(error);
                });

                // TODO: put the following logic into a function to get called also by other change options later
                // Which id and location did we save the entry? We need to check the prev and next entry to update the duration!
                var newEntryKey = refTime.key;
                // Get location in the array
                var newEntryIndex = ctrl.entries.$indexFor(newEntryKey); // returns location in the array

                //
                // check the previous entry to know when the new entry started, update timestampStart and duration of the new entry
                //
                // The new entry
                var newEntry = ctrl.entries.$getRecord(newEntryKey); // record with $id === prevEntryKey or null

                // Get prevEntry and load its timestamp which we need as timestampStart
                // Also we need to update the timestamp
                var prevEntryKey = ctrl.entries.$keyAt(newEntryIndex + 1); // previous entry (if existing)
                var prevEntry = ctrl.entries.$getRecord(prevEntryKey); // record with $id === prevEntryKey or null


                // If we have a prev entry we can check when it finished
                // This will not happen if the entry is the first one
                if (prevEntry !== null) {
                    // Get prev timestamp which is the start of the new entry and calculate the duration
                    newEntry.timestampStart = prevEntry.timestamp;
                    newEntry.timestampDuration = service.calculateDuration(newEntry);

                }

                // Save new entry
                ctrl.entries.$save(newEntry).then(function (refTime) {
                    // data has been saved to our database
                    console.log("newEntry entry saved with index" + refTime.key)

                    // Temporary solution, for setting focus again
                    ctrl.focusNewEntryProject = true;

                    //
                    // update next entry
                    //
                    // There can also be an item after the new added one, so we need to give over the new timestampStart and update duration of it
                    // Get prev timestamp which is the start of the new entry and calculate the duration
                    var nextEntryKey = ctrl.entries.$keyAt(newEntryIndex - 1); // next entry (if existing)
                    var nextEntry = ctrl.entries.$getRecord(nextEntryKey); // record with $id === nextEntryKey or null
                    if (nextEntry !== null) {
                        nextEntry.timestampStart = newEntry.timestamp;
                        nextEntry.timestampDuration = service.calculateDuration(nextEntry);
                        // Save nextEntry
                        ctrl.entries.$save(nextEntry).then(function (refTime) {
                            // data has been saved to our database
                            console.log("nextEntry entry saved with index" + refTime.key)
                            resolve(refTime);
                        });
                    } else {
                        resolve(refTime);
                    }
                });
            })
            .catch(function (error) {
                console.log("Error:", error);
                reject(error);
            });
        });
    };

    // Entry update
    // Needs the key and some data to merge with current Entry
    service.updateEntry = function (entryKey, entryData) {
        var Entry = ctrl.entries.$getRecord(entryKey); // record with $id === nextEntryKey or null
        Entry.project = entryData.project;
        // Check if there is a group id we need to apply
        Entry.group = helperService.getGroupId(ctrl.entries, entryData.project, entryData.task, entryData.type, entryData.timestamp, entryData.$id);
        Entry.task = entryData.task;
        Entry.type = entryData.type;
        // Merge the entryData into the Entry object
        Object.assign(Entry, entryData);
        // Save Entry
        ctrl.entries.$save(Entry).then(function (queryRef) {
            // data has been saved to our database
            //console.log("Entry (updateEntry) saved with index" + queryRef.key)
        });
    };

    // Delete entry
    // Has some special tasks: Update the next entry's start timestamp
    // (next in timeline, so after the deleting entry).
    service.deleteEntry = function (entry) {
        // Promise
        return $q(function (resolve, reject) {
            // This did not work out with the other entries, so reloading them
            // But this could be improved a lot, this is not how it should be
            var entries = service.getEntries();
            entries.$loaded().then(function(){
                // Get the start timestamp of this entry, we will give this over to the next entry, so it fills the deleted gap again.
                var deleteEntryTimestampStart = entry.timestampStart;
                var deleteEntryKey = entry.$id;
                var deleteEntryIndex = entries.$indexFor(deleteEntryKey); // returns location in the array
                //
                // prepare update next entry
                //
                var nextEntryKey = entries.$keyAt(deleteEntryIndex - 1); // next entry (if existing)
                var nextEntry = entries.$getRecord(nextEntryKey); // record with $id === nextEntryKey or null

                entry = entries.$getRecord(entry.$id);

                // Delete entry
                entries.$remove(entry).then(function (response) {
                    // Deleted
                    // Update the time range of the next entry to fill the gap
                    if (nextEntry !== null) {
                        nextEntry.timestampStart = deleteEntryTimestampStart;
                        // Update the duration entry
                        nextEntry.timestampDuration = service.calculateDuration(nextEntry);
                        // Save nextEntry
                        entries.$save(nextEntry).then(function () {
                            // data has been saved to our database
                            console.log("(removed) nextEntry saved with index" + refTime.key)
                            resolve(refTime);
                        }, function(error) {
                            console.log("Error:", error);
                            reject(error);
                        });
                    } else {
                        resolve(response);
                    }
                }, function(error) {
                    console.log("Error:", error);
                    reject(error);
                });
            });

        });
    };

    // Update current task (ex copy / clone)
    // Apply project, task, text and type to current timer
    service.updateCurrentTask = function (entry) {
        // Promise
        return $q(function (resolve, reject) {
            ctrl.currentTask.newEntryProject = entry.project || null;
            ctrl.currentTask.newEntryTask = entry.task || null;
            ctrl.currentTask.newEntryText = entry.text || null;
            ctrl.currentTask.newEntryType = entry.type || null;
            ctrl.currentTask.$save().then(function(response) {
                resolve(response);
            }, function(error) {
                console.log("Error:", error);
                reject(error);
            });
        });
    };


    // Calculates the difference for duration on entries.
    service.calculateDuration = function(entry) {
        var timestampDuration = (service.cleanupDuration(entry.timestamp) - service.cleanupDuration(entry.timestampStart));
        return service.cleanupDuration(timestampDuration);
    };

    // date function uses milliseconds, but it messes up when using directly.
    // We need to cleanup (Math.floor) and count it *1000 again. Not sure if date object would be better...
    service.cleanupDuration = function(timestampDuration) {
        //console.log('incomming timestamp' + timestampDuration);
        timestampDuration = Math.floor(timestampDuration / 1000) * 1000;
        //console.log('cleaned timestamp' + timestampDuration);
        return timestampDuration;
    };

    // Realtime duration display
    service.updateDurations = function() {
        ctrl.currentDuration = ((Date.now() - ctrl.lastEntryTimestamp));
        return ctrl.currentDuration;
        // $timeout(service.updateDurations, 1000, true);
    };

    // Update current time
    service.updateCurrentTimer = function() {
        var refTime = firebaseRef.getTimeReference(ctrl.user);
        // Attach an asynchronous callback to read the data at our posts reference
        var lastEntryRef = refTime.orderByChild("order").limitToFirst(1);
        lastEntryRef.on("value", function (snapshot) {
            // object in object (but only 1 because of limit above)
            snapshot.forEach(function (data) {
                ctrl.lastEntryTimestamp = data.val().timestamp;
            });
        }, function (errorObject) {
            console.log("The read failed: " + errorObject.code);
        });
    };
    service.updateCurrentTimer();

    return service;
}

angular
    .module('components.time')
    .factory('AddTimeService', AddTimeService);