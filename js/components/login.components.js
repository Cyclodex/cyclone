angular.module('cycloneApp').component('login', {
    // TODO: This is ES6, we should use babel in webpack or move template code out
    template: `<!-- Login button -->
    <div layout="column"
         layout-align="center center"
         class="login">
        <h1>Cyclone</h1>
        <a id="loginButton"
           href="authentication.html"
           target="_parent"
           class=""
           ng-show="!user">
            <md-button class="md-raised md-primary" aria-label="Login">Login</md-button>
        </a>
    </div>`,
    // No controller needed here...
    // controller: function() {
    // }
});