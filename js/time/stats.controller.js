//
// Summary / Stats
//
angular.module("cycloneApp").controller("StatsCtrl", ["$scope", "$firebaseArray", "$rootScope",
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