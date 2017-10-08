var autocompleteProject = {
    template: require('./autocompleteProject.tpl.html'),
    bindings: {
        project: '=',
        setFocus: '<',
        onUpdate: '&',
        onSetFocus: '&'
    },
    controller: function($log, $document, ProjectService, $timeout) {
        var ctrl = this;

        ctrl.projects = null;

        // Initial values
        this.$onInit = function() {
            // Get project list
            ProjectService.getProjectList().$loaded().then(function(list){
                ctrl.projects = list;
            });
        };

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(project) {
                var projectSearch = angular.lowercase(project.name);
                // Return all entries which contain the query somewhere
                return (projectSearch.indexOf(lowercaseQuery) !== -1);
            };

        }
        /**
         * Search for projects...
         */
        ctrl.querySearch = function(query) {
            var results = query ? ctrl.projects.filter( createFilterFor(query) ) : ctrl.projects;
            return results;
        };

        // This is the change event when the string doesn't match a predefined project
        ctrl.searchTextChange = function searchTextChange(text) {
            // $log.info('Text changed to ' + text);
        };

        // This is the event when a project matches (so its selected)
        ctrl.selectedItemChange = function selectedItemChange(item) {
            if (item){
                //$log.info('Item changed to ' + JSON.stringify(item));
                // Send out the selected project (as object)
                ctrl.onUpdate({
                    $event: {
                        project: item
                    }
                });
            }
        };

        /**
         * When leaving the autocomplete with a value which is not in the list, we need to send this back
         * @param event
         */
        ctrl.onBlur = function (event){
            ctrl.onUpdate({
                $event: {
                    project: {
                        // For new projects we only send the new name
                        name: ctrl.project // we take the model which should be up to date
                    }
                }
            });
        };
    }
};

angular
    .module('components.time')
    .component('autocompleteProject', autocompleteProject);