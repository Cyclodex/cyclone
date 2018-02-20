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
                redirectTo: 'projects', // should this be project-crud? auto redirect?
                url: '/app',
                data: {
                    requiredAuth: true
                },
                views: {
                    'navigation@app': {
                        component: 'navigation'
                    },
                    '@': {
                        component: 'app'
                    }
                }
        });
    });