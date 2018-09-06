const appVersion = require('../../package.json').version;
const appDate = require('./lastModified.js').appDate;
angular.module('cycloneApp').factory('versionService', [function() {
    'use strict';

    function VersionService() {}

    VersionService.prototype.getVersion = function() {
        const version = {
            number: 'V ' + appVersion,
            date: appDate,
            db: ' (DB ' + FIREBASE_DB_INSTANCE + ')'
        };
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
