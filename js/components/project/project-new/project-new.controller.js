function ProjectNewController(ProjectService, $state) {
    var ctrl = this;
    ctrl.$onInit = function(){
        ctrl.project = {
            name: '',
            color: '',
            type: 'work'
        };
    };
    ctrl.createNewProject = function(event){
        // ProjectService
        return ProjectService
            .createNewProject(event.project)
            .then(function (){
                // success
                // Reset inputs
                ctrl.project = {
                    name: '',
                    color: '',
                    type: 'work'
                };
            });
    }
}

angular
    .module('components.project')
    .controller('ProjectNewController', ProjectNewController);