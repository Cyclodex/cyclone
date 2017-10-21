angular.module('cycloneApp').component('welcome', {
    template: require('./welcome.tpl.html'),
    controller: function() {
        this.greeting = 'welcome';
    }
});