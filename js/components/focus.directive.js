// Focus an input element - directive
// http://stackoverflow.com/questions/14833326/how-to-set-focus-on-input-field
angular.module('cycloneApp').directive('focusOn', function() {
    return function(scope, elem, attr) {
        scope.$on('focusOn', function(e, name) {
            if (name === attr.focusOn) {
                elem[0].focus();
            }
        });
    };
});

angular.module('cycloneApp').factory('focus', function($rootScope, $timeout) {
    return function(name) {
        $timeout(function() {
            $rootScope.$broadcast('focusOn', name);
        });
    }
});
