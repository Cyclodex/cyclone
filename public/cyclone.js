/**
 * Cyclone app
 *
 * Created by Cyclodex
 */
var app = angular.module("cycloneApp", ["firebase", 'ngMaterial', 'ngRoute']);

// Routing
app.config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/:type', {templateUrl: 'index.html', controller: 'TimeCtrl'})
        .when('/:type/:year/:month/:day*', {templateUrl: 'index.html', controller: 'TimeCtrl'})
        .when('/:type/:weekNumber/:weekDay*', {templateUrl: 'index.html', controller: 'TimeCtrl'})
        .otherwise({redirectTo: '/today'});

    $locationProvider.html5Mode({
        enabled: false,
        requireBase: false
    });
});

// Profile controller
app.controller("ProfileCtrl", ["$scope", "$location", "$firebaseAuth", "$rootScope",
    function($scope, $location, $firebaseAuth, $rootScope) {
        $rootScope.user = '';

        initApp = function() {
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    // User is signed in.
                    var displayName = user.displayName;
                    var email = user.email;
                    var emailVerified = user.emailVerified;
                    var photoURL = user.photoURL;
                    var uid = user.uid;
                    var providerData = user.providerData;
                    user.getToken().then(function(accessToken) {
                        // Define Admin for more output
                        $scope.userIsAdmin = 0;
                        if (email == 'gander@jumps.ch') {
                            $scope.userIsAdmin = 1;

                            document.getElementById('account-details').textContent = JSON.stringify({
                                displayName: displayName,
                                email: email,
                                emailVerified: emailVerified,
                                photoURL: photoURL,
                                uid: uid,
                                accessToken: accessToken,
                                providerData: providerData
                            }, null, '  ');
                        }
                    });

                    // Cyclone variables
                    $rootScope.user = user.email.substring(0, user.email.indexOf("@"));

                } else {
                    // User is signed out.
                    console.log("User is not logged in.");
                }
            }, function(error) {
                console.log(error);
            });
        };

        $scope.logout = function() {
            firebase.auth().signOut().then(function() {
                console.log('Signed Out');
                location.reload();
            }, function(error) {
                console.error('Sign Out Error', error);
            });
        };

        window.addEventListener('load', function() {
            initApp()
        });

    }
]);

// Connection controller
app.controller("ConnectionCtrl", ["$scope", "$rootScope",
    function($scope, $rootScope) {
        // Version number
        $scope.version = "0.26 | 24.8.2016";

        $scope.isLoading = true;
        $scope.connection = "connecting";

        // Check connection to firebase
        var connectedRef = new Firebase("https://cyclone-806dd.firebaseio.com/.info/connected");
        connectedRef.on("value", function(snap) {
            if (snap.val() === true) {
                $scope.connection = "connected";
                $scope.isLoading = false;
            } else {
                $scope.isLoading = true;
                $scope.connection = "not connected";
            }

        });
    }
]);

// Focus an input element - directive
// http://stackoverflow.com/questions/14833326/how-to-set-focus-on-input-field
app.directive('focusOn', function() {
    return function(scope, elem, attr) {
        scope.$on('focusOn', function(e, name) {
            if (name === attr.focusOn) {
                elem[0].focus();
            }
        });
    };
});
app.factory('focus', function($rootScope, $timeout) {
    return function(name) {
        $timeout(function() {
            $rootScope.$broadcast('focusOn', name);
        });
    }
});

// Help to order a object in the other way (limitation of firebase)
app.filter('orderObjectBy', function() {
    return function(items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function(item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (a[field] > b[field] ? 1 : -1);
        });
        if(reverse) filtered.reverse();
        return filtered;
    };
});

