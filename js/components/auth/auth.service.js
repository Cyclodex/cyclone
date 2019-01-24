function AuthService(Auth) {
    var authData = null;

    function storeAuthData(response) {
        authData = response;
        // Create the username from the email
        authData.username = authData.email.substring(0, authData.email.indexOf("@"));
        return authData;
    }
    function onSignIn(user){
        authData = user;
        return Auth.$requireSignIn();
    }

    Auth.$onAuthStateChanged(function(user) {
        // If user is not logged in, user = null
        if (user){
            storeAuthData(user);
        }
    });

    // No register here
    // No login here

    this.requireAuthentication = function () {
        return Auth.$waitForSignIn().then(onSignIn);    
    };
    this.isAuthenticated = function () {
        return !!authData; // null || {user}
    };

    this.getUser = function () {
        if (authData) {
            return authData;
        }
    };
}
AuthService.$inject = ['Auth'];
angular
    .module('components.auth')
    .service('AuthService', AuthService);