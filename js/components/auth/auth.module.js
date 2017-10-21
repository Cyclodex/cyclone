angular.module("components.auth", [

]);

angular.module("components.auth").run(function ($transitions, $state, AuthService) {
    $transitions.onStart({
        to: function (state) {
            return !!(state.data && state.data.requiredAuth);
        }
    }, function() {
        return AuthService
            .requireAuthentication()
            .catch(function () {
                return $state.target('login');
            })
    });

    // Logged in users should not go to login again
    $transitions.onStart({
        to: 'login'
    }, function() {
        if (AuthService.isAuthenticated()) {
            return $state.target('welcome');
        }
    });
});