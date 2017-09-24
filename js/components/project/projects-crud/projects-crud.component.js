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
                parent: 'app',
                url: '/projects-crud',
                views: {
                    'head@projects-crud': {
                        component: 'projectNew'
                    },
                    'content@app': {
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
