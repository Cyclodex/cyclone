// Connection controller
angular.module('cycloneApp').controller("ConnectionCtrl", ["$scope", "$rootScope",
    function($scope, $rootScope) {
        // Version number
        $scope.version = "0.28 | 6.9.2016";

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
