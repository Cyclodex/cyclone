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
                // Reset the value again
                $scope.$ctrl.setFocus = false;

                // Push this event to the end of the call stack, otherwise it might not work correctly
                setTimeout(function () {
                    $element[0].focus();
                }, 0);
            });
        }
    };
}
angular
    .module('components')
    .directive('doFocus', doFocus);
