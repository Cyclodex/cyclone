var addTime = {
    template: require('./addTime.tpl.html'),
    controller: 'AddTimeController',
    bindings: {
        entries: '='
    }
};

angular
    .module('components.time')
    .component('addTime', addTime);