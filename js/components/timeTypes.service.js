angular.module('cycloneApp').factory('timeTypesService', [function() {
    'use strict';

    function timeTypesService() {
    }

    timeTypesService.prototype.getTimeTypes = function() {
        return {
            "work": {
                'name': 'Client work',
                'value': 'work',
                'order': 0,
                'color': 'lightyellow'
            },
            "internal": {
                'name': 'Internal work',
                'value': 'internal',
                'order': 1,
                'color': '#ffdb6e'
            },
            "trust": {
                'name': 'Trust time',
                'value': 'trust',
                'order': 2,
                'color': '#e1c2e6'
            },
            "private": {
                'name': 'Private / Break',
                'value': 'private',
                'order': 3,
                'color': 'lightblue'
            }
        };

        return [
            {
                'name'  : 'Client work',
                'value' : 'work',
                'order' : 0
            },
            {
                'name'  : 'Internal work',
                'value' : 'internal',
                'order' : 1
            },
            {
                'name'  : 'Trust time',
                'value' : 'trust',
                'order' : 2
            },
            {
                'name'  : 'Private / break',
                'value' : 'private',
                'order' : 3
            }
        ];
    };

    return new timeTypesService();
}]);
