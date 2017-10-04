var timelineCardList = {
    bindings: {
        listTitle: '@',
        data: '<'
    },
    require: {
        timeline: '^^'
    },
    template: require('./timelineCardList.tpl.html'),
    controller: ['ProfileService', function timelineCardList(ProfileService) {
        var ctrl = this;
        ctrl.features = ProfileService.getFeatureStates();

        ctrl.$onInit = function () {
            ctrl.features = ProfileService.getFeatureStates();
            // Load the different time types from the parent controller
            ctrl.timeTypesService = ctrl.timeline.timeTypesService;
        };
    }]
};

angular
    .module('components.time')
    .component('timelineCardList', timelineCardList);
