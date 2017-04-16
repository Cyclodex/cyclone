// let's create a re-usable factory that generates the $firebaseAuth instance
angular.module('cycloneApp').factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
        return $firebaseAuth();
    }
]);

angular.module('cycloneApp').factory("userPromise", ["Auth", "$q", "$rootScope", function(Auth, $q, $rootScope) {
    //function returnPromise will generate a promise that will get the authenticated user, make a profile if it doesn't exist,
    //and then return both objects on resolution.
    var returnPromise = function(){
        var deferred = $q.defer();

        Auth.$onAuthStateChanged(function(user) {
            // If user is not logged in, user = null
            if (user){
                user.username = user.email.substring(0, user.email.indexOf("@"));
                // getProfile(user);
                $rootScope.username = user.username;
                deferred.resolve({user: user});
            }
        });


        //     var displayName = user.displayName;
        //     var email = user.email;
        //     var emailVerified = user.emailVerified;
        //     var photoURL = user.photoURL;
        //     var uid = user.uid;
        //     var providerData = user.providerData;
        //     user.getToken().then(function(accessToken) {
        //         // Define Admin for more output
        //         $scope.userIsAdmin = 0;
        //         if (email == 'gander@jumps.ch') {
        //             $scope.userIsAdmin = 1;
        //
        //             /** Show more information
        //              *
        //              document.getElementById('account-details').textContent = JSON.stringify({
        //                         displayName: displayName,
        //                         email: email,
        //                         emailVerified: emailVerified,
        //                         photoURL: photoURL,
        //                         uid: uid,
        //                         accessToken: accessToken,
        //                         providerData: providerData
        //                     }, null, '  ');
        //              */
        //         }
        //     });
        // }

        //return promise
        return deferred.promise;
    }
    //return function to generate the promise. We return a function instead of
    //the promise directly so they can regenerate the promise if they fail authentication.
    return {getPromise: returnPromise};

}]);
