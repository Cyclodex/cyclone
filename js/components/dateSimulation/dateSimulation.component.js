var dateSimulation = {
    bindings: {
        dateSimulation: '=?',
    },
    template: require('./date-simulation.tpl.html'),
    controller: 'DateSimulationController'
};

angular
    .module('components.date')
    .component('dateSimulation', dateSimulation);
