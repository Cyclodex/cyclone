
//
// TIME
//
angular.module("cycloneApp").controller("TimeCtrl", ["$scope", "Auth", "$firebaseArray", "focus", "$timeout", "$rootScope", "$route",
    function($scope, Auth, $firebaseArray, focus, $timeout, $rootScope, $route) {
        // check the route when ready
        $rootScope.$on('$routeChangeSuccess', function () {
            $rootScope.viewType = $route.current.params.type;

            $scope.error = false;
            $scope.doneLoading = false;
            $scope.doneLoadingGroups = false;

            // Note: This is defining the type and values also for the stats.
            if ($rootScope.viewType == 'today') {
                $rootScope.year = moment().year();
                $rootScope.weekNumber = moment().week();
                $rootScope.weekDay = moment().weekday();
                $scope.addEntryEnabled = true;
                $scope.currentDate = new Date;
            } else if ($rootScope.viewType == 'archive') {
                // TODO: do we need this?
                $rootScope.weekDay = $route.current.params.weekDay;
                $rootScope.weekNumber = $route.current.params.weekNumber;
                $rootScope.year = $route.current.params.year;
                $scope.addEntryEnabled = false;

                // Read the date out of current week number and day number from current page
                $scope.currentDate = moment()
                    .week($rootScope.weekNumber)
                    .weekday($rootScope.weekDay)
                    .toDate();

            } else if ($rootScope.viewType == 'archive-date') {
                // This is the archive in use, simple by using real dates
                // eg. index.html#/archive-date/2016/09/12
                var requestedDate = $route.current.params.year
                            + '-' + $route.current.params.month
                            + '-' + $route.current.params.day;
                // Parse the date from the URL with different formats
                requestedDate = moment(requestedDate,
                    [
                        'YYYY-MMMM-DD'  // DE long month name
                        ,'YYYY-MMM-DD'  // DE short month name
                        ,'YYYY-MM-DD'   // DE date format short
                        ,'YYYY-M-DD'   // DE date format short
                        //,'YYYY-DD-MM'    // US - date format
                    ],
                    true // strict parsing
                );

                if (!requestedDate.isValid()){
                    $scope.error = 'Invalid date entered!';
                }

                // Convert the date to what we need:
                $rootScope.weekDay = requestedDate.weekday();
                $rootScope.weekNumber = requestedDate.week();
                $rootScope.year = requestedDate.year();
                $scope.addEntryEnabled = false;

                $scope.currentDate = requestedDate.toDate();
            }

            // ARCHIVE day jumping
            // TODO: Make the current date recognized
            // so if the next or prev date is today, go to today.
            // prev + next day (archive day switching)
            var currentDate = moment($scope.currentDate);
            var prevDate = currentDate.clone();
            var nextDate = currentDate.clone();
            var today = moment();

            // PREV
            prevDate = prevDate.subtract(1, 'days');
            $scope.prevDateLink = '#archive-date/' + prevDate.format("YYYY/MM/DD");

            // NEXT (not for the future)
            nextDate = nextDate.add(1, 'days');
            if (nextDate.isBefore(today, 'day')) {
                $scope.nextDateLink = '#archive-date/' + nextDate.format("YYYY/MM/DD");
            } else if (nextDate.isSame(today, 'day')){
                    $scope.nextDateLink = '#today';
            } else {
                $scope.nextDateLink = false;
            }

            // Define the path for reading and saving the entries
            var year = $rootScope.year;
            var weekNumber = $rootScope.weekNumber;
            var todayNumber = $rootScope.weekDay;

            var lastEntryTimestamp = Date.now();

            // Duration
            $scope.currentDuration = 0;
            $scope.currentDurationHasHours = false;
            $scope.lastEntryTimestamp = lastEntryTimestamp; // So the first entry works

            // Show the current date
            $scope.today = lastEntryTimestamp;

            // Observe the user and then call the data
            Auth.$onAuthStateChanged(function(user) {
                if (user) {
                    // We save the entries in the current year, week and day, but most important by every user ()
                    var ref = firebase.database().ref();

                    // New grouped current time entries
                    var queryGroupRef = ref.child("time/" + user.uid + "/" + year + "/" + weekNumber + "/" + todayNumber);
                    // Order the query, from recent to older entries
                    // However this only works with the orderBy in the template right now.
                    // var queryGroup = queryGroupRef.orderByChild("order");
                    // TODO: thats not working out, what heppens when we check a group as "checked", it would disappear and we don't know anymore about it.
                    // TODO: That means we have to make sure we still know about the group...
                    var queryGroup = queryGroupRef.orderByChild("order");
                    // var queryGroup = queryGroupRef.orderByChild("checked").equalTo(false);
                    var groups = {};

                    // Lets call this only once, and for all updates
                    // TODO: implement this when there are child__changes / updates.
                    queryGroup.once('value').then(function(snapshot) {
                        $scope.entriesCurrentGroups = [];

                        // Iterate over all the data and prepare new object
                        snapshot.forEach(function(data) {
                            entry = data.val();

                            var projectName        = entry.project;
                            var projectTask        = entry.text;
                            var groupID            = 'noGroup';

                            if (entry.groupID !== undefined) {
                                groupID         = entry.groupID;
                            }

                            // Make sure the elements are set
                            // The project object
                            if (groups[projectName] === undefined) {
                                groups[projectName] = {};
                            }
                            // The specific task
                            if (groups[projectName][projectTask] === undefined) {
                                groups[projectName][projectTask] = {};
                                groups[projectName][projectTask]['tasks'] = {};
                                groups[projectName][projectTask].amount = 0;
                                groups[projectName][projectTask].amountChecked = 0;
                                groups[projectName][projectTask].checkedState = '';
                                groups[projectName][projectTask].duration = 0;
                                groups[projectName][projectTask].durationChecked = 0;
                            }
                            // All the tasks will saved within the task id
                            // if (groups[projectName][projectTask]['tasks'] === undefined) {
                            // }
                            // if (groups[projectName][projectTask].duration === undefined) {
                            // }
                            // The timestamp is a testing behaviour now for the grouping ID
                            // if (groups[projectName][projectTask].timestamp === undefined) {
                            //     groups[projectName][projectTask].timestamp = entry.timestamp;
                            // }

                            // Sum up the durations and data
                            groups[projectName][projectTask].amount += 1;
                            groups[projectName][projectTask]['tasks'][data.key] = entry;

                            // Add specific data with some conditions
                            if (entry.checked) {
                                groups[projectName][projectTask].amountChecked += 1;
                                groups[projectName][projectTask].durationChecked += entry.timestampDuration;
                            } else {
                                groups[projectName][projectTask].duration += entry.timestampDuration;
                            }

                            // checking the "checked" state
                            // TODO: This will happen on every task, it would be better to do it in the end, on the last iteration.
                            if (groups[projectName][projectTask].amountChecked == 0) {
                                // not checked
                                groups[projectName][projectTask].checkedState = false;
                                groups[projectName][projectTask].indeterminate = false;
                            } else if (groups[projectName][projectTask].amountChecked == groups[projectName][projectTask].amount) {
                                // all tasks are checked
                                groups[projectName][projectTask].checkedState = true;
                                groups[projectName][projectTask].indeterminate = false;
                            } else {
                                // amount of tasks checked is not amount of tasks, means mixed
                                groups[projectName][projectTask].checkedState = false;
                                groups[projectName][projectTask].indeterminate = true;
                            }
                        });

                        // make sure only the projects with multiple entries are printed
                        // So we iterate over the object, remove the task entries which have an amount of 1
                        // And finally if no task is in the group, we remove the project as well.
                        for (var key in groups) {
                            if (groups.hasOwnProperty(key)) {
                                tasks = groups[key];
                                for (var task in tasks) {
                                    if (tasks.hasOwnProperty(task)) {
                                        if (tasks[task].amount === 1) {
                                            delete groups[key][task];
                                        }
                                    }
                                }
                                if (Object.keys(tasks).length == 0) {
                                    delete groups[key];
                                }
                            }
                        }

                        $scope.entriesCurrentGroups = groups;
                        $scope.doneLoadingGroups = true;
                    });



                    // Timelog entries:
                    var queryRef = ref.child("time/" + user.uid + "/" + year + "/" + weekNumber + "/" + todayNumber);
                    // Order the query, from recent to older entries
                    // However this only works with the orderBy in the template right now.
                    var query = queryRef.orderByChild("order");

                    // Create a synchronized array
                    $scope.entries = $firebaseArray(query);
                    $scope.entries.$loaded()
                        .then(function() {
                            $scope.doneLoading = true;
                        })
                        .catch(function(error) {
                            console.log("Error:", error);
                        });


                    /**
                     * Check if there is any entry, if not we add a manual start entry.
                     * This helps to not loose the time in specific situations.
                     */
                    if ($rootScope.viewType == 'today') {
                        queryRef.once("value")
                            .then(function(snapshot) {
                                if (snapshot.numChildren() == 0) {
                                    //
                                    // ADD an automatic entry as start of the day
                                    // The user can still delete if he wants.
                                    //
                                    var timestamp = Date.now();
                                    var duration = 0;
                                    var start = timestamp;
                                    $scope.entries.$add({
                                        text: 'Starting the day',
                                        project: 'CYCLONE',
                                        checked: true,
                                        type: 'system',
                                        timestamp: timestamp,
                                        timestampStart: start,
                                        timestampDuration: duration,
                                        order: -timestamp,
                                        user: $rootScope.user // Now it takes the first part of the email address of the logged in user
                                    }).then(function(queryRef) {
                                        // Entry added, now do something
                                        console.log("Auto starting the day entry added!");
                                    });
                                }
                                $scope.doneLoading = true;
                            });
                    }

                    // Update current time
                    // Attach an asynchronous callback to read the data at our posts reference
                    // TODO: Is it okey to reuse the queryRef ?
                    var lastEntryRef = queryRef.orderByChild("order").limitToFirst(1);
                    lastEntryRef.on("value", function(snapshot) {
                        // object in object (but only 1 because of limit above)
                        // console.log(snapshot);
                        snapshot.forEach(function(data) {
                            $scope.lastEntryTimestamp = data.val().timestamp;
                        });
                    }, function(errorObject) {
                        console.log("The read failed: " + errorObject.code);
                    });

                    updateDurations();

                } else {
                    // No user is signed in.
                }
            }); // End of firebase.auth()

        }); // END of $routeChangeSuccess


        // ADD
        // Add new entry to current week and day
        $scope.addEntry = function() {

            // Default time is now
            var timestamp = Date.now();
            var duration = cleanupDuration(timestamp - $scope.lastEntryTimestamp);
            var start = $scope.lastEntryTimestamp;

            // If the form is not valid, don't add content.
            // TODO: we probably should display a information that it was not added
            // The input field which is invalid however should be marked red already.
            if ($scope.addEntryForm.$invalid){
                return false;
            }

            // Check if we need to add some manual end time.
            if ($scope.newEntryManualTime !== undefined &&
                $scope.newEntryManualTime.value !== undefined &&
                $scope.newEntryManualTime.value !== null
            ) {
                // If we have a manual end time, we don't know the prev time entry
                // We need a date of today
                var manualTime = new Date();
                manualTime.setTime(Date.now());

                // And manually set the hours + minutes
                var hours = $scope.newEntryManualTime.value.getHours();
                var minutes = $scope.newEntryManualTime.value.getMinutes();
                manualTime.setHours(hours);
                manualTime.setMinutes(minutes);
                manualTime.setSeconds(0);
                //console.log("hours: " + hours + ":" + minutes);
                //console.log(manualTime);
                //console.log(manualTime.getTime());
                timestamp = manualTime.getTime();
                duration = 0;
                // For now we save the same start time as end time. If there is a previous entry, we will update it later in code.
                // But this allows us to have first manual end time entries which have 0 duration.
                start = timestamp;

            }

            // Check if the entry should be marked as private (break)
            var newEntryType = 'work';
            if ($scope.newEntryProject !== undefined) {
                var breakMatches = $scope.newEntryProject.match(/break/i);
                if (breakMatches) {
                    newEntryType = 'private';
                }
            } else {
                $scope.newEntryProject = '';
            }

            // newEntryText
            if ($scope.newEntryText !== undefined) {

            } else {
                $scope.newEntryText = '';
            }

            //
            // ADD new entry into DB
            //
            $scope.entries.$add({
                text: $scope.newEntryText,
                project: $scope.newEntryProject,
                checked: false,
                type: newEntryType,
                timestamp: timestamp, // we don't want milliseconds - just seconds! (rounds it as well),
                timestampStart: start,
                timestampDuration: duration,
                order: -timestamp,
                user: $rootScope.user, // Now it takes the first part of the email address of the logged in user
            }).then(function(queryRef) {
                // Entry added, now do something

                // Clear the input fields again
                $scope.newEntryText = '';
                $scope.newEntryProject = '';
                $scope.newEntryManualTime = '';

                // Focus First element now again, so we are ready to type an other task
                focus('newTaskText');

                // Which id and location did we save the entry? We need to check the prev and next entry to update the duration!
                var newEntryKey = queryRef.key;
                // Get location in the array
                var newEntryIndex = $scope.entries.$indexFor(newEntryKey); // returns location in the array

                //
                // check the previous entry to know when the new entry started, update timestampStart and duration of the new entry
                //
                // The new entry
                var newEntry = $scope.entries.$getRecord(newEntryKey); // record with $id === prevEntryKey or null

                // Get prevEntry and load its timestamp which we need as timestampStart
                // Also we need to update the timestamp
                var prevEntryKey = $scope.entries.$keyAt(newEntryIndex + 1); // previous entry (if existing)
                var prevEntry = $scope.entries.$getRecord(prevEntryKey); // record with $id === prevEntryKey or null


                // If we have a prev entry we can check when it finished
                // This will not happen if the entry is the first one
                if (prevEntry !== null) {
                    // Get prev timestamp which is the start of the new entry and calculate the duration
                    newEntry.timestampStart = prevEntry.timestamp;
                    newEntry.timestampDuration = calculateDuration(newEntry);

                }

                // Save new entry
                $scope.entries.$save(newEntry).then(function(queryRef) {
                    // data has been saved to our database
                    console.log("entry saved with index" + queryRef.key)
                });

                //
                // update next entry
                //
                // There can also be an item after the new added one, so we need to give over the new timestampStart and update duration of it
                // Get prev timestamp which is the start of the new entry and calculate the duration
                var nextEntryKey = $scope.entries.$keyAt(newEntryIndex - 1); // next entry (if existing)
                var nextEntry = $scope.entries.$getRecord(nextEntryKey); // record with $id === nextEntryKey or null
                if (nextEntry !== null) {
                    nextEntry.timestampStart = newEntry.timestamp;
                    nextEntry.timestampDuration = calculateDuration(nextEntry);
                    // Save nextEntry
                    $scope.entries.$save(nextEntry).then(function(queryRef) {
                        // data has been saved to our database
                        console.log("entry saved with index" + queryRef.key)
                    });
                }

            });

        };// End of ADD

        // Calculates the difference for duration on entries.
        function calculateDuration(entry) {
            var timestampDuration = (cleanupDuration(entry.timestamp) - cleanupDuration(entry.timestampStart));
            return cleanupDuration(timestampDuration);
        }
        // date function uses milliseconds, but it messes up when using directly.
        // We need to cleanup (Math.floor) and count it *1000 again. Not sure if date object would be better...
        function cleanupDuration(timestampDuration) {
            //console.log('incomming timestamp' + timestampDuration);
            timestampDuration = Math.floor(timestampDuration / 1000) * 1000;
            //console.log('cleaned timestamp' + timestampDuration);
            return timestampDuration;
        }

        // Clone text and project to current timer
        $scope.cloneEntry = function() {
            $scope.newEntryText = this.entry.text;
            $scope.newEntryProject = this.entry.project;
        };

        // Group update checked on several tasks
        $scope.updateGroup = function(taskData) {
            var checked = false;
            if (taskData.indeterminate) {
                checked = true;
            } else {
                checked = !taskData.checkedState; // the new state is the opposite from the current
            }
            for (var taskKey in taskData.tasks) {
                var Entry = $scope.entries.$getRecord(taskKey); // record with $id === nextEntryKey or null
                Entry.checked = checked;
                // Save nextEntry
                $scope.entries.$save(Entry).then(function(queryRef) {
                    // data has been saved to our database
                    console.log("entry saved with index" + queryRef.key)
                });
            }
        };
        // Delete an entry has some special tasks: Update the next (next in timeline, so after the deleting entry) start timesamp.
        $scope.deleteEntry = function() {
            // Get the start timestamp of this entry, we will give this over to the next entry, so it fills the deleted gap again.
            var deleteEntryTimestampStart = this.entry.timestampStart;
            var deleteEntryKey = this.entry.$id;
            var deleteEntryIndex = $scope.entries.$indexFor(deleteEntryKey); // returns location in the array

            //
            // prepare update next entry
            //
            var nextEntryKey = $scope.entries.$keyAt(deleteEntryIndex - 1); // next entry (if existing)
            var nextEntry = $scope.entries.$getRecord(nextEntryKey); // record with $id === nextEntryKey or null

            // Delete entry, and update the next one
            $scope.entries.$remove(this.entry).then(function(ref) {
                // Which id and location did we remove? We need to check the next entry to update the duration of it!
                var deletedEntryKey = ref.key;

                // Update the time range of the next entry to fill the gap
                if (nextEntry !== null) {
                    nextEntry.timestampStart = deleteEntryTimestampStart;
                    // Update the duration entry
                    nextEntry.timestampDuration = calculateDuration(nextEntry);
                    // Save nextEntry
                    $scope.entries.$save(nextEntry).then(function(queryRef) {
                        // data has been saved to our database
                        console.log("entry saved with index" + queryRef.key)
                    });
                }
            });
        };


        // Realtime duration display
        function updateDurations() {
            $scope.currentDuration = ((Date.now() - $scope.lastEntryTimestamp));
            // Set the HasHours expression
            if (((1000 * 60 * 60) - $scope.currentDuration) <= 0) {
                $scope.currentDurationHasHours = true;
            } else {
                $scope.currentDurationHasHours = false;
            }
            $timeout(updateDurations, 1000, true);
        };

    }
]);
