angular.module('cycloneApp').component('taskCardList', {
    bindings: {
        listTitle: '@',
        listIcon: '@',
        data: '<'
    },
    require: {
        task: '^^'
    },
    template: require('./taskCardList.tpl.html'),
});