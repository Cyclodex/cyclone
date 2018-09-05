angular.module('cycloneApp').component('navigation', {
    template: require('./nav.tpl.html'),
    bindings: {
        user: '<'
    },
    controller: ['stateService', 'ProfileService', function navCtrl(stateService, ProfileService) {
        var $ctrl = this;

        $ctrl.features = ProfileService.getFeatureStates();
        var currentDate = stateService.getCurrentDate();
        $ctrl.pageType = stateService.getPageType();

        // Current date values
        $ctrl.currentDate = {
            "year": currentDate.year(),
            "month": currentDate.format('MM'),
            "day": currentDate.format('DD'),
            "week": currentDate.week()
        };

        $ctrl.logout = function() {
            firebase.auth().signOut().then(function() {
                console.log('Signed Out');
                location.reload();
            }, function(error) {
                console.error('Sign Out Error', error);
            });
        };

    }]
});