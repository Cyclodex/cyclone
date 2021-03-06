require('./statsTotal.component.js');
require('./statsTypes.component.js');
// Stats display component
// <stats></stats>
//
// Summary / Stats
// TODO: We should use a service for the calculations and only have components for the different displays
//  * for the total stats in the footer
//  * for the graphs-display
//
// TODO: I could not make this component load directly from route and so use a resolve for waiting for the user. Try to do this at some point.
angular.module("cycloneApp")
  .constant('randomColor', require('randomcolor')) // Loads the randomColor plugin
  .component('stats', {
  template: require('./stats.tpl.html'),
  controller: ["$scope", "userPromise", "Auth", "$firebaseArray", "randomColor", "timeTypesService", "firebaseRef",
    function($scope, userPromise, Auth, $firebaseArray, randomColor, timeTypesService, firebaseRef) {
      var $ctrl = this;

      // collect the projects colors
      var projectsColor = [];

      // Continue when auth state changed
      Auth.$onAuthStateChanged(function(user) {

        // Wait for promise of the user and then call the data
        userPromise.getPromise().then(function(currentUser){
          user = currentUser.user;
          if (user) {
            // We save the entries in the current week and day
            // TODO: we need the correct date set on the reference globally or use service
            // some how set the currentDate here: (or it will be today)
            var queryRef = firebaseRef.getTimeReference(user);

            // If we don't order by "order" , manual time entries will not appear correctly
            var refDayVis = queryRef.orderByChild("order");

            $ctrl.refDayVisArray = $firebaseArray(refDayVis);
            $ctrl.dayVisualizeProjectTotals = [];

            $ctrl.refDayVisArray.$watch(function(event) {
              var milisecondsOfOneHour = 60 * 60 * 1000;

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
                  //console.warn('Ignoring type "' + data.type + '" for sum visualization.');
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
                var width = data.timestampDuration / milisecondsOfOneHour;
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
                  timeTypeVisualisation["_icon"]   = $scope.types[timeType].icon;
                  timeTypeVisualisation["duration"] = $scope.types[timeType].timeSum;
                  timeTypeVisualisation["_width"]   = $scope.types[timeType].timeSum / milisecondsOfOneHour;
                  timeTypeVisualisation["_order"]   = $scope.types[timeType].order;

                  // Why push it when we can directly set on the order id:
                  $ctrl.dayVisualizeWorkTypeTotals[$scope.types[timeType].order] = timeTypeVisualisation;

                  // Count up total of work (ignores private and trust time)
                  if (timeType === 'work' || timeType === 'internal') {
                      // Sum of all work hours
                      $ctrl.statsTotalWork += $scope.types[timeType].timeSum;
                  }
              }

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
                    projectVisualisation["_width"]   = projectVisualisation["duration"] / milisecondsOfOneHour;

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