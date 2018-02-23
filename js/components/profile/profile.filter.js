// Filter profile settings per group
angular.module('components.profile').filter('filterGroup', function() {
    return function(features, currentGroup) {
        var result = {};
        angular.forEach(features, function(feature, key) {
            if (feature.group.indexOf(currentGroup) !== -1) {
                result[key] = feature;
            }
        });
        return result;
    };
});
// Helps to render a time value in the user selected format (feature)
angular.module('components.profile').filter('getCopy', ['$filter', '$log', function ($filter, $log) {
    //var log = $log.getInstance('filter');
    //log.error(features.copyFormat.value);
    
    return function (features, data) {
        var separator = ' | ';
        var output = '';
        var type = features.copyFormat.value || '';
        // Get the timestamp from the time or task definition:
        var timestamp = data.timestampDuration || data.durationNotChecked || '';
        
        // Precheck if type needs to be redefined first
        if (type === 'timeformat') {
            // Use timeformat from the other feature
            type = features.timeFormat.value || '';
        }

        switch(type) {
            case 'disabled':
                break;
            default:
            case 'dec':
            case 'hShort':
            case 'hShort+dec':
            case 'hLong':
            case 'hLong+dec':
                // Filter the duration to the wanted format
                output = $filter('timeInUserSelectedFormat')(timestamp, type);
                break;
            case 'project':
                output = data.project;
                break;
            case 'task':
                output = data.task;
                break;
            case 'description':
                if (data.text) {
                    // Copy description from time entry
                    output = data.text;
                } else if (data.tasks) {
                    // Copy all descriptions from the time entries of this task
                    angular.forEach(data.tasks, function(task){
                        output += task.text + "\r\n";
                    });
                }
                break;
            
        }
        return output;
    };
}]);

