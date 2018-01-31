var projectsCrud = {
    bindings: {
        projects: '<'
    },
    template: require('./projects-crud.tpl.html'),
    controller: 'ProjectsCrudController'
};

angular
    .module('components.project')
    .component('projectsCrud', projectsCrud)
    .config(function ($stateProvider) {
        $stateProvider
            .state('projects', {
                parent: 'profile',
                url: '/projects',
                views: {
                    'head@projects': {
                        component: 'projectNew'
                    },
                    '': {
                        component: 'projectsCrud'
                    }
                },
                resolve: {
                    projects: function (ProjectService) {
                        return ProjectService.getProjectList().$loaded();
                    }
                }
            });
    });
