// Profile controller
// TODO: separate this on the templates and make a component out of it
angular.module('cycloneApp').controller("ProfileCtrl", ["$scope", "Auth", "$location", "$rootScope",
    function($scope, Auth, $location, $rootScope) {
        $rootScope.username = '';
        $scope.connection = 'connecting';

        Auth.$onAuthStateChanged(function(user) {
            $scope.connection = 'connected';
            $scope.username = user.username;
        });

        $scope.logout = function() {
            firebase.auth().signOut().then(function() {
                console.log('Signed Out');
                location.reload();
            }, function(error) {
                console.error('Sign Out Error', error);
            });
        };
    }
]);
