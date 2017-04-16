//
// TIME
//
// TODO: move service related things out of here.
angular.module("cycloneApp").controller("TimeCtrl", ["currentUser", "$scope", "Auth", "$firebaseArray", "focus", "$timeout", "$rootScope", "moment", "timeTypesService", "$stateParams", "$state",
    function(currentUser, $scope, Auth, $firebaseArray, focus, $timeout, $rootScope, moment, timeTypesService, $stateParams, $state) {
        // TODO: move "copy" out from here, into service something like that.
        // Angular-clipboard
        $scope.copySuccess = function () {
            console.log('Copied time!');
        };
        $scope.copyFail = function (err) {
            console.error('Error!', err);
            console.info('Not supported browser, press Ctrl+C to copy time');
        };

        // The different types
        $scope.types = timeTypesService.getTimeTypes();
        // TODO: Make this a configuration option or save it in the firebasedb

        $rootScope.viewType = $stateParams.type;

        $scope.error = false;
        $scope.doneLoading = false;
        $scope.doneLoadingGroups = false;

        var today = moment();

        // Note: This is defining the type and values also for the stats.
        if ($rootScope.viewType == 'today') {
            $rootScope.year = moment().year();
            $rootScope.weekNumber = moment().week();
            $rootScope.weekDay = moment().weekday();
            $scope.addEntryEnabled = true;
            $scope.currentDate = new Date;
            $scope.newEntryType = 'work';
        } else if ($rootScope.viewType == 'archive-date') {
            // This is the archive in use, simple by using real dates
            // eg. index.html#/time/2016/09/12
            var requestedDate = $stateParams.year
                        + '-' + $stateParams.month
                        + '-' + $stateParams.day;
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

            // If the current date is entered, lets move to today as it will handle little bit differently (add time block)
            if (requestedDate.isSame(today, 'day')){
                // TODO: This is still the legacy way, this should be done differently on the routing
                // https://ui-router.github.io/guide/ng1/migrate-to-1_0#state-change-events
                $state.go('time');
            }

            // Convert the date to what we need:
            $rootScope.weekDay = requestedDate.weekday();
            $rootScope.weekNumber = requestedDate.week();
            $rootScope.year = requestedDate.year();
            $scope.addEntryEnabled = false;

            $scope.currentDate = requestedDate.toDate();
        }

        // Day jumping to go to archived / past days
        // prev + next day (archive day switching)
        var currentDate = moment($scope.currentDate);
        var prevDate = currentDate.clone();
        var nextDate = currentDate.clone();


        // PREV
        prevDate = prevDate.subtract(1, 'days');
        $scope.prevDateLink = '#time/' + prevDate.format("YYYY/MM/DD");

        // NEXT (not for the future)
        nextDate = nextDate.add(1, 'days');
        if (nextDate.isBefore(today, 'day')) {
            $scope.nextDateLink = '#time/' + nextDate.format("YYYY/MM/DD");
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
        $scope.lastEntryTimestamp = lastEntryTimestamp; // So the first entry works

        // Show the current date
        $scope.today = lastEntryTimestamp;

        $scope.entriesCurrentGroups = {};
        // Call the data etc.
        // We don't need to observe anymore, because the routing makes sure we have the user
        if (currentUser) {
            // TODO: remove this quick workaround for user
            user = currentUser.user;
            // We save the entries in the current year, week and day, but most important by every user ()
            var ref = firebase.database().ref();

            // New grouped current time entries
            var queryGroupRef = ref.child("time/" + user.uid + "/" + year + "/" + weekNumber + "/" + todayNumber);
            // Order the query, from recent to older entries
            var queryGroup = queryGroupRef.orderByChild("order");

            // CONTINUE TASK
            // Update the groups on load and all changes of the child data
            // queryGroup.once('value').then(function(snapshot) {
            // queryGroup.on('child_changed', function(snapshot) {
            queryGroup.on('value', function(snapshot) {
                updateContinuedTasks(snapshot);
            });

            focus('newTaskProject');

            // Timelog entries:
            var queryRef = ref.child("time/" + user.uid + "/" + year + "/" + weekNumber + "/" + todayNumber);
            // Order the query, from recent to older entries
            // However this only works with the orderBy in the template right now.
            var query = queryRef.orderByChild("order");

            // Create a synchronized array
            $scope.entries = $firebaseArray(query);

            // Add a start entry if we are on today and no entries in yet.
            $scope.entries.$loaded()
                .then(function () {
                    $scope.doneLoading = true;
                    if ($rootScope.viewType == 'today') {
                        if ($scope.entries.length === 0) {
                            var timestamp = Date.now();
                            var duration = 0;
                            var start = timestamp;
                            // TODO: Instead of just adding an entry, ask the user for what to do with some suggestions.
                            $scope.entries.$add({
                                text: 'Starting the day',
                                project: 'CYCLONE',
                                checked: true,
                                type: 'system',
                                timestamp: timestamp,
                                timestampStart: start,
                                timestampDuration: duration,
                                order: -timestamp,
                                user: $rootScope.username // Now it takes the first part of the email address of the logged in user
                            }).then(function (queryRef) {
                                // Entry added, now do something
                                console.log("Auto starting the day entry added!");
                            });
                        }
                    }
                })
                .catch(function (error) {
                    console.log("Error:", error);
                });

            // Update current time
            // Attach an asynchronous callback to read the data at our posts reference
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
                console.log("entry was not added");
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
            // TODO: Lets change the type field after the user entered a project; not here on add.
            // Check the project name for auto assignment
            if ($scope.newEntryProject !== undefined) {
                var breakMatches = $scope.newEntryProject.match(/break/i);
                if (breakMatches) {
                    $scope.newEntryType = 'private';
                }
            } else {
                $scope.newEntryProject = '';
            }
            if ( $scope.newEntryType === undefined){
                $scope.newEntryType = 'work';
            }

            // Project name empty if not yet set
            if ($scope.newEntryProject === undefined) {
                $scope.newEntryProject = '';
            }

            // newEntryText empty if not yet set
            if ($scope.newEntryText === undefined) {
                $scope.newEntryText = '';
            }

            // newEntryGroup
            if ($scope.newEntryGroup === undefined) {
                $scope.newEntryGroup = '';
            }

            //
            // ADD new entry into DB
            //
            $scope.entries.$add({
                text: $scope.newEntryText,
                project: $scope.newEntryProject,
                group: $scope.newEntryGroup,
                checked: false,
                type: $scope.newEntryType,
                timestamp: timestamp, // we don't want milliseconds - just seconds! (rounds it as well),
                timestampStart: start,
                timestampDuration: duration,
                order: -timestamp,
                user: $rootScope.username, // Now it takes the first part of the email address of the logged in user
            }).then(function(queryRef) {
                // Entry added, now do something

                // Clear the input fields again
                $scope.newEntryText = '';
                $scope.newEntryProject = '';
                $scope.newEntryGroup = '';
                $scope.newEntryManualTime = '';
                $scope.newEntryType = 'work';

                // Take over continue task if available
                // TODO: Add the group here as well ?!
                if ($scope.newContinueEntryProject !== undefined){
                    $scope.newEntryProject = $scope.newContinueEntryProject;
                    $scope.newContinueEntryProject = ''; // Clear it again
                }
                if ($scope.newContinueEntryText !== undefined){
                    $scope.newEntryText = $scope.newContinueEntryText;
                    $scope.newContinueEntryText = ''; // Clear it again
                }
                if ($scope.newContinueEntryGroup !== undefined){
                    $scope.newEntryGroup = $scope.newContinueEntryGroup;
                    $scope.newContinueEntryGroup = ''; // Clear it again
                }
                if ($scope.newContinueEntryType !== undefined){
                    $scope.newEntryType = $scope.newContinueEntryType;
                    $scope.newContinueEntryType = 'work'; // Default it again
                }

                // Focus First element now again, so we are ready to type an other task
                focus('newTaskProject');

                // TODO: put the following logic into a function to get called also by other change options later
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
                    console.log("newEntry entry saved with index" + queryRef.key)
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
                        console.log("nextEntry entry saved with index" + queryRef.key)
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
            console.log(this.entry);
            $scope.newEntryText = this.entry.text;
            $scope.newEntryProject = this.entry.project;
            $scope.newEntryType = this.entry.type;
            $scope.newEntryGroup = this.entry.group;
        };

        // Continue task feature (tracks current timer and continues with the selected one)
        $scope.continueEntry = function(entry) {
            console.log(entry);
            $scope.newContinueEntryProject = entry.project;
            $scope.newContinueEntryText    = entry.text;
            $scope.newContinueEntryType    = entry.type;
            $scope.newContinueEntryGroup    = entry.group;
            $scope.addEntry();
        };

        /**
         * Helper function to wrap up the correct type when continuing a group.
         * @param project
         * @param text
         * @param GroupTaskData
         *
         * Calls $scope.continueEntry(task) from above.
         */
        $scope.continueGroup = function(GroupTaskData) {
            // We just try to access any of the tasks (could be the first one because of the object
            var oneOfTheTasks = GroupTaskData.tasks[Object.keys(GroupTaskData.tasks)[0]];
            console.log("one of the tasks");
            console.log(oneOfTheTasks);

            // Continue this task
            $scope.continueEntry(oneOfTheTasks);
        };

        // Toggles the display of group details
        $scope.toggleDetails = function(GroupTaskData) {
            if (GroupTaskData.showDetails === undefined || typeof GroupTaskData.showDetails === 'function') {
                GroupTaskData.showDetails = true;
            } else {
                GroupTaskData.showDetails = !GroupTaskData.showDetails;
            }
        };

        // Add the current timer to this group
        $scope.addEntryToGroup = function(GroupTaskData) {
            console.log(GroupTaskData);
            $scope.newEntryGroup = GroupTaskData.group;
            $scope.addEntry();
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
                        console.log("(removed) nextEntry saved with index" + queryRef.key)
                    });
                }
            });
        };


        // Realtime duration display
        function updateDurations() {
            $scope.currentDuration = ((Date.now() - $scope.lastEntryTimestamp));
            $timeout(updateDurations, 1000, true);
        };

        // Continued Task handler
        function updateContinuedTasks(snapshot) {
            // We are always starting from scratch, we could also try to iterate over the
            // $scope.entriesCurrentGroups but this would lead to more problems on text changes etc.

            var groups = {};
            var groupsNew = {};

            // Iterate over all the data and prepare new object
            snapshot.forEach(function(data) {
                entry = data.val();

                var projectName        = entry.project;
                var projectTask        = entry.text;
                var groupId            = entry.group;


                if (!groupId) {
                    console.log('groupID not set, auto creating it.');
                    groupId = projectName + '-' + projectTask;
                }

                // Make sure the elements are set
                // The groups
                // Why typeof === function? It looks like there are cases like "watch" which is a function. (ff only)
                // Not sure how to handle this correctly. For now we just override it anyway.
                if (groupsNew[groupId] === undefined || typeof groupsNew[groupId] === 'function') {
                    groupsNew[groupId] = {};
                    groupsNew[groupId]['tasks'] = {};
                    groupsNew[groupId].amount = 0;
                    groupsNew[groupId].amountChecked = 0;
                    groupsNew[groupId].checkedState = '';
                    groupsNew[groupId].duration = 0;
                    groupsNew[groupId].durationChecked = 0;
                    groupsNew[groupId].group = groupId;
                    console.log('GroupID created:' + groupId);
                }

                // Sum up
                groupsNew[groupId].amount += 1;
                groupsNew[groupId]['tasks'][data.key] = entry;

                // Add specific data with some conditions
                if (entry.checked) {
                    groupsNew[groupId].amountChecked += 1;
                    groupsNew[groupId].durationChecked += entry.timestampDuration;
                } else {
                    groupsNew[groupId].duration += entry.timestampDuration;
                }

                // Verifying the "checked" state
                // TODO: This will happen on every task, it would be better to do it in the end, on the last iteration.
                if (groupsNew[groupId].amountChecked == 0) {
                    // not checked
                    groupsNew[groupId].checkedState = false;
                    groupsNew[groupId].indeterminate = false;
                } else if (groupsNew[groupId].amountChecked == groupsNew[groupId].amount) {
                    // all tasks are checked
                    groupsNew[groupId].checkedState = true;
                    groupsNew[groupId].indeterminate = false;
                } else {
                    // amount of tasks checked is not amount of tasks, means mixed
                    groupsNew[groupId].checkedState = false;
                    groupsNew[groupId].indeterminate = true;
                }

            });

            // Clean up the end result of groups
            for (var key in groupsNew) {
                if (groupsNew.hasOwnProperty(key)) {
                    group = groupsNew[key];
                    // console.log(group);
                    if (group.amount === 1) {
                        delete groupsNew[key];
                    }
                }
                if (Object.keys(groupsNew).length == 0) {
                    delete groupsNew[key];
                }
            }

            console.log('new groups:');
            console.log(groupsNew);

            $scope.entriesCurrentGroups = groupsNew;
            $scope.doneLoadingGroups = true;
        }

        // Group update checked on several tasks
        $scope.updateGroup = function(taskData, status) {
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
                var Entry = $scope.entries.$getRecord(taskKey); // record with $id === nextEntryKey or null
                Entry.checked = checked;
                // Save Entry
                $scope.entries.$save(Entry).then(function(queryRef) {
                    // data has been saved to our database
                    console.log("Entry (update Group) entry saved with index" + queryRef.key)
                });
            }
        };

        //
        // Single entry update
        // Could also be reached with this simple call: "entry.checked = true; entries.$save(entry);" in the html.
        // This however seems to be more clean for functionality.
        // NOTE: This does not work with the single entries in the grouped "continue" tasks, because the keys don't exist in there.
        // Rather use updateGroup if needed.
        $scope.updateSingleEntry = function(entry) {
            // Mark it checked
            entry.checked = true;
            // Save Entry
            $scope.entries.$save(entry).then(function(queryRef) {
                // data has been saved to our database
                console.log("Entry (single Entry) saved with index" + queryRef.key)
            });
        };
    }
]);
