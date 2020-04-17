function ProfileController($stateParams, AuthService) {
    var ctrl = this;
    var user = AuthService.getUser();
    ctrl.$onInit = function () {
        ctrl.user = user;
        ctrl.currentNavItem = 'actions';
        if ($stateParams.group) {
            ctrl.currentNavItem = $stateParams.group;
        }
    };
}

angular
    .module('common')
    .controller('ProfileController', ProfileController);