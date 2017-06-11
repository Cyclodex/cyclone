angular.module('cycloneApp').factory('versionService', [function() {
    'use strict';

    function VersionService() {
    }

    VersionService.prototype.getVersion = function() {
        var version = '0.48 | 14.05.2017';
        if (!PRODUCTION) {
            if (FIREBASE_PRODUCTION) {
                return version + ' (PRODUCTION DB)';
            }
            if (!FIREBASE_PRODUCTION) {
                return version + ' (STAGING DB)';
            }
        }
    }

    VersionService.prototype.getChanglogUrl = function() {
        return 'https://github.com/Cyclodex/cyclone/blob/master/CHANGELOG.md';
    }

    VersionService.prototype.getIssuesUrl = function() {
        return 'https://github.com/Cyclodex/cyclone/issues';
    }

    return new VersionService();
}]);
