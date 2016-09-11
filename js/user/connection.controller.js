// Connection controller
angular.module('cycloneApp').controller("ConnectionCtrl", ["$scope", "$rootScope", "$firebaseAuth",
    function($scope, $rootScope, $firebaseAuth) {
        // Version number
        $scope.version = "0.29 | 8.9.2016";

        $scope.isLoading = true;
        $scope.connection = "connecting";

        firebase.auth().onAuthStateChanged(function(user) {
            if (user) {
                // User signed in!
                // TODO: probably not needed to check the token...
                user.getToken().then(function(accessToken) {
                    $scope.connection = "connected";
                    $scope.isLoading = false;
                });
            } else {
                // User logged out
                $scope.isLoading = true;
                $scope.connection = "not connected";
            }
        });
    }
]);
