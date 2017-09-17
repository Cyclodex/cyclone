// TODO: Check if we can remove this, and use the new Auth service

// let's create a re-usable factory that generates the $firebaseAuth instance
angular.module('cycloneApp').factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
        return $firebaseAuth();
    }
]);

angular.module('cycloneApp').factory("userPromise", ["Auth", "$q", "$rootScope", function(Auth, $q, $rootScope) {
    //function returnPromise will generate a promise that will get the authenticated user.
    var returnPromise = function(){
        var deferred = $q.defer();

        Auth.$onAuthStateChanged(function(user) {
            // If user is not logged in, user = null
            if (user){
                user.username = user.email.substring(0, user.email.indexOf("@"));
                // getProfile(user);
                $rootScope.username = user.username;
                deferred.resolve({user: user});
            } else {
                deferred.reject('Not authenticated');
            }
        });

        //return promise
        return deferred.promise;
    }
    //return function to generate the promise. We return a function instead of
    //the promise directly so they can regenerate the promise if they fail authentication.
    return {getPromise: returnPromise};

}]);
