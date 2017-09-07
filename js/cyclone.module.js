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
                console.log("wants to go somewhere now... why?");

                console.log('######################');
                console.log("trans $to === today");
                console.log(trans);
                console.log($state);
                // Redirect to the current date
                var today = new Date();
                today.setTime(Date.now());
                // TODO: Sometimes it goes back to the time view, must be related to this somehow:
                // was transitionTo
                //$state.go("time", {year: today.getFullYear(), month: today.getMonth()+1, day: today.getDate()});
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
    $urlRouterProvider.otherwise("/welcome");

    // Today route - will forward to the current date
    $stateProvider
        .state('welcome', {
            url: "/welcome",
            views: {
                nav: {
                    component: "nav",
                },
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
                },
                moment: function(moment) {
                    return moment;
                },
                $firebaseArray: function($firebaseArray) {
                    return $firebaseArray;
                },
                $firebaseObject: function($firebaseObject) {
                    return $firebaseObject;
                },
                $timeout: function($timeout) {
                    return $timeout;
                },
                firebaseRef: function(firebaseRef) {
                    return firebaseRef;
                },
                $stateParams: function($stateParams){
                    return $stateParams;
                },
                helperService: function(helperService) {
                    return helperService;
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
                $firebaseObject: function($firebaseObject) {
                    return $firebaseObject;
                },
                $timeout: function($timeout) {
                    return $timeout;
                },
                firebaseRef: function(firebaseRef) {
                    return firebaseRef;
                },
                $stateParams: function($stateParams){
                    return $stateParams;
                },
                helperService: function(helperService) {
                    return helperService;
                }
            }
        });
});
