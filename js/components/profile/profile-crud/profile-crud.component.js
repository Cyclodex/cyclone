var profileCrud = {
    bindings: {
        features: '<'
    },
    template: require('./profile-crud.tpl.html'),
    controller: 'ProfileCrudController'
};

angular
    .module('components.profile')
    .component('profileCrud', profileCrud)
    .config(function ($stateProvider) {
        $stateProvider
            .state('profile-crud', {
                parent: 'app',
                url: '/profile-crud',
                views: {
                    'content@app': {
                        component: 'profileCrud'
                    }
                },
                resolve: {
                    features: function (ProfileService) {
                        return ProfileService.getFeatures();
                    }
                }
            });
    });
