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
                parent: 'profile',
                url: '/:group',
                views: {
                    '': {
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
