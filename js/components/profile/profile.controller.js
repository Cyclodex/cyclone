function ProfileController($stateParams) {
    var ctrl = this;
    ctrl.$onInit = function () {
        ctrl.currentNavItem = 'actions';
        if ($stateParams.group){
            ctrl.currentNavItem = $stateParams.group;
        }
    };
}

angular
    .module('common')
    .controller('ProfileController', ProfileController);