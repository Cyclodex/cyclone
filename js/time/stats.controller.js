//
// Summary / Stats
//
angular.module("cycloneApp").controller("StatsCtrl", ["$scope", "$firebaseArray", "$rootScope",
    function($scope, $firebaseArray, $rootScope) {

        // check the route when ready
        $rootScope.$on('$routeChangeSuccess', function () {

            console.log('view type in stats');
            console.log($rootScope.viewType);
            // TODO: $rootScope - This is probably not the right way how to deal with, but it works for now.
            var weekNumber = $rootScope.weekNumber;
            var todayNumber = $rootScope.weekDay;
            console.log($rootScope.weekNumber);
            console.log($rootScope.weekDay);


            // Observe the user and then call the data
            firebase.auth().onAuthStateChanged(function(user) {
                if (user) {
                    var user = user.email.substring(0, user.email.indexOf("@"));
                    // We save the entries in the current week and day
                    var ref = new Firebase("https://cyclone-806dd.firebaseio.com/time/" + user + "/" + weekNumber + "/" + todayNumber);
                    // Order the query by project
                    var queryRef = ref.orderByChild("project");

                    queryRef.on("value", function(snapshot) {
                        // TODO: perhaps we need to check if really an entry was changed (not text only)
                        // Clean up the stats first (so we can recalculate them all)
                        var statsCollectionWork = [];
                        var statsCollectionPrivate = [];
                        var statsCollectionProjectStats = [];
                        snapshot.forEach(function(data) {
                            // General sum for projects (no matter if private or work)
                            if (statsCollectionProjectStats[data.val().project] === undefined) {
                                statsCollectionProjectStats[data.val().project] = 0;
                            }
                            // Sum up the durations of every project
                            statsCollectionProjectStats[data.val().project] += data.val().timestampDuration;

                            // Check if work or private
                            if (data.val().type == 'work') {
                                // Work
                                if (statsCollectionWork[data.val().project] === undefined) {
                                    statsCollectionWork[data.val().project] = 0;
                                }
                                // Sum up the durations of every work project
                                statsCollectionWork[data.val().project] += data.val().timestampDuration;
                            } else {
                                // Private
                                if (statsCollectionPrivate[data.val().project] === undefined) {
                                    statsCollectionPrivate[data.val().project] = 0;
                                }
                                // Sum up the durations of every private project
                                statsCollectionPrivate[data.val().project] += data.val().timestampDuration;
                            }
                        });

                        $scope.stats = [];
                        $scope.statsTotalWork = 0;
                        $scope.statsTotalPrivate = 0;
                        // Iterate over the object and give it to template (scope)
                        for (var key in statsCollectionProjectStats) {
                            var obj = {};
                            obj["project"] = key;
                            obj["duration"] = statsCollectionProjectStats[key];
                            obj["durationWork"] = statsCollectionWork[key];
                            obj["durationPrivate"] = statsCollectionPrivate[key];
                            $scope.stats.push(obj);
                        };

                        // Iterate over the object and give it to template (scope)
                        for (var key in statsCollectionWork) {
                            // Create the sum for work hours
                            $scope.statsTotalWork += statsCollectionWork[key];
                        };
                        // Iterate over the object and give it to template (scope)
                        for (var key in statsCollectionPrivate) {
                            // Create the sum of all private hours
                            $scope.statsTotalPrivate += statsCollectionPrivate[key];
                        };

                    }, function (errorObject) {
                        console.log("The read failed: " + errorObject.code);
                    });

                } else {
                    // No user is signed in.
                }
            });


        });


    }
]);
