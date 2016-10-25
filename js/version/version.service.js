angular.module('cycloneApp').factory('versionService', [function() {
    'use strict';

    function VersionService() {
    }

    VersionService.prototype.getVersion = function() {
        return '0.37 | 25.10.2016';
    }

    VersionService.prototype.getChanglogUrl = function() {
        return 'https://github.com/Cyclodex/cyclone/blob/master/CHANGELOG.md';
    }

    VersionService.prototype.getPreReleaseStatus = function() {
        return 'BETA';
    }

    return new VersionService();
}]);
