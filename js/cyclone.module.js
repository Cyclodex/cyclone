angular.module("cycloneApp", ["firebase", 'ngMaterial', 'ui.router', 'angular-clipboard', 'angularMoment', 'ngAnimate']);

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

    $urlRouterProvider.otherwise("/task/today");

    // Test route
    $stateProvider
        .state('welcome', {
            url: "/welcome",
            views: {
                content: {
                    component: 'welcome'
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
                nav: {
                    component: "nav",
                },
                content: {
                    controller: "TimeCtrl",
                    template: require('./time/time.tpl.html')
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
                nav: {
                    component: "nav",
                },
                content: {
                    // controller: "TaskCtrl",
                    // template: require('./task/task.tpl.html'),
                    component: "task",
                    bindings: { user: 'currentUser.user' },
                }
            },
            resolve: {
                currentUser:
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
                ,
                timeTypesService: function(timeTypesService) {
                    return timeTypesService.getTimeTypes();
                }
                ,
                moment: function(moment) {
                    return moment;
                },
                $firebaseArray: function($firebaseArray) {
                    return $firebaseArray;
                },
                $timeout: function($timeout) {
                    return $timeout;
                },
                firebaseRef: function(firebaseRef) {
                    return firebaseRef;
                }
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
