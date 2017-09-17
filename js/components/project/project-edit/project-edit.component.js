var projectEdit = {
    bindings: {
        project: '<',
        AuthService: '<'
    },
    template: require('./project-edit.tpl.html'),
    controller: 'ProjectEditController'
};

angular
    .module('components.project')
    .component('projectEdit', projectEdit)
    .config(function($stateProvider) {
        $stateProvider
            .state('project', {
                parent: 'app',
                url: '/project/:id',
                component: 'projectEdit',
                resolve: {
                    project: function ($transition$, ProjectService){
                        var key = $transition$.params().id;
                        return ProjectService.getProjectById(key).$loaded();
                    }
                }
            });
    });
