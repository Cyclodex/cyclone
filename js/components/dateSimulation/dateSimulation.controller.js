function DateSimulationController(moment) {
    var ctrl = this;
    ctrl.dateSimulation = false;

    ctrl.$onInit = function () {
        ctrl.updateDateSimulation();
    };

    ctrl.updateDateSimulation = function () {
        // Date simulation (for testing day jumps)
        if (ctrl.dateSimulation){
            // console.log("Simulation: ON");
            today = moment(ctrl.dateSimulation);
            moment.now = function () { return +new Date(today.valueOf() ); }
        } else {
            // console.log("Simulation: OFF");
        }
    };
}

DateSimulationController.$inject = ["moment"];

angular
    .module('components.date')
    .controller('DateSimulationController', DateSimulationController);