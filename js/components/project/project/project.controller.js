function ProjectController() {
  var ctrl = this;
  ctrl.selectProject = function () {
    console.log('select Project');
    console.log(ctrl.project.$id);
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
