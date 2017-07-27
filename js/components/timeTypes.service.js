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
                'color': 'lightyellow',
                'icon': 'attach_money'
            },
            "internal": {
                'name': 'Internal work',
                'value': 'internal',
                'order': 1,
                'color': '#ffdb6e',
                'icon': 'android'
            },
            "trust": {
                'name': 'Trust time',
                'value': 'trust',
                'order': 2,
                'color': '#e1c2e6',
                'icon': 'card_giftcard'
            },
            "private": {
                'name': 'Private / Break',
                'value': 'private',
                'order': 3,
                'color': 'lightblue',
                'icon': 'free_breakfast'
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
