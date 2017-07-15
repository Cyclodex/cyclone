angular.module('cycloneApp').component('timelineCardList', {
    bindings: {
        listTitle: '@',
        data: '<'
    },
    require: {
        timeline: '^^'
    },
    template: require('./timelineCardList.tpl.html'),
});