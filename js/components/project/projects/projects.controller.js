function ProjectsController($state) {
  var ctrl = this;
  var projects = ctrl.projects;

  ctrl.goToProject = function (event) {
    $state.go('project', {
      id: event.projectId
    });
  };
}

angular
  .module('components.project')
  .controller('ProjectsController', ProjectsController);
