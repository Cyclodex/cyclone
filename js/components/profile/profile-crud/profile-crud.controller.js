function ProfileCrudController($state, ProfileService, cfpLoadingBar) {
    var ctrl = this;
    var features = ctrl.features;

    ctrl.$onInit = function () {
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
