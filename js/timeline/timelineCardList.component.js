angular.module('cycloneApp').component('timelineCardList', {
    bindings: {
        listTitle: '@',
        data: '<'
    },
    require: {
        timeline: '^^'
    },
    template: require('./timelineCardList.tpl.html'),
    controller: ['ProfileService', function timelineCardList(ProfileService) {
        var $ctrl = this;
        $ctrl.features = ProfileService.getFeatureStates();
    }]
});