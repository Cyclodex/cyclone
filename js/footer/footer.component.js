require('../stats/statsTotal.component.js');
require('../user/profile.controller.js');
// Footer display component
// <footer-display></footer-display>
//
// Summary / Stats
// TODO: We should use a service for the calculations and only have components
//  * for the total stats in the footer
//  * for the graphs-display
//
angular.module("cycloneApp")
  .constant('randomColor', require('randomcolor')) // Loads the randomColor plugin
  .component('footerDisplay', {
  template: require('./footer.tpl.html'),
  controller: ["$scope", "Auth", "$firebaseArray", "$rootScope", "randomColor", "timeTypesService",
    function($scope, Auth, $firebaseArray, $rootScope, randomColor, timeTypesService) {
      var $ctrl = this;

      // collect the projects colors
      var projectsColor = [];

      // check the route when ready
      $rootScope.$on('$routeChangeSuccess', function () {

        // TODO: $rootScope - This is probably not the right way how to deal with, but it works for now.
        var year = $rootScope.year;
        var weekNumber = $rootScope.weekNumber;
        var todayNumber = $rootScope.weekDay;

        // Observe the user and then call the data
        Auth.$onAuthStateChanged(function(user) {
          if (user) {
            // We save the entries in the current week and day
            var ref = firebase.database().ref();
            var queryRef = ref.child("time/" + user.uid + "/" + year  + "/" + weekNumber + "/" + todayNumber);
            // If we don't order by "order" , manual time entries will not appear correctly
            var refDayVis = queryRef.orderByChild("order");

            $ctrl.refDayVisArray = $firebaseArray(refDayVis);
            $ctrl.dayVisualizeProjectTotals = [];

            $ctrl.refDayVisArray.$watch(function(event) {
              var secondsOfOneHour = 60 * 60;

              // Get the time types
              $scope.types = timeTypesService.getTimeTypes();
              // Set default values we need
              for (var timeType in $scope.types) {
                $scope.types[timeType].timeSum = 0;
              }

              var projects = {};
              $ctrl.refDayVisArray.forEach(function(data) {
                // Check if entries type is supported (we also have system which is not part of graphs)
                if ($scope.types[data.type] === undefined) {
                  console.warn('Ignoring type "' + data.type + '" for sum visualization.');
                  return;
                }
                var projectDuration = data.timestampDuration;
                var projectName     = data.project;

                // Random project color
                if (projectsColor[projectName] === undefined  || typeof projectsColor[projectName] === 'function') {
                  projectsColor[projectName] = randomColor({luminosity: 'light'});
                }

                // Get index of current data element
                var index = $ctrl.refDayVisArray.$indexFor(data.$id);
                // Add some none DB values (use _)
                // The width is defined as a flex-grow unit, which represents the amount of "hour" in decimal
                var width = data.timestampDuration / 1000 / secondsOfOneHour;
                $ctrl.refDayVisArray[index]._color = projectsColor[projectName]; // load the projects color
                $ctrl.refDayVisArray[index]._width = width;

                //
                // Stats project totals
                //

                if (projects[projectName] === undefined || typeof projects[projectName] === 'function') {
                  projects[projectName] = {};
                }
                // Sum of all projects
                if (projects[projectName].projectDurationSum === undefined) {
                  projects[projectName].projectDurationSum = 0;
                }
                projects[projectName].projectDurationSum += projectDuration;


                // More dynamically collect the data:
                if (projects[projectName].sums === undefined || typeof projects[projectName].sums === 'function') {
                    projects[projectName].sums = {};
                }
                // Set starting value if not set.
                if (projects[projectName].sums[data.type] === undefined) {
                    projects[projectName].sums[data.type] = 0;
                }

                // Sum up the durations of every work project
                projects[projectName].sums[data.type] += projectDuration;

                // Sum up every type
                $scope.types[data.type]['timeSum'] += projectDuration;

              });

              // Set arrays
              $ctrl.dayVisualizeProjectTotals = [];
              $ctrl.dayVisualizeWorkTypeTotals = [];
              $ctrl.statsTotalWork = 0;


              // Create graph for work types
              for (var timeType in $scope.types) {
                  var timeTypeVisualisation = {};
                  timeTypeVisualisation["type"]     = $scope.types[timeType].value;
                  timeTypeVisualisation["_name"]    = $scope.types[timeType].name;
                  timeTypeVisualisation["_color"]   = $scope.types[timeType].color;
                  timeTypeVisualisation["duration"] = $scope.types[timeType].timeSum;
                  timeTypeVisualisation["_width"]   = $scope.types[timeType].timeSum / 1000 / secondsOfOneHour;
                  timeTypeVisualisation["_order"]   = $scope.types[timeType].order;

                  // Why push it when we can directly set on the order id:
                  $ctrl.dayVisualizeWorkTypeTotals[$scope.types[timeType].order] = timeTypeVisualisation;

                  // Count up total of work (all none private ones)
                  if (timeType !== 'private') {
                      // Sum of all work hours - everything else than private: (internal, external, trust)
                      $ctrl.statsTotalWork += $scope.types[timeType].timeSum;
                  }
              };

              // Create an element for every work and/or private separated
              for (var projectName in projects) {

                for (var timeType in projects[projectName].sums) {
                  // console.log(timeType);
                  // console.log(projects[projectName].sums[timeType]);
                    var projectVisualisation = {};
                    projectVisualisation["project"]  = projectName;
                    projectVisualisation["type"]     = timeType;
                    projectVisualisation["_color"]   = projectsColor[projectName]; // load the projects color
                    projectVisualisation["duration"] = projects[projectName].sums[timeType];
                    projectVisualisation["_width"]   = projectVisualisation["duration"] / 1000 / secondsOfOneHour;

                    $ctrl.dayVisualizeProjectTotals.push(projectVisualisation);
                }

              };

            });

          } else {
            // No user is signed in.
          }
        });


      });
  }]
});