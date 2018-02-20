var profile = {
    template: require('./profile.tpl.html'),
    controller: 'ProfileController'
};

angular
    .module('components.profile')
    .component('profile', profile)
    .config(function ($stateProvider) {
        $stateProvider
            .state('profile', {
                parent: 'app',
                url: '/profile',
                views: {
                    'header@app': {
                        component: 'profile'
                    }
                }
            });
    });
