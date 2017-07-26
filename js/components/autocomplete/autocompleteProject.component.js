angular.module('cycloneApp').component('autocompleteProject', {
    template: require('./autocompleteProject.tpl.html'),
    require: {
        task: '?^^',
        timeline: '?^^'
    },
    bindings: {
        project: '<',
        setFocus: '<'
    },
    controller: function($log, $document) {
        var self = this;

        self.projects        = loadAll();
        self.querySearch   = querySearch;
        self.selectedItemChange = selectedItemChange;
        self.searchTextChange   = searchTextChange;

        // Initial values
        this.$onInit = function() {
            self.setFocus = false;

            // This is for sure the wrong way, but I am learning so its fine for now.
            // This makes this component work also in the timeline.
            // TODO: I need to learn how such components need to be done correctly.
            if (this.task === null ){
                this.task = this.timeline;
            }
        };

        // Act on changes from outside
        this.$onChanges = function (changesObj) {
            if (changesObj.setFocus) {
                if (changesObj.setFocus.currentValue){
                    // We reset the focus attribute again
                    // self.setFocus = false;
                    self.task.focusNewEntryProject = false;
                }
            }
        };

        /**
         * Search for projects...
         * TODO: Implement firebase lookup.
         */
        function querySearch (query) {
            var results = query ? self.projects.filter( createFilterFor(query) ) : self.projects;
            return results;
        }

        function searchTextChange(text) {
            $log.info('Text changed to ' + text);
            self.task.newEntryProject = text;
            // TODO: This should go out with a function call to the parent (on-change) not directly
        }

        function selectedItemChange(item) {
            if (item){
                $log.info('Item changed to ' + JSON.stringify(item));
                // TODO: This should go out with a function call to the parent (on-change) not directly
                self.task.newEntryProject = item.display;
            }
        }

        /**
         * Build `projects` list of key/value pairs
         * TODO: Hook this up with users added projects
         */
        function loadAll() {
            return allProjects = [
                {
                    "display": "Kime",
                    "value": "kime",
                    "color": "blue"
                },{
                    "display": "SIKA",
                    "value": "sika",
                    "color": "red"
                },{
                    "display": "Viseca",
                    "value": "viseca",
                    "color": "yellow"
                },{
                    "display": "Kobler-Partner",
                    "value": "kobler-partner",
                    "color": "blue"
                }
            ];
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);

            return function filterFn(project) {
                // Return all entries which contain the query somewhere
                return (project.value.indexOf(lowercaseQuery) !== -1);
            };

        }
    }
});