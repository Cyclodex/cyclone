var todoNew = {
    template: require('./todo-new.tpl.html'),
    controller: 'TodoNewController'
};

angular
    .module('components.todo')
    .component('todoNew', todoNew)
    .config(function ($stateProvider) {
        $stateProvider
            .state('newTodo', {
                parent: 'todo',
                url: '/new',
                views: {
                    'head@todo': {
                        component: 'todoNew'
                    }
                }
            })
    });