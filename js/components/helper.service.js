angular.module('cycloneApp').factory('helperService', [
    function() {
    'use strict';

    function HelperService() {};

    HelperService.prototype.isNumeric = function(num){
        return !isNaN(num)
    };

    HelperService.prototype.getGroupId = function(existingGroups, projectName, taskName, groupType, groupTimestamp, group$id) {
        for (var gId in existingGroups) {
            // This goes over elements on timeline, which are not indexes, maybe check for integer on key?
            if (existingGroups.hasOwnProperty(gId) && this.isNumeric(gId)) {
                if (
                    existingGroups[gId].project === projectName
                    && existingGroups[gId].task === taskName
                    && existingGroups[gId].type === groupType
                ){
                    // Don't accept the same entry - this happens on timeline when model already was changed
                    if (existingGroups[gId].$id === group$id){
                        // console.log("same entry CONTINUE");
                        continue;
                    }
                    // Use this group if available
                    if (existingGroups[gId].group){
                        // console.log("existing");
                        // console.log(existingGroups[gId]);
                        return existingGroups[gId].group;
                    }
                }
            }
        }
        // console.log("no project match found");
        // console.log(groupTimestamp);
        // Defining new group name
        // When we use the timestamp it will be ordered and grouped correctly (timestamp of the latest entry)
        var groupIdDefinition = groupTimestamp;
        // Grouping with name or task or type, did not work as the ng-repeat re-ordered the elements
        // var groupIdDefinition = groupTimestamp + '_' + projectName + '_' + groupType  + '_' + taskName || '-';
        return groupIdDefinition;
    };

    return new HelperService();
}]);
