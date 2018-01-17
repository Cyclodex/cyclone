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
            .state('projects-crud', {
                parent: 'profile',
                url: '/projects-crud',
                views: {
                    'head@projects-crud': {
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
