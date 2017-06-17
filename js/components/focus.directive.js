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

// TODO: How to load this factory into the new components?
angular.module('cycloneApp').factory('focus', function($rootScope, $timeout) {
    return function(name) {
        $timeout(function() {
            $rootScope.$broadcast('focusOn', name);
        });
    }
});

/**
 * New temporary solution for focus project autocomplete
 */
function doFocus() {
    return {
        restrict: 'A',
        scope: false,
        link: function ($scope, $element, $attrs) {
            $scope.$watch($attrs.doFocus, function (newValue, oldValue) {
                if (!newValue) {
                    return;
                }
                // Push this event to the end of the call stack, otherwise it might not work correctly
                setTimeout(function () {
                    $element[0].focus();
                }, 0);
            });
        }
    };
}
angular
    .module('cycloneApp')
    .directive('doFocus', doFocus);
