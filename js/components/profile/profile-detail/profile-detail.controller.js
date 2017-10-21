function ProfileDetailController(ProfileService) {
    var ctrl = this;
    ctrl.featureModel = null;

    ctrl.$onInit = function () {
        ProfileService.createDefaultFeatures(ctrl.feature).then(function (featureModel){
            ctrl.featureModel = featureModel;
        });
    };
    ctrl.updateFeature = function () {
        ctrl.onUpdate({
            $event: {
                feature: ctrl.featureModel
            }
        });
    };
}

angular
    .module('components.profile')
    .controller('ProfileDetailController', ProfileDetailController);