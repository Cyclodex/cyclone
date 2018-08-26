angular.module('cycloneApp').factory('stateService', ['$stateParams', '$state', 'moment', 'helperService',
    function($stateParams, $state, moment, helperService) {
    'use strict';

    function StateService() {};

    StateService.prototype.getPageType = function() {
        // Get the requested type
        return $stateParams.type;
    };

    StateService.prototype.getCurrentDate = function() {
        // Get the requested date if available
        if ($state.current.name === 'calendar') {
            if ($stateParams.year && $stateParams.month){
                var requestedDate = $stateParams.year
                    + '-' + $stateParams.month;
            }
            // Parse the date from the URL with different formats
            requestedDate = moment(requestedDate,
                [
                    'YYYY-MM',   // DE date format short
                    'YYYY-M'     // DE date format short
                ],
                true // strict parsing
            );
            var today = moment();
            // Adding todays date for the navigation if calendar is on current month
            if (requestedDate.isSame(today, 'month')) {
                requestedDate.date(today.date());
            }
        } else {
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
                    // 'YYYY-MMMM-DD'  // DE long month name
                    // ,'YYYY-MMM-DD'  // DE short month name
                    'YYYY-MM-DD',   // DE date format short
                    'YYYY-M-DD',    // DE date format short
                    'YYYY-M-D'     //  DE date format short
                ],
                true // strict parsing
            );
        }
        
        if (!requestedDate.isValid()){
            this.error = 'Invalid date entered!';
        }
        return requestedDate;
    };

    StateService.prototype.getWeek = function() {
        // Get the requested date if available
        if ($stateParams.year && $stateParams.week){
            return {
                year: $stateParams.year,
                week: $stateParams.week,
            }
        }
    };

    StateService.prototype.getMonthDetails = function() {
        // Get the requested date if available
        if ($stateParams.year && $stateParams.month){
            const date = moment($stateParams.year + '-' + $stateParams.month, 'YYYY-MM');
            const weeksOfMonth = helperService.getWeeksOfMonth(date);
            const weekStart = date.clone().startOf('month').isoWeekday();
            const lastDay = date.clone().endOf('month').date();
            return {
                year: $stateParams.year,
                month: $stateParams.month,
                weeks: weeksOfMonth,
                weekStart: weekStart,
                lastDay: lastDay,
                date: date
            }
        }
    };

    return new StateService();
}]);
