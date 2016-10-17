// Connection controller
angular.module('cycloneApp').controller("ConnectionCtrl", ["$scope", "$rootScope", "Auth",
    function($scope, $rootScope, Auth) {
        // Version number
        $scope.version = "0.36 | 18.10.2016";

        $scope.isLoading = true;
        $scope.connection = "connecting";

        Auth.$onAuthStateChanged(function(user) {
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
