var projectDetail = {
    bindings: {
        project: '<',
        onSave: '&',
        onUpdate: '&',
        onDelete: '&'
    },
    template: require('./project-detail.tpl.html'),
    controller: 'ProjectDetailController'
};

angular
    .module('components.project')
    .component('projectDetail', projectDetail);
