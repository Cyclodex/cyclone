function ProjectController() {
  var ctrl = this;
  ctrl.selectProject = function () {
    ctrl.onSelect({
      $event: {
        projectId: ctrl.project.$id
      }
    });
  };
}

angular
  .module('components.project')
  .controller('ProjectController', ProjectController);
