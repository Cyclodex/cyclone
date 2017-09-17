angular
    .module('common', [
        'ui.router',
        'angular-loading-bar',
        'cycloneApp'
    ])
    .run(function ($transitions, cfpLoadingBar) {
    $transitions.onStart({}, cfpLoadingBar.start);
    $transitions.onSuccess({}, cfpLoadingBar.complete);
});