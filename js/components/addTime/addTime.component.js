function addTime() {
    return {
        restrict: 'E',
        template: require('./addTime.tpl.html'),
    };
}

angular
    .module('cycloneApp')
    .directive('addTime', addTime);