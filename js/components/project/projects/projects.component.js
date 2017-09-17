var projects = {
    bindings: {
        projects: '<'
    },
    template: require('./projects.tpl.html'),
    controller: 'ProjectsController'
};

angular
    .module('components.project')
    .component('projects', projects)
    .config(function ($stateProvider) {
        $stateProvider
            .state('projects', {
                parent: 'app',
                url: '/projects',
                component: 'projects',
                resolve: {
                    projects: function (ProjectService) {
                        return ProjectService.getProjectList().$loaded();
                    }
                }
            });
    });
