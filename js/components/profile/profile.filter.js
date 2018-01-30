// Help to order a object in the other way (limitation of firebase)
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