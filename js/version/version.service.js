angular.module('cycloneApp').factory('versionService', [function() {
    'use strict';

    function VersionService() {
    }

    VersionService.prototype.getVersion = function() {
        var version = 'V 1.0.0-beta3';
        if (FIREBASE_DB_INSTANCE !== '') {
            version = version + ' (DB ' + FIREBASE_DB_INSTANCE + ')';
        }
        version = version + ' 05.01.2018';
        return version;
    }

    VersionService.prototype.getChanglogUrl = function() {
        return 'https://github.com/Cyclodex/cyclone/blob/master/CHANGELOG.md';
    }

    VersionService.prototype.getIssuesUrl = function() {
        return 'https://github.com/Cyclodex/cyclone/issues';
    }

    return new VersionService();
}]);
