/**
 * Cyclone app
 *
 * Created by cyclodex on 30.07.16.
 */
var app = angular.module("cycloneApp", ["firebase", 'ngMaterial']);

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
        $scope.version = "0.22";

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

//
// TIME
//
app.controller("TimeCtrl", ["$scope", "$firebaseArray", "focus", "$timeout", "$rootScope",
    function($scope, $firebaseArray, focus, $timeout, $rootScope) {
        var weekNumber = moment().week();
        var todayNumber = moment().weekday();
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

        // ADD
        // Add new entry to current week and day
        $scope.addEntry = function() {

            // Default time is now
            var timestamp = Date.now();
            var duration = (timestamp - $scope.lastEntryTimestamp);
            var start = $scope.lastEntryTimestamp;

            // If the form is not valid, don't add content.
            // TODO: we probably should display a information that it was not added
            // The input field which is invalid however should be marked red already.
            if ($scope.addEntryForm.$invalid){
                return false;
            }

            // Check if we need to add some manual time.
            if ($scope.newEntryManualTime !== undefined &&
                $scope.newEntryManualTime.value !== undefined &&
                $scope.newEntryManualTime.value !== null
            ) {
                // If we have a manual time, we don't know the prev time entry
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
                start = 0;

            }

            // Check if the entry should be marked as private (break)
            var newEntryType = 'work';
            var breakMatches = $scope.newEntryProject.match(/break/i);
            if (breakMatches) {
                newEntryType = 'private';
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
                console.log("added record with key " + newEntryKey);
                // Get location in the array
                var newEntryIndex = $scope.entries.$indexFor(newEntryKey); // returns location in the array
                console.log("index: " + newEntryIndex);

                //
                // check the previous entry to know when the new entry started, update timestampStart and duration of the new entry
                //
                // The new entry
                var newEntry = $scope.entries.$getRecord(newEntryKey); // record with $id === prevEntryKey or null

                // Get prevEntry and load its timestamp which we need as timestampStart
                // Also we need to update the timestamp
                var prevEntryKey = $scope.entries.$keyAt(newEntryIndex + 1); // previous entry (if existing)
                var prevEntry = $scope.entries.$getRecord(prevEntryKey); // record with $id === prevEntryKey or null

                console.log("prev entry:" + prevEntry.$id);
                console.log(prevEntry);

                // If we have a prev entry we can check when it finished
                // This will not happen if the entry is the first one
                // TODO: verify how to deal with the first entry - should it show the time since 00:00 ?
                if (prevEntry !== null) {

                    // Get prev timestamp which is the start of the new entry and calculate the duration
                    newEntry.timestampStart = prevEntry.timestamp;
                    newEntry.timestampDuration = (newEntry.timestamp - newEntry.timestampStart);
                    console.log("new entry" + newEntry.$id);
                    console.log(newEntry);
                    // Save new entry
                    $scope.entries.$save(newEntry).then(function(queryRef) {
                        // data has been saved to our database
                        console.log("entry saved with index" + queryRef.key())
                    });
                }

                console.log("Now we want to update the next entry");
                //
                // update next entry
                //
                // There can also be an item after the new added one, so we need to give over the new timestampStart and update duration of it
                // Get prev timestamp which is the start of the new entry and calculate the duration
                var nextEntryKey = $scope.entries.$keyAt(newEntryIndex - 1); // next entry (if existing)
                var nextEntry = $scope.entries.$getRecord(nextEntryKey); // record with $id === nextEntryKey or null
                if (nextEntry !== null) {
                    nextEntry.timestampStart = newEntry.timestamp;
                    nextEntry.timestampDuration = (nextEntry.timestamp - nextEntry.timestampStart);
                    console.log("NEXT entry" + nextEntry.$id);
                    console.log(nextEntry);
                    // Save nextEntry
                    $scope.entries.$save(nextEntry).then(function(queryRef) {
                        // data has been saved to our database
                        console.log("entry saved with index" + queryRef.key())
                    });
                }

            });

        } // End of ADD

        // Update entries after saving a manual entry
        function updateEntries() {
            // change a message and save it
            // foreach $scope.entrie
            //var item = $scope.entries.$getRecord(someRecordKey);
            // change values
            // item.user = "alanisawesome";
            messages.$save(item).then(function() {
                // data has been saved to our database
            });
        }


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
        var weekNumber = moment().week();
        var todayNumber = moment().weekday();

        // Observe the user and then call the data
        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                var user = user.email.substring(0, user.email.indexOf("@"));
                // We save the entries in the current week and day
                var ref = new Firebase("https://cyclone-806dd.firebaseio.com/time/" + user + "/" + weekNumber + "/" + todayNumber);
                // TODO: Verify with previous versions (like 0.14) if this is correct.
                var queryRef = ref.orderByChild("project");
                queryRef.on("value", function(snapshot) {
                    // TODO: perhaps we need to check if really an entry was changed (not text only)
                    // Clean up the stats first (so we can recalculate them all)
                    var statsCollection = [];
                    snapshot.forEach(function(data) {
                        if (statsCollection[data.val().project] === undefined) {
                            statsCollection[data.val().project] = 0;
                        }
                        // Sum up the durations of every project
                        statsCollection[data.val().project] += data.val().timestampDuration;
                    });

                    $scope.stats = [];
                    $scope.statsTotal = 0;
                    // Iterate over the object and give it to template (scope)
                    for (var key in statsCollection) {
                        var obj = {};
                        obj["project"] = key;
                        obj["duration"] = statsCollection[key];
                        $scope.stats.push(obj);
                        // Create the sum of all hours for this day
                        $scope.statsTotal += statsCollection[key];
                    };

                }, function(errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });


                // Order the queryby project
                var queryRef = ref.orderByChild("project");

                queryRef.on("value", function(snapshot) {
                    // TODO: perhaps we need to check if really an entry was changed (not text only)
                    // Clean up the stats first (so we can recalculate them all)
                    var statsCollection = [];
                    snapshot.forEach(function(data) {
                        if (statsCollection[data.val().project] === undefined) {
                            statsCollection[data.val().project] = 0;
                        }
                        // Sum up the durations of every project
                        statsCollection[data.val().project] += data.val().timestampDuration;
                    });

                    $scope.stats = [];
                    $scope.statsTotal = 0;
                    // Iterate over the object and give it to template (scope)
                    for (var key in statsCollection) {
                        var obj = {};
                        obj["project"] = key;
                        obj["duration"] = statsCollection[key];

                        // Check if its a break an mark it as such
                        var breakMatches = key.match(/break/i);
                        if (breakMatches) {
                            obj["break"] = true;
                        } else {
                            // Create the sum of all hours for this day
                            // This does not contain the break hours
                            $scope.statsTotal += statsCollection[key];
                        }

                        $scope.stats.push(obj);

                    };

                }, function (errorObject) {
                    console.log("The read failed: " + errorObject.code);
                });

            } else {
                // No user is signed in.
            }
        });


    }
]);