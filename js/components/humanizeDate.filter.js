// Helps to render numbers as hours, minutes or seconds in simple and human way.
angular.module('cycloneApp').filter('humanizeDate', ['$filter', 'moment', function ($filter, moment) {
    return function (input, units) {
        var format = '';
        if (input > 0) {
            var negative = '';
            var duration = moment().startOf('day').add(input, units);
        } else {
            var negative = '-';
            var duration = moment().startOf('day').subtract(input, units);
        }

        // Show hours
        if(duration.hour() > 1){ format += "H [hours] "; }
        if(duration.hour() === 1){ format += "H [hour] "; }

        // Show minutes
        if(duration.minute() > 1){ format += "m [minutes] "; }
        if(duration.minute() === 1){ format += "m [minute] "; }

        // Only if smaller than a minute, we show seconds
        if(duration.hour() === 0 && duration.minute() === 0){ format += "s [seconds]"; }

        return negative + duration.format(format);
    };
}]);

// Helps to render numbers as hours, minutes or seconds in simple and human way.
angular.module('cycloneApp').filter('humanizeDateShort', ['$filter', 'moment', function ($filter, moment) {
    return function (input, units) {
        var duration = moment().startOf('day').add(input, units),
            format = "";

        // Show hours
        if(duration.hour() > 0){ format += "H[h]"; }

        // Show minutes
        if(duration.minute() > 0){ format += " m[m]"; }

        // Only if smaller than a minute, we show seconds
        if(duration.hour() === 0 && duration.minute() === 0){ format += "s[s]"; }

        return duration.format(format);
    };
}]);

// Helps to render timestamp into decimal hours (x.xx)
angular.module('cycloneApp').filter('timestampInDecimalHours', [function () {
    return function (input, units) {
        var decimal = (input / 1000 / 60 / 60 ).toFixed(2);
        return decimal;
    };
}]);

// Helps to render decimal hours (x.xx)
angular.module('cycloneApp').filter('decimalHours', [function () {
    return function (input, units) {
        var decimal = input.toFixed(2) + 'h';
        return decimal;
    };
}]);

// Helps to render a time value in the user selected format (feature)
angular.module('cycloneApp').filter('timeInUserSelectedFormat', ['$filter', '$log', function ($filter, $log) {
    //var log = $log.getInstance('filter');
    return function (value, type) {
        var separator = ' | ';
        var output = '';
        //log.warn("Value: [%s], Type: [%s]", value, type)
        switch(type) {
            case 'dec':
                output = $filter('timestampInDecimalHours')(value);
                break;
            case 'hShort':
                output = $filter('humanizeDateShort')(value);
                break;
            case 'hShort+dec':
            default:
                output = $filter('humanizeDateShort')(value);
                output += separator;
                output += $filter('timestampInDecimalHours')(value);
                break;
            case 'hLong':
                output = $filter('humanizeDate')(value);
                break;
            case 'hLong+dec':
                output = $filter('humanizeDate')(value);
                output += separator;
                output += $filter('timestampInDecimalHours')(value);
                break;
        }
        return output;
    };
}]);
