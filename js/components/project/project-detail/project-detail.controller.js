function ProjectDetailController(timeTypesService) {
    var ctrl = this;
    ctrl.$onInit = function () {
        ctrl.isNewProject = !ctrl.project.$id;

        ctrl.timeTypes = timeTypesService.getTimeTypes();
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
ProjectDetailController.$inject = ['timeTypesService'];
angular
    .module('components.project')
    .controller('ProjectDetailController', ProjectDetailController);