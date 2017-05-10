//
// TASK (as component migrated from TimeCtrl)
//
angular.module('cycloneApp')
    .component('task', {
    template: require('./task.tpl.html'),
    bindings: {
        user: '<',
        timeTypesService: '<',
        moment: '<',
        $firebaseArray: '<',
        $timeout: '<',
        addEntryForm: '=', // This binds the form, but would need further changes still
        newEntryProject: '<',
        newEntryText: '<',
        newEntryGroup: '<',
        newEntryManualTime: '<',
        entries: '<',
        doneLoading: '<'
    }, // Notice the binding on the router! (its currentUser.user)
    controller: function() {
        // DONE: currentUser, $scope, Auth, moment, timeTypesService, $firebaseArray, $rootScope, $stateParams, $state
        // Not working properly: $timeout
        // UNSURE: focus
        var ctrl = this;
        console.log('task component');

         // TODO: move "copy" out from here, into service something like that.
         // Angular-clipboard
         this.copySuccess = function () {
            console.log('Copied time!');
         };
         this.copyFail = function (err) {
            console.error('Error!', err);
            console.info('Not supported browser, press Ctrl+C to copy time');
         };

         // The different types
         // this.types = this.timeTypesService;
         // TODO: Make this a configuration option or save it in the firebasedb

         this.error = false;
         this.doneLoading = false;
         this.doneLoadingGroups = false;

         var today = this.moment();

         // Note: This is defining the type and values also for the stats.
         this.year = this.moment().year();
         this.weekNumber = this.moment().week();
         this.weekDay = this.moment().weekday();
         this.addEntryEnabled = true;
         this.currentDate = new Date;
         this.newEntryType = 'work';

         // Day jumping to go to archived / past days
         // prev + next day (archive day switching)
         var currentDate = this.moment(this.currentDate);
         var prevDate = currentDate.clone();
         var nextDate = currentDate.clone();


         // PREV
         prevDate = prevDate.subtract(1, 'days');
         this.prevDateLink = '#time/' + prevDate.format("YYYY/MM/DD");

         // NEXT (not for the future)
         nextDate = nextDate.add(1, 'days');
         if (nextDate.isBefore(today, 'day')) {
            this.nextDateLink = '#time/' + nextDate.format("YYYY/MM/DD");
        } else if (nextDate.isSame(today, 'day')){
            this.nextDateLink = '#today';
        } else {
            this.nextDateLink = false;
        }

         // Define the path for reading and saving the entries
         var year = this.year;
         var weekNumber = this.weekNumber;
         var todayNumber = this.weekDay;

         var lastEntryTimestamp = Date.now();

         // Duration
         this.currentDuration = 0;
         this.lastEntryTimestamp = lastEntryTimestamp; // So the first entry works

         // Show the current date
         this.today = lastEntryTimestamp;

         this.entriesCurrentGroups = {};
         // Call the data etc.
         // We don't need to observe anymore, because the routing makes sure we have the user
         if (this.user) {
            // We save the entries in the current year, week and day, but most important by every user ()
            var ref = firebase.database().ref();

            // New grouped current time entries
            var queryGroupRef = ref.child("time/" + this.user.uid + "/" + year + "/" + weekNumber + "/" + todayNumber);
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
            var queryRef = ref.child("time/" + this.user.uid + "/" + year + "/" + weekNumber + "/" + todayNumber);
            // Order the query, from recent to older entries
            // However this only works with the orderBy in the template right now.
            var query = queryRef.orderByChild("order");

            // Create a synchronized array
            this.entries = this.$firebaseArray(query);

            // Add a start entry if we are on today and no entries in yet.
             // TODO: Do we need this for tasks? Probably also better outside in a service
            this.entries.$loaded()
                .then(function () {
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

            // Update current time
            // Attach an asynchronous callback to read the data at our posts reference
            var lastEntryRef = queryRef.orderByChild("order").limitToFirst(1);
            lastEntryRef.on("value", function(snapshot) {
                // object in object (but only 1 because of limit above)
                // console.log(snapshot);
                snapshot.forEach(function(data) {
                    this.lastEntryTimestamp = data.val().timestamp;
                });
            }, function(errorObject) {
                console.log("The read failed: " + errorObject.code);
            });

            // TODO: Is disabled because it did not work
            // this.updateDurations();

        } else {
            // No user is signed in.
        }

        // ADD
        // Add new entry to current week and day
        this.addEntry = function() {

            // Default time is now
            var timestamp = Date.now();
            var duration = cleanupDuration(timestamp - this.lastEntryTimestamp);
            var start = this.lastEntryTimestamp;

            // If the form is not valid, don't add content.
            // TODO: This is not working anymore
            // if (this.addEntryForm.$invalid){
            //     console.log("entry was not added");
            //     return false;
            // }

            // Check if we need to add some manual end time.
            if (this.newEntryManualTime !== undefined &&
                this.newEntryManualTime.value !== undefined &&
                this.newEntryManualTime.value !== null
            ) {
                // If we have a manual end time, we don't know the prev time entry
                // We need a date of today
                var manualTime = new Date();
                manualTime.setTime(Date.now());

                // And manually set the hours + minutes
                var hours = this.newEntryManualTime.value.getHours();
                var minutes = this.newEntryManualTime.value.getMinutes();
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
            if (this.newEntryProject !== undefined) {
                var breakMatches = this.newEntryProject.match(/break/i);
                if (breakMatches) {
                    this.newEntryType = 'private';
                }
            } else {
                this.newEntryProject = '';
            }
            if ( this.newEntryType === undefined){
                this.newEntryType = 'work';
            }

            // Project name empty if not yet set
            if (this.newEntryProject === undefined) {
                this.newEntryProject = '';
            }

            // newEntryText empty if not yet set
            if (this.newEntryText === undefined) {
                this.newEntryText = '';
            }

            // newEntryGroup
            if (this.newEntryGroup === undefined) {
                this.newEntryGroup = '';
            }

            //
            // ADD new entry into DB
            //

            console.log("I AM HERE");
            console.log(this.newEntryText);

            var entries = this.entries;
            this.entries.$add({
                text: this.newEntryText,
                project: this.newEntryProject,
                group: this.newEntryGroup,
                checked: false,
                type: this.newEntryType,
                timestamp: timestamp, // we don't want milliseconds - just seconds! (rounds it as well),
                timestampStart: start,
                timestampDuration: duration,
                order: -timestamp,
                user: this.user.username, // Now it takes the first part of the email address of the logged in user
            }).then(function(queryRef) {
                // Entry added, now do something
                // Clear the input fields again
                ctrl.newEntryText = '';
                ctrl.newEntryProject = '';
                ctrl.newEntryGroup = '';
                ctrl.newEntryManualTime = '';
                ctrl.newEntryType = 'work';

                // Take over continue task if available
                // TODO: Add the group here as well ?!
                if (ctrl.newContinueEntryProject !== undefined){
                    ctrl.newEntryProject = ctrl.newContinueEntryProject;
                    ctrl.newContinueEntryProject = ''; // Clear it again
                }
                if (ctrl.newContinueEntryText !== undefined){
                    ctrl.newEntryText = ctrl.newContinueEntryText;
                    ctrl.newContinueEntryText = ''; // Clear it again
                }
                if (ctrl.newContinueEntryGroup !== undefined){
                    ctrl.newEntryGroup = ctrl.newContinueEntryGroup;
                    ctrl.newContinueEntryGroup = ''; // Clear it again
                }
                if (ctrl.newContinueEntryType !== undefined){
                    ctrl.newEntryType = ctrl.newContinueEntryType;
                    ctrl.newContinueEntryType = 'work'; // Default it again
                }

                // Focus First element now again, so we are ready to type an other task
                focus('newTaskProject');

                // TODO: put the following logic into a function to get called also by other change options later
                // Which id and location did we save the entry? We need to check the prev and next entry to update the duration!
                var newEntryKey = queryRef.key;
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
                    newEntry.timestampDuration = calculateDuration(newEntry);

                }

                // Save new entry
                ctrl.entries.$save(newEntry).then(function(queryRef) {
                    // data has been saved to our database
                    console.log("newEntry entry saved with index" + queryRef.key)
                });

                //
                // update next entry
                //
                // There can also be an item after the new added one, so we need to give over the new timestampStart and update duration of it
                // Get prev timestamp which is the start of the new entry and calculate the duration
                var nextEntryKey = ctrl.entries.$keyAt(newEntryIndex - 1); // next entry (if existing)
                var nextEntry = ctrl.entries.$getRecord(nextEntryKey); // record with $id === nextEntryKey or null
                if (nextEntry !== null) {
                    nextEntry.timestampStart = newEntry.timestamp;
                    nextEntry.timestampDuration = calculateDuration(nextEntry);
                    // Save nextEntry
                    ctrl.entries.$save(nextEntry).then(function(queryRef) {
                        // data has been saved to our database
                        console.log("nextEntry entry saved with index" + queryRef.key)
                    });
                }

            })
            .catch(function (error) {
                console.log("Error:", error);
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
        this.cloneEntry = function() {
            console.log(this.entry);
            this.newEntryText = this.entry.text;
            this.newEntryProject = this.entry.project;
            this.newEntryType = this.entry.type;
            this.newEntryGroup = this.entry.group;
        };

        // Continue task feature (tracks current timer and continues with the selected one)
        this.continueEntry = function(entry) {
            console.log(entry);
            this.newContinueEntryProject = entry.project;
            this.newContinueEntryText    = entry.text;
            this.newContinueEntryType    = entry.type;
            this.newContinueEntryGroup    = entry.group;
            this.addEntry();
        };

        // /**
        //  * Helper function to wrap up the correct type when continuing a group.
        //  * @param project
        //  * @param text
        //  * @param GroupTaskData
        //  *
        //  * Calls this.continueEntry(task) from above.
        //

        this.continueGroup = function(GroupTaskData) {
            // We just try to access any of the tasks (could be the first one because of the object
            var oneOfTheTasks = GroupTaskData.tasks[Object.keys(GroupTaskData.tasks)[0]];
            console.log("one of the tasks");
            console.log(oneOfTheTasks);

            // Continue this task
            this.continueEntry(oneOfTheTasks);
        };

        // Toggles the display of group details
        this.toggleDetails = function(GroupTaskData) {
            if (GroupTaskData.showDetails === undefined || typeof GroupTaskData.showDetails === 'function') {
                GroupTaskData.showDetails = true;
            } else {
                GroupTaskData.showDetails = !GroupTaskData.showDetails;
            }
        };

        // Add the current timer to this group
        this.addEntryToGroup = function(GroupTaskData) {
            console.log(GroupTaskData);
            this.newEntryGroup = GroupTaskData.group;
            this.addEntry();
        };




        // Delete an entry has some special tasks: Update the next (next in timeline, so after the deleting entry) start timesamp.
        this.deleteEntry = function() {
            // Get the start timestamp of this entry, we will give this over to the next entry, so it fills the deleted gap again.
            var deleteEntryTimestampStart = this.entry.timestampStart;
            var deleteEntryKey = this.entry.$id;
            var deleteEntryIndex = this.entries.$indexFor(deleteEntryKey); // returns location in the array

            //
            // prepare update next entry
            //
            var nextEntryKey = this.entries.$keyAt(deleteEntryIndex - 1); // next entry (if existing)
            var nextEntry = this.entries.$getRecord(nextEntryKey); // record with $id === nextEntryKey or null

            // Delete entry, and update the next one
            this.entries.$remove(this.entry).then(function(ref) {
                // Which id and location did we remove? We need to check the next entry to update the duration of it!
                var deletedEntryKey = ref.key;

                // Update the time range of the next entry to fill the gap
                if (nextEntry !== null) {
                    nextEntry.timestampStart = deleteEntryTimestampStart;
                    // Update the duration entry
                    nextEntry.timestampDuration = calculateDuration(nextEntry);
                    // Save nextEntry
                    this.entries.$save(nextEntry).then(function(queryRef) {
                        // data has been saved to our database
                        console.log("(removed) nextEntry saved with index" + queryRef.key)
                    });
                }
            });
        };


        // Realtime duration display
        // TODO: Did not work with timeout etc.
        // this.updateDurations = function() {
        // function updateDurations() {
        //     this.currentDuration = ((Date.now() - this.lastEntryTimestamp));
        //     console.log(this);
        //     this.$timeout(updateDurations, 1000, true);
        // };

        // Continued Task handler
        function updateContinuedTasks(snapshot) {
            // We are always starting from scratch, we could also try to iterate over the
            // this.entriesCurrentGroups but this would lead to more problems on text changes etc.

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

            this.entriesCurrentGroups = groupsNew;
            this.doneLoadingGroups = true;
        }

        // Group update checked on several tasks
        this.updateGroup = function(taskData, status) {
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
                var Entry = this.entries.$getRecord(taskKey); // record with $id === nextEntryKey or null
                Entry.checked = checked;
                // Save Entry
                this.entries.$save(Entry).then(function(queryRef) {
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
        this.updateSingleEntry = function(entry) {
            // Mark it checked
            entry.checked = true;
            // Save Entry
            this.entries.$save(entry).then(function(queryRef) {
                // data has been saved to our database
                console.log("Entry (single Entry) saved with index" + queryRef.key)
            });
        };
    }
});
