angular.module('cycloneApp').component('taskCardList', {
    bindings: {
        title: '@',
        data: '<'
    },
    require: {
        task: '^^'
    },
    template: require('./taskCardList.tpl.html'),
});