angular.module('cycloneApp').factory('stateService', ['$stateParams', 'moment',
    function($stateParams, moment) {
    'use strict';

    function StateService() {};

    StateService.prototype.getPageType = function() {
        // Get the requested date
        return $stateParams.type;
    };

    StateService.prototype.getCurrentDate = function() {
        // Get the requested date if available
        if ($stateParams.year && $stateParams.month && $stateParams.day){
            var requestedDate = $stateParams.year
                + '-' + $stateParams.month
                + '-' + $stateParams.day;
        } else {
            // Otherwise we take today
            requestedDate = new Date();
        }
        // Parse the date from the URL with different formats
        requestedDate = moment(requestedDate,
            [
                'YYYY-MMMM-DD'  // DE long month name
                ,'YYYY-MMM-DD'  // DE short month name
                ,'YYYY-MM-DD'   // DE date format short
                ,'YYYY-M-DD'    // DE date format short
                ,'YYYY-M-D'     //  DE date format short
                //,'YYYY-DD-MM'    // US - date format
            ],
            true // strict parsing
        );

        if (!requestedDate.isValid()){
            this.error = 'Invalid date entered!';
        }
        return requestedDate;
    };

    return new StateService();
}]);
