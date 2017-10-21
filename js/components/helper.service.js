angular.module('cycloneApp').factory('helperService', [
    function() {
    'use strict';

    function HelperService() {};

    HelperService.prototype.isNumeric = function(num){
        return !isNaN(num)
    };

    // Helper for getting the GroupID
    // Critical for making sure that entries are grouped together correctly
    HelperService.prototype.getGroupId = function(entries, projectName, taskName, type, defineNewGroup, group$id) {
        for (var gId in entries) {
            if (entries.hasOwnProperty(gId) && this.isNumeric(gId)) {
                if (
                    entries[gId].project === projectName
                    && entries[gId].task === taskName
                    && entries[gId].type === type
                ){
                    // Don't accept the same entry
                    // This happens on timeline when model already was changed
                    if (entries[gId].$id === group$id){
                        console.log("same entry CONTINUE");
                        continue;
                    }
                    // Use this group if available
                    if (entries[gId].group){
                        return entries[gId].group;
                    }
                }
            }
        }
        if (defineNewGroup){
            // Defining new group name
            // console.log("no entry matched, we should create a new group!");

            // The value can have impact on the ordering, as we create the groups based on this.
            var groupIdDefinition = Date.now();
            // An other solution would be some random generator, the following is save for 10'000 calls:
            // Math.random().toString(36).substr(2, 5).toUpperCase()
            return groupIdDefinition;
        }
        //console.log("nothing to return, no new group set");
        return false;
    };

    return new HelperService();
}]);
