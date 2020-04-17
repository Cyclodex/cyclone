var todosCrud = {
    bindings: {
        todos: '<'
    },
    template: require('./todos-crud.tpl.html'),
    controller: 'TodosCrudController'
};

angular
    .module('components.todo')
    .component('todosCrud', todosCrud)
    .config(function ($stateProvider) {
        $stateProvider
            .state('todo', {
                parent: 'app',
                url: '/todo',
                views: {
                    'head@todo': {
                        component: 'todoNew'
                    },
                    '': {
                        component: 'todosCrud'
                    }
                },
                resolve: {
                    todos: function (TodoService) {
                        return TodoService.getTodoList().$loaded();
                    }
                }
            });
    });
