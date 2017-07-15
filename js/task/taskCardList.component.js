angular.module('cycloneApp').component('taskCardList', {
    bindings: {
        listTitle: '@',
        data: '<'
    },
    require: {
        task: '^^'
    },
    template: require('./taskCardList.tpl.html'),
});