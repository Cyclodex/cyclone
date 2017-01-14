angular.module("cycloneApp", ["firebase", 'ngMaterial', 'ngRoute', 'angular-clipboard', 'angularMoment']);

// Routing
angular.module("cycloneApp").config(function($routeProvider, $locationProvider) {
    $routeProvider
        .when('/:type', {templateUrl: 'index.html', controller: 'TimeCtrl'})
        .when('/:type/:year/:month/:day*', {templateUrl: 'index.html', controller: 'TimeCtrl'})
        .when('/:type/:weekNumber/:weekDay*', {templateUrl: 'index.html', controller: 'TimeCtrl'})
        .otherwise({redirectTo: '/today'});

    $locationProvider.html5Mode({
        enabled: false,
        requireBase: false
    });
});
