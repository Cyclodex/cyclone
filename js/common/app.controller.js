function AppController(AuthService) {
    var ctrl = this;
    ctrl.user = AuthService.getUser();
}

angular
    .module('common')
    .controller('AppController', AppController);