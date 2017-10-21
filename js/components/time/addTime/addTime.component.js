var addTime = {
    template: require('./addTime.tpl.html'),
    controller: 'AddTimeController'
};

angular
    .module('components.time')
    .component('addTime', addTime);