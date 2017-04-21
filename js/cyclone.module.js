angular.module("cycloneApp", ["firebase", 'ngMaterial', 'ui.router', 'angular-clipboard', 'angularMoment']);

// Make sure user is authenticated, otherwise send to login state
angular.module("cycloneApp").run(function($transitions) {
    $transitions.onStart(
    {
        // Special function match, so we require authentication everywhere but not on "login" state.
        to: function(state) {
            return state.name != null && state.name !== 'login';
        }
    }, function(trans) {
        var $state = trans.router.stateService;
        // Check if we have a firebase user
        var Auth = trans.injector().get('Auth');
        Auth.$onAuthStateChanged(function(user) {
            if (!user){
                $state.transitionTo('login');
            }
        });
    });
});

// Routing
angular.module("cycloneApp").config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.otherwise("/time/today");

    // Test route
    $stateProvider
        .state('welcome', {
            url: "/welcome",
            views: {
                content: {
                    component: 'welcome'
                },
                footer : {
                    template: 'FOOTER!'
                }
            }
        });
    // Login
    $stateProvider
        .state('login', {
            url: "/login",
            views: {
                content: {
                    component: 'login'
                },
                footer : {
                    template: ''
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
                            // $state.transitionTo('login');
                        }, function(notification){
                            console.log("notification: " + notification);
                        });
                    }]
            }
        });

    // Task
    $stateProvider
        .state('task', {
            url: "/task/today",
            params: {
                type: "today"
            },
            views: {
                content: {
                    // controller: "TaskCtrl",
                    // template: require('./task/task.tpl.html'),
                    component: "task",
                    bindings: { user: 'currentUser.user' },
                },
                footer: {
                    template: ''
                }
            },
            resolve: {
                "currentUser":
                    ["userPromise", "$state", function(userPromise, $state) {
                        return userPromise.getPromise().then(function(success){
                            return success;
                        }, function(reason){
                            console.log("userPromise Failed: " + reason);
                            // $state.transitionTo('login');
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
