function ProjectNewController(ProjectService, $state) {
    var ctrl = this;
    ctrl.$onInit = function(){
        ctrl.project = {
            name: '',
            color: '',
            type: ''
        };
    };
    ctrl.createNewProject = function(event){
        // ProjectService
        return ProjectService
            .createNewProject(event.project)
            .then(function (project){
                // success
                console.log(project);
                $state.go('project', {
                    id: project.key
                });
            });
    }
}

angular
    .module('components.project')
    .controller('ProjectNewController', ProjectNewController);