function ProjectDetailController() {
    var ctrl = this;
    ctrl.$onInit = function () {
        ctrl.isNewProject = !ctrl.project.$id;
    };
    ctrl.saveProject = function () {
        ctrl.onSave({
            $event: {
                project: ctrl.project
            }
        });
    };
    ctrl.updateProject = function () {
        ctrl.onUpdate({
            $event: {
                project: ctrl.project
            }
        });
    };
    ctrl.deleteProject = function () {
        ctrl.onDelete({
            $event: {
                project: ctrl.project
            }
        });
    };
}

angular
    .module('components.project')
    .controller('ProjectDetailController', ProjectDetailController);