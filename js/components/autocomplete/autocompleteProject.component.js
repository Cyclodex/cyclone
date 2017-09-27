var autocompleteProject = {
    template: require('./autocompleteProject.tpl.html'),
    // require: {
    //     task: '?^^',
    //     timeline: '?^^'
    // },
    bindings: {
        project: '<',
        setFocus: '<',
        onUpdate: '&'
    },
    controller: function($log, $document, ProjectService) {
        var ctrl = this;

        ctrl.projects = null;
        ctrl.querySearch   = querySearch;
        ctrl.selectedItemChange = selectedItemChange;
        ctrl.searchTextChange   = searchTextChange;

        // Initial values
        this.$onInit = function() {
            ctrl.setFocus = false;

            // This is for sure the wrong way, but I am learning so its fine for now.
            // This makes this component work also in the timeline.
            // TODO: I need to learn how such components need to be done correctly.
            if (this.task === null ){
                this.task = this.timeline;
            }
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
        function querySearch (query) {
            var results = query ? ctrl.projects.filter( createFilterFor(query) ) : ctrl.projects;
            return results;
        }

        function searchTextChange(text) {
            console.log(text);
            //$log.info('Text changed to ' + text);
            // ctrl.task.newEntryProject = text;
            // TODO: This should go out with a function call to the parent (on-change) not directly
        }

        function selectedItemChange(item) {
            if (item){
                $log.info('Item changed to ' + JSON.stringify(item));
                // TODO: This should go out with a function call to the parent (on-change) not directly
                // ctrl.task.newEntryProject = item.display;

                // Send out the selected project
                ctrl.onUpdate({
                    $event: {
                        project: item
                    }
                });
            }
        }

        /**
         * Build `projects` list of key/value pairs
         * TODO: Hook this up with users added projects
         */
        function loadAll() {
            ProjectService.getProjectList().$loaded().then(function(list){
                console.log("project loaded");
                console.log(list);
                return list;
            });
            // return allProjects = [
            //     {
            //         "display": "Kime",
            //         "value": "kime",
            //         "color": "blue"
            //     },{
            //         "display": "SIKA",
            //         "value": "sika",
            //         "color": "red"
            //     },{
            //         "display": "Viseca",
            //         "value": "viseca",
            //         "color": "yellow"
            //     },{
            //         "display": "Kobler-Partner",
            //         "value": "kobler-partner",
            //         "color": "blue"
            //     }
            // ];
        }

        /**
         * Create filter function for a query string
         */
        function createFilterFor(query) {
            var lowercaseQuery = angular.lowercase(query);
            console.log(lowercaseQuery);

            return function filterFn(project) {
                console.log(project);
                // Return all entries which contain the query somewhere
                return (project.name.indexOf(lowercaseQuery) !== -1);
            };

        }
    }
};

angular
    .module('components.time')
    .component('autocompleteProject', autocompleteProject);