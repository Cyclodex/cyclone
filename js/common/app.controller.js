function AppController(AuthService, $state) {
    var ctrl = this;
    ctrl.user = AuthService.getUser();
}

angular
    .module('common')
    .controller('AppController', AppController);