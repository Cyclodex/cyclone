angular.module("cycloneApp", ["firebase", 'ngMaterial', 'ui.router', 'angular-clipboard', 'angularMoment']);

// Some authentication helper code, but not really used
// However part of the document:
// https://github.com/firebase/angularfire/blob/master/docs/guide/user-auth.md#authenticating-with-routers
angular.module("cycloneApp").run(["$rootScope", "$state", function($rootScope, $state) {
    $rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
        // We can catch the error thrown when the $requireSignIn promise is rejected
        // and redirect the user back to the home page
        if (error === "AUTH_REQUIRED") {
            // We don't have a login page yet
            // TODO: We could redirect there in this case
            $state.go("/");
        }
    });
}]);

// Routing
angular.module("cycloneApp").config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/time/today");

    // Test route
    $stateProvider
        .state('hello', {
            url: "/hello",
            views: {
                content: {
                    template: '<hello></hello>'
                },
                footer : {
                    template: 'some custom footer'
                }


            }
        });
    // Time
    $stateProvider
        .state('time', {
            url: "/time/today",
            params: {
                type: "today"
            },
            views: {
                content: {
                    controller: "TimeCtrl",
                    template: require('./time/time.tpl.html'),
                },
                footer: {
                    template: '<footer-display class="footer-stats" ng-cloak></footer-display>'
                }
            },
            resolve: {
                "currentUser":
                    ["userPromise", "$state", function(userPromise, $state) {
                        return userPromise.getPromise().then(function(success){
                            return success;
                        }, function(reason){
                            console.log("userPromise Failed: " + reason);
                            $state.transitionTo('login');
                        }, function(notification){
                            console.log("notification: " + notification);
                        });
                    }]
            }
        });

    // Specific day view / Archive
    $stateProvider
        .state('day', {
            url: "/time/:year/:month/:day",
            params: {
                year: "",
                month: "",
                day: "",
                type: "archive-date"
            },
            views: {
                content: {
                    controller: "TimeCtrl",
                    template: require('./time/time.tpl.html'),
                },
                footer: {
                    template: '<footer-display class="footer-stats" ng-cloak></footer-display>'
                }
            },
            resolve: {
                "currentUser":
                    ["userPromise", "$state", function(userPromise, $state) {
                        return userPromise.getPromise().then(function(success){
                            return success;
                        }, function(reason){
                            console.log("userPromise Failed: " + reason);
                            $state.transitionTo('login');
                        }, function(notification){
                            console.log("notification: " + notification);
                        });
                    }]
            }
        });
});
