var project = {
    bindings: {
        project: '<',
        onSelect: '&'
    },
    template: require('./project.tpl.html'),
    controller: 'ProjectController'
};

angular
    .module('components.project')
    .component('project', project);
