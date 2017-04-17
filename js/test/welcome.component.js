angular.module('cycloneApp').component('welcome', {
    template: require('./welcome.tpl.html'),
    controller: function() {
        this.greeting = 'welcome';
        this.toggleGreeting = function() {
            this.greeting = (this.greeting == 'welcome') ? 'whats up' : 'welcome'
        }
    }
});