// Profile controller
angular.module('cycloneApp').controller("ProfileCtrl", ["$scope", "$location", "$firebaseAuth", "$rootScope",
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
