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
    controller: ['ProfileService', function taskCardList(ProfileService) {
        var $ctrl = this;
        $ctrl.features = ProfileService.getFeatureStates();
    }]
});