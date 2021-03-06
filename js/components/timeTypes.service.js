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
                'icon': 'money_off'
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
    };

    return new timeTypesService();
}]);
