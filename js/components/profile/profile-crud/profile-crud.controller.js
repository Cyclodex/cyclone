function ProfileCrudController($stateParams, ProfileService, cfpLoadingBar) {
    var ctrl = this;
    var features = ctrl.features;

    ctrl.$onInit = function () {
        ctrl.currentNavItem = 'action-buttons';
        console.log($stateParams);
        if ($stateParams.group){
            ctrl.currentNavItem = $stateParams.group;
        }
        console.log(ctrl.currentNavItem);
    };


    // update
    ctrl.updateFeature = function (event) {
        cfpLoadingBar.start();
        return ProfileService
            .updateFeatures(event.feature)
            .then(cfpLoadingBar.complete, cfpLoadingBar.complete);
    };
}

angular
    .module('components.profile')
    .controller('ProfileCrudController', ProfileCrudController);
