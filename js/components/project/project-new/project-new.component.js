var projectNew = {
    template: require('./project-new.tpl.html'),
    controller: 'ProjectNewController'
};

angular
    .module('components.project')
    .component('projectNew', projectNew)
    .config(function ($stateProvider){
        $stateProvider
            .state('new', {
                parent: 'projects',
                url: '/new',
                views: {
                    'head@projects': {
                        component: 'projectNew'
                    }
                }
            })
    });