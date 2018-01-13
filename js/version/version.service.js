import { appVersion } from 'js/version/version.js';
angular.module('cycloneApp').factory('versionService', [function() {
    'use strict';

    function VersionService() {
    }

    VersionService.prototype.getVersion = function() {
        var version = 'V 1.0.0-beta2 22.10.2017';
        version = appVersion;
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
