// Instead of "app" we use cycloneApp already...
angular.module("cycloneApp", [
    'firebase',
    'ngMaterial',
    'ui.router',
    'angular-clipboard',
    'angularMoment',
    'ngAnimate',
    'angular-loading-bar',
    'angulartics',
    'angulartics.google.analytics',
    'angular-logger'
]);

// Make sure user is authenticated, otherwise send to login state
angular.module("cycloneApp").run(function($transitions, cfpLoadingBar) {
    $transitions.onStart(
    {
        // Special function match, so we require authentication everywhere but not on "login" state.
        to: function(state) {
            cfpLoadingBar.start();
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

    // Finish the loading bar
    $transitions.onSuccess({}, cfpLoadingBar.complete);
});

// Config / Routing
angular.module("cycloneApp").config(function($mdThemingProvider, $stateProvider, $urlRouterProvider, logEnhancerProvider) {
    // Configure log
    //logEnhancerProvider.prefixPattern = '%s - %s: ';
    logEnhancerProvider.prefixPattern = '%3$s - %2$s: ';

    // Define the theme / pallete colors we use (these are the md defaults)
    $mdThemingProvider.theme('default')
        .primaryPalette('indigo')
        .accentPalette('pink')
        .warnPalette('red');

    // Routing
    $urlRouterProvider.otherwise("/app/welcome");

    // Today route - will forward to the current date
    $stateProvider
        .state('welcome', {
            url: "/welcome",
            parent: 'app',
            views: {
                navigation: {
                    component: "navigation",
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
            component: 'login'
        });
});
