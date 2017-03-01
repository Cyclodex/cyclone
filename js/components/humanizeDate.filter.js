// Helps to render numbers as hours, minutes or seconds in simple and human way.
angular.module('cycloneApp').filter('humanizeDate', ['$filter', 'moment', function ($filter, moment) {
    return function (input, units) {
        var duration = moment().startOf('day').add(input, units),
            format = "";

        // Show hours
        if(duration.hour() > 1){ format += "H [hours] "; }
        if(duration.hour() == 1){ format += "H [hour] "; }

        // Show minutes
        if(duration.minute() > 1){ format += "m [minutes] "; }
        if(duration.minute() == 1){ format += "m [minute] "; }

        // Only if smaller than a minute, we show seconds
        if(duration.hour() == 0 && duration.minute() == 0){ format += "s [seconds]"; }

        return duration.format(format);
    };
}]);