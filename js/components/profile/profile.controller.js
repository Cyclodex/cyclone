function ProfileController() {
    var ctrl = this;
    ctrl.$onInit = function () {
        ctrl.currentNavItem = 'profile';
    };
}

angular
    .module('common')
    .controller('ProfileController', ProfileController);