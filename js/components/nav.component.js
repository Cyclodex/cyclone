angular.module('cycloneApp').component('nav', {
    template: require('./nav.tpl.html'),
    bindings: {
        user: '<'
    },
    controller: ['stateService', function navCtrl(stateService) {
        var $ctrl = this;

        var currentDate = stateService.getCurrentDate();
        $ctrl.pageType = stateService.getPageType();

        // Current date values
        $ctrl.currentDate = {
            "year": currentDate.year(),
            "month": currentDate.format('MM'),
            "day": currentDate.format('DD')
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