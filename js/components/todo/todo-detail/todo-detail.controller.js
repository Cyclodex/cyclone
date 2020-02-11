function TodoDetailController(timeTypesService) {
    var ctrl = this;
    ctrl.$onInit = function () {
        ctrl.isNewTodo = !ctrl.todo.$id;

        ctrl.timeTypes = timeTypesService.getTimeTypes();
    };
    ctrl.saveTodo = function () {
        ctrl.onSave({
            $event: {
                todo: ctrl.todo
            }
        });
    };
    ctrl.updateTodo = function () {
        ctrl.onUpdate({
            $event: {
                todo: ctrl.todo
            }
        });
    };
    ctrl.deleteTodo = function () {
        ctrl.onDelete({
            $event: {
                todo: ctrl.todo
            }
        });
    };
}
TodoDetailController.$inject = ['timeTypesService'];
angular
    .module('components.todo')
    .controller('TodoDetailController', TodoDetailController);