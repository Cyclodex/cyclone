function TodoNewController(TodoService, $state) {
    var ctrl = this;
    ctrl.$onInit = function () {
        ctrl.todo = {
            name: '',
            tags: '',
            prio: '',
            done: false
        };
    };
    ctrl.createNewTodo = function (event) {
        // TodoService
        return TodoService
            .createNewTodo(event.todo)
            .then(function () {
                // success
                // Reset inputs
                ctrl.todo = {
                    name: '',
                    tags: '',
                    prio: '',
                    done: false
                };
            });
    }
}

angular
    .module('components.todo')
    .controller('TodoNewController', TodoNewController);