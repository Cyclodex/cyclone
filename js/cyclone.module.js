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
                return;
            }

            // Go to the current date, if today was requested
            if (trans.$to().name === 'today'){
                // Redirect to the current date
                var today = new Date();
                today.setTime(Date.now());
                $state.transitionTo("time", {year: today.getFullYear(), month: today.getMonth()+1, day: today.getDate()});
            }
        });
    });
});

// Config / Routing
angular.module("cycloneApp").config(function($mdThemingProvider, $stateProvider, $urlRouterProvider) {
    // Define the theme / pallete colors we use (these are the md defaults)
    $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('pink')
        .warnPalette('red');

    // Routing
    // TODO: redirect today to the real date
    $urlRouterProvider.otherwise("/today");

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
    // Test route
    $stateProvider
        .state('today', {
            url: "/today"
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
    // Time-line
    $stateProvider
        .state('time', {
            url: "/time/{year:int}/{month:int}/{day:int}",
            views: {
                nav: {
                    component: "nav",
                },
                content: {
                    // controller: "TimeCtrl",
                    // template: require('./time/time.tpl.html')
                    component: "timeline",
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
                },
                $stateParams: function($stateParams){
                    return $stateParams;
                }
            }
        });

    // Task
    $stateProvider
        .state('task', {
            url: "/task/{year:int}/{month:int}/{day:int}",
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
                },
                $stateParams: function($stateParams){
                    return $stateParams;
                }
            }
        });


    // Specific day view / Archive
    $stateProvider
        .state('day', {
            url: "/archive/:year/:month/:day",
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
