function AuthService($firebaseAuth) {
    var auth = $firebaseAuth();
    var authData = null;

    function storeAuthData(response) {
        authData = response;
        // Create the username from the email
        authData.username = authData.email.substring(0, authData.email.indexOf("@"));
        return authData;
    }
    function onSignIn(user){
        authData = user;
        return auth.$requireSignIn();
    }

    $firebaseAuth().$onAuthStateChanged(function(user) {
        // If user is not logged in, user = null
        if (user){
            storeAuthData(user);
        }
    });

    // No register here
    // No login here

    this.requireAuthentication = function () {
        return auth.$waitForSignIn().then(onSignIn);
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

angular
    .module('components.auth')
    .service('AuthService', AuthService);