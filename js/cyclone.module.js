angular.module("cycloneApp", ["firebase", 'ngMaterial', 'ngRoute', 'angular-clipboard', 'angularMoment']);

// Some authentication helper code, but not really used
// However part of the document:
// https://github.com/firebase/angularfire/blob/master/docs/guide/user-auth.md#authenticating-with-routers
angular.module("cycloneApp").run(["$rootScope", "$location", function($rootScope, $location) {
    $rootScope.$on("$routeChangeError", function(event, next, previous, error) {
        // We can catch the error thrown when the $requireSignIn promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
            $location.path("/");
        }
    });
}]);

// Routing
// TODO: Lets move to newRouter (with components)
angular.module("cycloneApp").config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/group', {
            template : "<h1>Group Interface</h1>",
            controller: 'TimeCtrl',
            resolve: {
                "currentAuth": ["Auth", function(Auth) {
                    return Auth.$waitForSignIn();
                }]
            }
        })
        // .when('/group/:type', {template : "<h1>Group :type</h1>", controller: 'TimeCtrl'})
        .when('/:type', {
            templateUrl: 'time.html',
            controller: 'TimeCtrl',
            resolve: {
                // controller will not be loaded until $waitForSignIn resolves
                // Auth refers to our $firebaseAuth wrapper in the factory below
                "currentAuth": ["Auth", function(Auth) {
                    // $waitForSignIn returns a promise so the resolve waits for it to complete
                    return Auth.$waitForSignIn();
                }]
            }
        })
        .when('/:type/:year/:month/:day*', {
            templateUrl: 'time.html',
            controller: 'TimeCtrl',
            resolve: {
                "currentAuth": ["Auth", function(Auth) {
                    return Auth.$waitForSignIn();
                }]
            }
        })
        .when('/:type/:weekNumber/:weekDay*', {
            templateUrl: 'time.html',
            controller: 'TimeCtrl',
            resolve: {
                "currentAuth": ["Auth", function(Auth) {
                    return Auth.$waitForSignIn();
                }]
            }
        })
        .otherwise({redirectTo: '/today'});

    $locationProvider.html5Mode({
        enabled: false,
        requireBase: false
    });
});
