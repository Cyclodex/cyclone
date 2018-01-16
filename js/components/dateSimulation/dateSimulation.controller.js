function DateSimulationController(moment, $state, $timeout) {
    var ctrl = this;
    ctrl.dateSimulation = false;

    ctrl.$onInit = function () {
        ctrl.updateDateSimulation();
    };

    ctrl.updateDateSimulation = function () {
        // Date simulation (for testing day jumps)
        if (ctrl.dateSimulation){
            // console.log("Simulation: ON");
            // Re-defines what today is for moment()
            today = moment(ctrl.dateSimulation);
            moment.now = function () { return +new Date(today.valueOf() ); }
            // Now we would also need to update the timeout / recall checkTime() of dateSwitcherTimer
        } else {
            // console.log("Simulation: OFF");
        }
    };
}

DateSimulationController.$inject = ["moment", "$state", "$timeout"];

angular
    .module('components.date')
    .controller('DateSimulationController', DateSimulationController);