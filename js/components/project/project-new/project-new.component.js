var projectNew = {
    template: require('./project-new.tpl.html'),
    controller: 'ProjectNewController'
};

angular
    .module('components.project')
    .component('projectNew', projectNew)
    .config(function ($stateProvider){
        $stateProvider
            .state('new', {
                parent: 'app', // would be good, if we have auth on the app level, so its usable everywhere.
                url: '/new',
                component: 'projectNew'
            })
    });