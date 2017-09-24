function ProjectsCrudController($state, ProjectService, cfpLoadingBar) {
    var ctrl = this;
    var projects = ctrl.projects;

    // update
    ctrl.updateProject = function (event) {
        cfpLoadingBar.start();
        return ProjectService
            // .saveProject(event.project)
            // 'projects': Helps us to save the entry directly with $save
            .saveProject(event.project, projects)
            .then(cfpLoadingBar.complete, cfpLoadingBar.complete);
    };
    // delete
    ctrl.deleteProject = function (event) {
        cfpLoadingBar.start();
        return ProjectService
            .removeProject(event.project, projects)
            .then(cfpLoadingBar.complete, cfpLoadingBar.complete);
        // .then(function() {
        //     $state.go('projects');
        // })
    };
}

angular
    .module('components.project')
    .controller('ProjectsCrudController', ProjectsCrudController);
