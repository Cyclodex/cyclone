var app = {
    template: require('./app.tpl.html'),
    controller: 'AppController'
};

angular
    .module('common')
    .component('app', app)
    .config(function ($stateProvider) {
        $stateProvider
            .state('app', {
                redirectTo: 'projects',
                url: '/app',
                data: {
                    requiredAuth: true
                },
                views: {
                    '@': {
                        component: 'app'
                    },
                    'nav@app': {
                        component: 'nav'
                    }
                }
        });
    });