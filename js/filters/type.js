// Filter out specific types of entries
angular.module('cycloneApp').filter('filterType', function() {
    return function(collection, type) {
        if (!type) return collection;
        return collection.filter(function (value) {
            return value.type === type;
        })
    };
});

// Filter out specific types of entries
angular.module('cycloneApp').filter('filterCheckAble', function() {
    return function(collection, checkAble) {
        checkAble = (checkAble == 'true') ? true : false;
        if (checkAble === undefined) return collection;
        return collection.filter(function (value) {
            if ( (value.type === 'private') || (value.type === 'trust') ) {
                console.log("not checkable");
                if (checkAble === true) {
                    return false;
                } else {
                    return true;
                }
            } else if ( (value.type === 'internal') || (value.type === 'work') ){
                if (checkAble === true) {
                    return true;
                } else {
                    return false;
                }
            } else {
                return false;
            }
        })
    };
});