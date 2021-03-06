function ProfileCrudController($stateParams, ProfileService, cfpLoadingBar) {
    var ctrl = this;
    var features = ctrl.features;

    ctrl.$onInit = function () {
        ctrl.currentNavItem = 'actions';
        if ($stateParams.group){
            ctrl.currentNavItem = $stateParams.group;
        }
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
