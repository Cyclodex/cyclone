var autocompleteProject = {
    template: require('./autocompleteProject.tpl.html'),
    bindings: {
        project: '<',
        setFocus: '<',
        onUpdate: '&'
    },
    controller: function($log, $document, ProjectService) {
        var ctrl = this;

        ctrl.projects = null;
        ctrl.selectedItemChange = selectedItemChange;
        ctrl.searchTextChange   = searchTextChange;

        // Initial values
        this.$onInit = function() {
            ctrl.setFocus = false;

            // Get project list
            ProjectService.getProjectList().$loaded().then(function(list){
                ctrl.projects = list;
            });
        };

        // Act on changes from outside
        this.$onChanges = function (changesObj) {
            if (changesObj.setFocus) {
                if (changesObj.setFocus.currentValue){
                    // We reset the focus attribute again
                    // ctrl.setFocus = false;
                    ctrl.task.focusNewEntryProject = false;
                }
            }
        };

        /**
         * Search for projects...
         * TODO: Implement firebase lookup.
         */
        ctrl.querySearch = function(query) {
            var results = query ? ctrl.projects.filter( createFilterFor(query) ) : ctrl.projects;
            return results;
        };

        function searchTextChange(text) {
            // TODO: We probably don't need this.
            //$log.info('Text changed to ' + text);
            // ctrl.task.newEntryProject = text;
        }

        function selectedItemChange(item) {
            if (item){
                $log.info('Item changed to ' + JSON.stringify(item));
                // Send out the selected project
                ctrl.onUpdate({
                    $event: {
                        project: item
                    }
                });
            }
        }

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
    }
};

angular
    .module('components.time')
    .component('autocompleteProject', autocompleteProject);