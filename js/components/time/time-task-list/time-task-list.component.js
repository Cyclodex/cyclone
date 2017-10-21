var timeTaskList = {
    bindings: {
        listTitle: '@',
        listIcon: '@',
        data: '<',
        filter: '@',
        filterCheckAble: '@'
    },
    require: {
        timeTask: '^^'
    },
    template: require('./time-task-list.tpl.html'),
    controller: ['ProfileService', function timeTaskList(ProfileService) {
        var ctrl = this;

        ctrl.$onInit = function () {
            ctrl.features = ProfileService.getFeatureStates();
        };
    }]
};


angular
    .module('components.time')
    .component('timeTaskList', timeTaskList);
