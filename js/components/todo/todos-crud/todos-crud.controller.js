function TodosCrudController($state, TodoService, cfpLoadingBar) {
    var ctrl = this;

    // update
    ctrl.updateTodo = function (event) {
        cfpLoadingBar.start();

        return TodoService
            // .saveTodo(event.todo)
            // 'todos': Helps us to save the entry directly with $save
            .saveTodo(event.todo, ctrl.todos)
            .then(cfpLoadingBar.complete, cfpLoadingBar.complete);
    };
    // delete
    ctrl.deleteTodo = function (event) {
        cfpLoadingBar.start();
        return TodoService
            .removeTodo(event.todo, ctrl.todos)
            .then(cfpLoadingBar.complete, cfpLoadingBar.complete);
        // .then(function() {
        //     $state.go('todo');
        // })
    };
}

angular
    .module('components.todo')
    .controller('TodosCrudController', TodosCrudController);
