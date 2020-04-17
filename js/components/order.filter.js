// Help to order a object in the other way (limitation of firebase)
angular.module('cycloneApp').filter('orderObjectBy', function () {
    return function (items, field, reverse) {
        var filtered = [];
        angular.forEach(items, function (item) {
            filtered.push(item);
        });
        filtered.sort(function (a, b) {
            return (parseInt(a[field]) > parseInt(b[field]) ? 1 : -1);
        });
        if (reverse) filtered.reverse();
        return filtered;
    };
});