//
// TIME
//
app.controller("TimeCtrl", ["$scope", "$firebaseArray", "focus", "$timeout", "$rootScope", "$route",
    function($scope, $firebaseArray, focus, $timeout, $rootScope, $route) {
        // check the route when ready
        $rootScope.$on('$routeChangeSuccess', function () {
            $rootScope.viewType = $route.current.params.type;

            $scope.error = false;

            // Note: This is defining the type and values also for the stats.
            if ($rootScope.viewType == 'today') {
                $rootScope.weekNumber = moment().week();
                $rootScope.weekDay = moment().weekday();
                $scope.addEntryEnabled = true;
                $scope.currentDate = new Date;
            } else if ($rootScope.viewType == 'archive') {
                $rootScope.weekDay = $route.current.params.weekDay;
                $rootScope.weekNumber = $route.current.params.weekNumber;
                $scope.addEntryEnabled = false;

                // Read the date out of current week number and day number from current page
                $scope.currentDate = moment()
                    .week($rootScope.weekNumber)
                    .weekday($rootScope.weekDay)
                    .toDate();

            } else if ($rootScope.viewType == 'archive-date') {
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
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    // We save the entries in the current week and day, but most important by every user ()
                    var user = user.email.substring(0, user.email.indexOf("@"));
                    var ref = new Firebase("https://cyclone-806dd.firebaseio.com/time/" + user + "/" + weekNumber + "/" + todayNumber);
                    // Order the query, from recent to older entries
                    // However this only works withthe orderBy in the template right now.
                    var queryRef = ref.orderByChild("order");


                    // User is signed in.
                    ////console.log("Loading data for user :" + $rootScope.user);
                    ////var queryRef = ref.orderByChild("user").equalTo(user.email);
                    // create a synchronized array
                    $scope.entries = $firebaseArray(queryRef);


                    // Update current time
                    // Attach an asynchronous callback to read the data at our posts reference
                    var lastEntryRef = ref.orderByChild("order").limitToFirst(1);
                    lastEntryRef.on("value", function(snapshot) {
                        // object in object (but only 1 because of limit above)
                        snapshot.forEach(function(data) {
                            //lastEntryTimestamp = data.val().timestamp;
                            //$scope.lastEntryTimestamp = lastEntryTimestamp;
                            $scope.lastEntryTimestamp = data.val().timestamp;
                            // We use this also for knowing about the duration of every entry
                            // TODO: if we add manual-time entries, this needs an update...
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
                var newEntryKey = queryRef.key();
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
                    console.log("entry saved with index" + queryRef.key())
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
                        console.log("entry saved with index" + queryRef.key())
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
                var deletedEntryKey = ref.key();

                // Update the time range of the next entry to fill the gap
                if (nextEntry !== null) {
                    nextEntry.timestampStart = deleteEntryTimestampStart;
                    // Update the duration entry
                    nextEntry.timestampDuration = calculateDuration(nextEntry);
                    // Save nextEntry
                    $scope.entries.$save(nextEntry).then(function(queryRef) {
                        // data has been saved to our database
                        console.log("entry saved with index" + queryRef.key())
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

//
// Summary / Stats
//
app.controller("StatsCtrl", ["$scope", "$firebaseArray", "$rootScope",
    function($scope, $firebaseArray, $rootScope) {

        // collect the projects colors
        var projectsColor = [];

        // check the route when ready
        $rootScope.$on('$routeChangeSuccess', function () {

            // TODO: $rootScope - This is probably not the right way how to deal with, but it works for now.
            var weekNumber = $rootScope.weekNumber;
            var todayNumber = $rootScope.weekDay;

            // Observe the user and then call the data
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    var user = user.email.substring(0, user.email.indexOf("@"));

                    // We save the entries in the current week and day
                    var refDayVis = new Firebase("https://cyclone-806dd.firebaseio.com/time/" + user + "/" + weekNumber + "/" + todayNumber);
                    // If we don't order by "order" , manual time entries will not appear correctly
                    refDayVis = refDayVis.orderByChild("order");
                    $scope.refDayVisArray = $firebaseArray(refDayVis);

                    $scope.dayVisualizeProjectTotals = [];

                    // if the messages are empty, add something for fun!
                    $scope.refDayVisArray.$watch(function(event) {


                        // Time bar / dayVisualize
                        $scope.statsTotalWork = 0;
                        $scope.statsTotalPrivate = 0;

                        var fullDayInSeconds = 60 * 60 * 12; // we can make it more flexible, but now we support 12h max
                        // TODO: If we calculate the full time of tracked hours, we can make this more flexible (always full width)
                        var percentageOfDay = 100 / fullDayInSeconds;

                        var projects = {};
                        $scope.refDayVisArray.forEach(function(data) {
                            $scope.dayVisualizeProjectTotals = [];


                            var projectDuration = data.timestampDuration;
                            var projectName     = data.project;

                            // Random project color
                            if (projectsColor[projectName] === undefined) {
                                projectsColor[projectName] = randomColor({luminosity: 'light'});
                            }

                            // Get index of current data element
                            var index = $scope.refDayVisArray.$indexFor(data.$id);
                            // Add some none DB values (use _)
                            $scope.refDayVisArray[index]._color = projectsColor[projectName]; // load the projects color
                            $scope.refDayVisArray[index]._width = percentageOfDay * data.timestampDuration / 1000;


                            //
                            // Stats project totals
                            //

                            if (projects[projectName] === undefined) {
                                projects[projectName] = {};
                            }
                            // Sum of all projects
                            if (projects[projectName].projectDurationSum === undefined) {
                                projects[projectName].projectDurationSum = 0;
                            }
                            projects[projectName].projectDurationSum += projectDuration;


                            // Separate sums for work and private
                            if (data.type == 'work') {
                                // Work
                                if (projects[projectName].projectDurationSumWork === undefined) {
                                    projects[projectName].projectDurationSumWork = 0;
                                }
                                // Sum up the durations of every work project
                                projects[projectName].projectDurationSumWork += projectDuration;

                                // Sum of all work hours
                                $scope.statsTotalWork += projectDuration;
                            } else {
                                // Private
                                if (projects[projectName].projectDurationSumPrivate === undefined) {
                                    projects[projectName].projectDurationSumPrivate = 0;
                                }
                                // Sum up the durations of every private project
                                projects[projectName].projectDurationSumPrivate += projectDuration;

                                // Sum of all private hours
                                $scope.statsTotalPrivate += projectDuration;
                            }

                        });


                        // Create an element for every work and/or private separated
                        for (var projectName in projects) {
                            if ( projects[projectName].projectDurationSumWork !== undefined ){
                                var projectVisWork = {};
                                projectVisWork["project"]  = projectName;
                                projectVisWork["type"]     = 'work';
                                projectVisWork["_color"]    = projectsColor[projectName]; // load the projects color
                                projectVisWork["duration"] = projects[projectName].projectDurationSumWork;
                                projectVisWork["_width"]    = percentageOfDay * projectVisWork["duration"] / 1000;

                                $scope.dayVisualizeProjectTotals.push(projectVisWork);
                            }
                            // if we have private
                            if ( projects[projectName].projectDurationSumPrivate !== undefined ){
                                var projectVisPrivate = {};
                                projectVisPrivate["project"]  = projectName;
                                projectVisPrivate["type"]     = 'private';
                                projectVisPrivate["_color"]    = projectsColor[projectName]; // load the projects color
                                projectVisPrivate["duration"] = projects[projectName].projectDurationSumPrivate;
                                projectVisPrivate["_width"]    = percentageOfDay * projectVisPrivate["duration"] / 1000;

                                $scope.dayVisualizeProjectTotals.push(projectVisPrivate);
                            }
                        };

                    });

                } else {
                    // No user is signed in.
                }
            });


        });


    }
]);