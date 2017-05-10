// let's create a re-usable factory that generates the $firebaseAuth instance
angular.module('cycloneApp').factory("Auth", ["$firebaseAuth",
    function($firebaseAuth) {
        return $firebaseAuth();
    }
]);

// Initialize firebase ref
angular.module('cycloneApp')
    // .config(function ($firebaseRefProvider) {
    //
    //     // TODO: How can we load the config from config/config.js file
    //     var config = {
    //         apiKey: "AIzaSyDsWGJoeAa_1puNxV5gt0WMrtN12JIEKTk",
    //         authDomain: "cyclone-806dd.firebaseapp.com",
    //         databaseURL: "https://cyclone-806dd.firebaseio.com"
    //     };
    //
    //     $firebaseRefProvider
    //         .registerUrl({
    //             default: config.databaseURL
    //             // Possibility to add further locations:
    //             // -> https://firebase.googleblog.com/2016/03/whats-new-in-angularfire-12_90.html
    //             // -> https://github.com/toddmotto/angular-1-5-components-app/blob/f8bc47f11f9cc900dcee7896f1dd51b08dd3eba5/src/app/components/auth/auth.module.js
    //             // contacts: config.databaseURL + '/contacts'
    //         });
    //
    //     firebase.initializeApp(config);
    // });

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
