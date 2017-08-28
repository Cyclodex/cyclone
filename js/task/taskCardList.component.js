angular.module('cycloneApp').component('taskCardList', {
    bindings: {
        listTitle: '@',
        listIcon: '@',
        data: '<',
        filter: '@',
        filterCheckAble: '@'
    },
    require: {
        task: '^^'
    },
    template: require('./taskCardList.tpl.html'),
});