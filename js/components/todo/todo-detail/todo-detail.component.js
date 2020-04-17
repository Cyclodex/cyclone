var todoDetail = {
    bindings: {
        todo: '<',
        onSave: '&',
        onUpdate: '&',
        onDelete: '&'
    },
    template: require('./todo-detail.tpl.html'),
    controller: 'TodoDetailController'
};

angular
    .module('components.todo')
    .component('todoDetail', todoDetail);
