function ProjectEditController($state, ProjectService, $window, cfpLoadingBar) {
    var ctrl = this;

    // update user
    ctrl.updateProject = function (event) {
        cfpLoadingBar.start();
        return ProjectService
            .updateProject(event.project)
            .then(cfpLoadingBar.complete, cfpLoadingBar.complete);
    };
    // delete user
    ctrl.deleteProject = function (event) {
        var message = 'Delete ' + event.project.name + ' from project list';
        if ($window.confirm(message)){
            return ProjectService
                .deleteProject(event.project)
                .then(function() {
                    $state.go('projects');
                })
        }
    };
}

angular
    .module('components.project')
    .controller('ProjectEditController', ProjectEditController);