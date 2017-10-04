var timelineList = {
    bindings: {
        listTitle: '@',
        data: '<'
    },
    require: {
        timeline: '^^'
    },
    template: require('./timeline-list.tpl.html'),
    controller: ['ProfileService', function timelineList(ProfileService) {
        var ctrl = this;
        ctrl.features = ProfileService.getFeatureStates();

        ctrl.$onInit = function () {
            ctrl.features = ProfileService.getFeatureStates();
        };
    }]
};

angular
    .module('components.time')
    .component('timelineList', timelineList);
